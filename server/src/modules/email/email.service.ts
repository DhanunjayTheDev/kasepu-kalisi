import nodemailer from "nodemailer";
import { env } from "../../config/env";
import { EmailLog } from "./emailLog.model";
import { renderEmailTemplate } from "./email.templates";

const transporter =
  env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT ?? 587,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      })
    : null;

interface SendEmailInput {
  to: string;
  template: string;
  data: Record<string, unknown>;
  attachments?: { filename: string; content: Buffer }[];
}

export async function sendEmail({ to, template, data, attachments }: SendEmailInput) {
  const { subject, html } = renderEmailTemplate(template, data);

  try {
    if (transporter) {
      await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html, attachments });
    } else {
      // No SMTP configured (dev default) — log instead of sending, so the flow still completes.
      console.log(`[email:${env.EMAIL_PROVIDER}] to=${to} subject="${subject}"`);
    }

    await EmailLog.create({ to, template, status: "sent" });
  } catch (err) {
    await EmailLog.create({ to, template, status: "failed", error: (err as Error).message });
    throw err;
  }
}
