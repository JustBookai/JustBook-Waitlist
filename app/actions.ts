"use server";

import nodemailer from 'nodemailer';
import { generateEmailHtml } from '@/components/email-template';
import { supabase } from '@/lib/supabase';
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

const LOGO_PATH = path.join(process.cwd(), 'public', 'JB.png');

export async function getLiveStats() {
    try {
        // Get signup count
        const { count: signups, error: signupError } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true });

        if (signupError) throw signupError;

        // Get survey taps
        const { data: statsData, error: statsError } = await supabase
            .from('stats')
            .select('survey_taps')
            .eq('id', 1)
            .single();

        if (statsError) throw statsError;

        return {
            signups: signups || 0,
            surveyTaps: statsData?.survey_taps || 0
        };
    } catch (error) {
        console.error('Error fetching live stats:', error);
        return { signups: 0, surveyTaps: 0 };
    }
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

    try {
        // 1. Check for duplicates in Supabase
        const { data: existingUser } = await supabase
            .from('waitlist')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            return { error: 'ALREADY_REGISTERED', message: 'You are already on the waitlist!' };
        }

        // 2. Save user to Supabase
        const { error: insertError } = await supabase
            .from('waitlist')
            .insert([{ name, email }]);

        if (insertError) throw insertError;

        // 3. Send Email via Gmail
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
        console.error('Join waitlist error:', error);
        return { success: true, warning: 'Joined, but confirmation email failed.' };
    }
}

export async function unsubscribeWaitlist(email: string) {
    const sanitizedEmail = email.toLowerCase().trim();

    try {
        // 1. Get user data before deleting
        const { data: userData, error: fetchError } = await supabase
            .from('waitlist')
            .select('name')
            .eq('email', sanitizedEmail)
            .single();

        if (fetchError || !userData) {
            return { error: 'Email not found on waitlist.' };
        }

        // 2. Add to opt-outs (history table)
        await supabase
            .from('opt_outs')
            .insert([{ name: userData.name, email: sanitizedEmail }]);

        // 3. Delete from waitlist
        const { error: deleteError } = await supabase
            .from('waitlist')
            .delete()
            .eq('email', sanitizedEmail);

        if (deleteError) throw deleteError;

        // 4. Send Confirmation Email
        try {
            const emailHtml = generateEmailHtml({ email: sanitizedEmail, name: userData.name, type: 'unsubscribe' });
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
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return { error: 'Failed to unsubscribe.' };
    }
}

export async function trackSurveyTap() {
    try {
        const { data, error } = await supabase.rpc('increment_survey_taps');

        if (error) {
            // Fallback if RPC is not set up
            const { data: currentStats } = await supabase
                .from('stats')
                .select('survey_taps')
                .eq('id', 1)
                .single();

            await supabase
                .from('stats')
                .update({ survey_taps: (currentStats?.survey_taps || 0) + 1 })
                .eq('id', 1);
        }

        return { success: true };
    } catch (error) {
        return { error: 'Failed to track tap' };
    }
}

export async function getAdminData() {
    try {
        const { data: registered } = await supabase
            .from('waitlist')
            .select('*')
            .order('created_at', { ascending: false });

        const { data: optOuts } = await supabase
            .from('opt_outs')
            .select('*')
            .order('created_at', { ascending: false });

        const stats = await getLiveStats();

        return {
            registered: registered || [],
            optOuts: optOuts || [],
            stats
        };
    } catch (error) {
        console.error('Error fetching admin data:', error);
        return { registered: [], optOuts: [], stats: { signups: 0, surveyTaps: 0 } };
    }
}

export async function downloadWaitlistCSV() {
    const { data } = await supabase.from('waitlist').select('name, email, created_at');
    const header = 'Name,Email,Date\n';
    const content = data?.map(u => `${u.name},${u.email},${u.created_at}`).join('\n') || '';
    return header + content;
}

export async function downloadOptOutsCSV() {
    const { data } = await supabase.from('opt_outs').select('name, email, created_at');
    const header = 'Name,Email,Date\n';
    const content = data?.map(u => `${u.name},${u.email},${u.created_at}`).join('\n') || '';
    return header + content;
}
