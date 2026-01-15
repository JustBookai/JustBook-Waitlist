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
const EMAILS_FILE = path.join(process.cwd(), 'emails.json');
const OPT_OUTS_FILE = path.join(process.cwd(), 'opt-outs.json');

async function getStats() {
    try {
        const data = await fs.readFile(STATS_FILE, 'utf-8');
        const stats = JSON.parse(data);
        const emails = await getRegisteredEmails();
        if (stats.signups !== emails.length) {
            stats.signups = emails.length;
            await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
        }
        return stats;
    } catch (error) {
        const emails = await getRegisteredEmails();
        const initialStats = { signups: emails.length, surveyTaps: 0 };
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

export async function getRegisteredEmails(): Promise<string[]> {
    try {
        const data = await fs.readFile(EMAILS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function getOptOutEmails(): Promise<string[]> {
    try {
        const data = await fs.readFile(OPT_OUTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveEmail(email: string) {
    const emails = await getRegisteredEmails();
    if (!emails.includes(email)) {
        emails.push(email);
        await fs.writeFile(EMAILS_FILE, JSON.stringify(emails, null, 2));

        // Safety: Remove from opt-outs if they re-register
        const optOuts = await getOptOutEmails();
        const filteredOptOuts = optOuts.filter(e => e !== email);
        if (optOuts.length !== filteredOptOuts.length) {
            await fs.writeFile(OPT_OUTS_FILE, JSON.stringify(filteredOptOuts, null, 2));
        }
        return true;
    }
    return false;
}

async function removeEmail(email: string) {
    const emails = await getRegisteredEmails();
    const index = emails.indexOf(email);
    if (index > -1) {
        emails.splice(index, 1);
        await fs.writeFile(EMAILS_FILE, JSON.stringify(emails, null, 2));

        // Add to opt-outs history
        const optOuts = await getOptOutEmails();
        if (!optOuts.includes(email)) {
            optOuts.push(email);
            await fs.writeFile(OPT_OUTS_FILE, JSON.stringify(optOuts, null, 2));
        }
        return true;
    }
    return false;
}

export async function joinWaitlist(formData: FormData) {
    const email = (formData.get('email') as string)?.toLowerCase().trim();
    if (!email) return { error: 'Email is required' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { error: 'Invalid email address' };

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.error("EMAIL ERROR: GMAIL_USER or GMAIL_APP_PASSWORD is not set");
        return { error: 'Server configuration error' };
    }

    const emails = await getRegisteredEmails();
    if (emails.includes(email)) return { error: 'ALREADY_REGISTERED', message: 'You are already on the waitlist!' };

    try {
        await saveEmail(email);
        await updateStats({ signups: emails.length + 1 });
        const emailHtml = generateEmailHtml({ email, type: 'welcome' });
        await transporter.sendMail({
            from: `"JustBook" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Welcome to the JustBook Waitlist! 🚀',
            html: emailHtml,
        });
        return { success: true };
    } catch (error) {
        return { success: true, warning: 'Joined, but confirmation email failed.' };
    }
}

export async function unsubscribeWaitlist(email: string) {
    const sanitizedEmail = email.toLowerCase().trim();
    const removed = await removeEmail(sanitizedEmail);
    if (removed) {
        const emailsSize = (await getRegisteredEmails()).length;
        await updateStats({ signups: emailsSize });
        try {
            const emailHtml = generateEmailHtml({ email: sanitizedEmail, type: 'unsubscribe' });
            await transporter.sendMail({
                from: `"JustBook" <${process.env.GMAIL_USER}>`,
                to: sanitizedEmail,
                subject: 'Removed from JustBook Waitlist',
                html: emailHtml,
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
    const registered = await getRegisteredEmails();
    const optOuts = await getOptOutEmails();
    const stats = await getStats();
    return { registered, optOuts, stats };
}
