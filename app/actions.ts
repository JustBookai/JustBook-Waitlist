"use server";

import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';
import fs from 'fs/promises';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY || "");
const STATS_FILE = path.join(process.cwd(), 'stats.json');
const EMAILS_FILE = path.join(process.cwd(), 'emails.json');

async function getStats() {
    try {
        const data = await fs.readFile(STATS_FILE, 'utf-8');
        const stats = JSON.parse(data);

        // Sync signups with emails.json count
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

async function getRegisteredEmails(): Promise<string[]> {
    try {
        const data = await fs.readFile(EMAILS_FILE, 'utf-8');
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
        return true;
    }
    return false;
}

export async function joinWaitlist(formData: FormData) {
    const email = (formData.get('email') as string)?.toLowerCase().trim();

    if (!email) {
        return { error: 'Email is required' };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: 'Invalid email address' };
    }

    // 1. Check for duplicates
    const emails = await getRegisteredEmails();
    if (emails.includes(email)) {
        return { error: 'You are already on the waitlist!' };
    }

    try {
        // 2. Save email FIRST to prevent race conditions or missed counts
        await saveEmail(email);
        const updatedStats = await updateStats({ signups: emails.length + 1 });

        // 3. Send Email via Resend
        if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "") {
            try {
                const { error } = await resend.emails.send({
                    from: 'JustBook <onboarding@resend.dev>',
                    to: [email],
                    subject: 'Welcome to the JustBook Waitlist!',
                    react: EmailTemplate({ email }),
                });

                if (error) {
                    console.error('Resend Error:', error);
                    // If the error code indicates a domain issue, log a helpful message for the user
                    if (error.name === 'validation_error') {
                        console.log('TIP: If using onboarding@resend.dev, you can only send to your own registered email address.');
                    }
                }
            } catch (err) {
                console.error('Email Delivery Failed:', err);
            }
        } else {
            console.warn("RESEND_API_KEY is missing. User was added but no email was sent.");
        }

        return { success: true };
    } catch (error) {
        console.error('Waitlist error:', error);
        return { error: 'Failed to join waitlist. Please try again.' };
    }
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
