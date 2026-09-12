import { Resend } from 'resend';
import { logError } from '../helpers/logger.js';
import VerificationEmail from './templates/VerificationEmail.js';

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

export async function sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

    try {
        await resend.emails.send({
            from: FROM_ADDRESS,
            to: email,
            subject: "Verify your email",
            react: VerificationEmail({ verifyUrl })
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes("own email address")) {
            console.warn(`[send-verification-email]: Skipped sending email to ${email} - Resend sandbox restriction (no verified domain).`);
        } else {
            logError("[send-verification-email]:", error);
        }
    }
}
