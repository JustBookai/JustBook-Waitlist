"use server";

import nodemailer from 'nodemailer';
import { generateEmailHtml } from '@/components/email-template';
import fs from 'fs/promises';
import path from 'path';

// Gmail Transporter Setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const STATS_FILE = path.join(process.cwd(), 'stats.json');
const WAITLIST_CSV = path.join(process.cwd(), 'waitlist.csv');
const OPT_OUTS_CSV = path.join(process.cwd(), 'opt-outs.csv');
const LOGO_PATH = path.join(process.cwd(), 'public', 'JB.png');

// Initialize files if they don't exist
async function initFiles() {
    try {
        await fs.access(WAITLIST_CSV);
    } catch {
        await fs.writeFile(WAITLIST_CSV, 'Name,Email,Date\n');
    }
    try {
        await fs.access(OPT_OUTS_CSV);
    } catch {
        await fs.writeFile(OPT_OUTS_CSV, 'Name,Email,Date\n');
    }
    try {
        await fs.access(STATS_FILE);
    } catch {
        await fs.writeFile(STATS_FILE, JSON.stringify({ signups: 0, surveyTaps: 0 }, null, 2));
    }
}

async function getStats() {
    await initFiles();
    try {
        const data = await fs.readFile(STATS_FILE, 'utf-8');
        const stats = JSON.parse(data);
        const users = await getWaitlistUsers();
        if (stats.signups !== users.length) {
            stats.signups = users.length;
            await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
        }
        return stats;
    } catch (error) {
        const users = await getWaitlistUsers();
        const initialStats = { signups: users.length, surveyTaps: 0 };
        await fs.writeFile(STATS_FILE, JSON.stringify(initialStats, null, 2));
        return initialStats;
    }
}

async function updateStats(updates: { signups?: number, surveyTaps?: number }) {
    const current = await getStats();
    const next = { ...current, ...updates };
    await fs.writeFile(STATS_FILE, JSON.stringify(next, null, 2));
    return next;
}

export async function getWaitlistUsers(): Promise<{ name: string, email: string, date: string }[]> {
    await initFiles();
    try {
        const data = await fs.readFile(WAITLIST_CSV, 'utf-8');
        const lines = data.split('\n').slice(1).filter(line => line.trim() !== '');
        return lines.map(line => {
            const [name, email, date] = line.split(',');
            return { name, email, date };
        });
    } catch (error) {
        return [];
    }
}

export async function getOptOutUsers(): Promise<{ name: string, email: string, date: string }[]> {
    await initFiles();
    try {
        const data = await fs.readFile(OPT_OUTS_CSV, 'utf-8');
        const lines = data.split('\n').slice(1).filter(line => line.trim() !== '');
        return lines.map(line => {
            const [name, email, date] = line.split(',');
            return { name, email, date };
        });
    } catch (error) {
        return [];
    }
}

async function saveUser(name: string, email: string) {
    const users = await getWaitlistUsers();
    if (!users.some(u => u.email === email)) {
        const date = new Date().toISOString();
        const newLine = `${name.replace(/,/g, '')},${email},${date}\n`;
        await fs.appendFile(WAITLIST_CSV, newLine);

        // Remove from opt-outs if they re-register
        const optOuts = await getOptOutUsers();
        const remainingOptOuts = optOuts.filter(u => u.email !== email);
        if (optOuts.length !== remainingOptOuts.length) {
            const header = 'Name,Email,Date\n';
            const content = remainingOptOuts.map(u => `${u.name},${u.email},${u.date}`).join('\n');
            await fs.writeFile(OPT_OUTS_CSV, header + (content ? content + '\n' : ''));
        }
        return true;
    }
    return false;
}

async function removeUser(email: string) {
    const users = await getWaitlistUsers();
    const userToRemove = users.find(u => u.email === email);
    if (userToRemove) {
        const remainingUsers = users.filter(u => u.email !== email);
        const header = 'Name,Email,Date\n';
        const content = remainingUsers.map(u => `${u.name},${u.email},${u.date}`).join('\n');
        await fs.writeFile(WAITLIST_CSV, header + (content ? content + '\n' : ''));

        // Add to opt-outs
        const optOuts = await getOptOutUsers();
        if (!optOuts.some(u => u.email === email)) {
            const date = new Date().toISOString();
            const newLine = `${userToRemove.name},${email},${date}\n`;
            await fs.appendFile(OPT_OUTS_CSV, newLine);
        }
        return userToRemove;
    }
    return null;
}

export async function joinWaitlist(formData: FormData) {
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.toLowerCase().trim();

    if (!name) return { error: 'Name is required' };
    if (!email) return { error: 'Email is required' };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { error: 'Invalid email address' };

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        return { error: 'Server configuration error' };
    }

    const users = await getWaitlistUsers();
    if (users.some(u => u.email === email)) return { error: 'ALREADY_REGISTERED', message: 'You are already on the waitlist!' };

    try {
        await saveUser(name, email);
        await updateStats({ signups: users.length + 1 });
        const emailHtml = generateEmailHtml({ email, name, type: 'welcome' });

        await transporter.sendMail({
            from: `"JustBook" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Welcome to the JustBook Waitlist! 🚀',
            html: emailHtml,
            attachments: [{
                filename: 'JB.png',
                path: LOGO_PATH,
                cid: 'jblogo'
            }]
        });
        return { success: true };
    } catch (error) {
        console.error('Email error:', error);
        return { success: true, warning: 'Joined, but confirmation email failed.' };
    }
}

export async function unsubscribeWaitlist(email: string) {
    const sanitizedEmail = email.toLowerCase().trim();
    const removedUser = await removeUser(sanitizedEmail);
    if (removedUser) {
        const usersSize = (await getWaitlistUsers()).length;
        await updateStats({ signups: usersSize });
        try {
            const emailHtml = generateEmailHtml({ email: sanitizedEmail, name: removedUser.name, type: 'unsubscribe' });
            await transporter.sendMail({
                from: `"JustBook" <${process.env.GMAIL_USER}>`,
                to: sanitizedEmail,
                subject: 'Removed from JustBook Waitlist',
                html: emailHtml,
                attachments: [{
                    filename: 'JB.png',
                    path: LOGO_PATH,
                    cid: 'jblogo'
                }]
            });
        } catch (e) { }
        return { success: true };
    }
    return { error: 'Email not found on waitlist.' };
}

export async function trackSurveyTap() {
    try {
        const stats = await getStats();
        await updateStats({ surveyTaps: stats.surveyTaps + 1 });
        return { success: true };
    } catch (error) {
        return { error: 'Failed to track tap' };
    }
}

export async function getLiveStats() {
    return await getStats();
}

export async function getAdminData() {
    const registered = await getWaitlistUsers();
    const optOuts = await getOptOutUsers();
    const stats = await getStats();
    return { registered, optOuts, stats };
}

export async function downloadWaitlistCSV() {
    try {
        return await fs.readFile(WAITLIST_CSV, 'utf-8');
    } catch {
        return 'Name,Email,Date\n';
    }
}

export async function downloadOptOutsCSV() {
    try {
        return await fs.readFile(OPT_OUTS_CSV, 'utf-8');
    } catch {
        return 'Name,Email,Date\n';
    }
}
