'use server'

import { z } from 'zod';
import { Resend } from 'resend';

const contactSchema = z.object({
  name: z.string().min(1, 'required'),
  email: z.string().email(),
  subject: z.string().min(1, 'required'),
  message: z.string().min(10, 'messageMin'),
});

export type ContactFormState = {
  success: boolean;
  sendError?: boolean;
  sendErrorDetail?: string;
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
  values?: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
};

export async function sendContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  const submittedValues = {
    name: String(raw.name ?? ''),
    email: String(raw.email ?? ''),
    subject: String(raw.subject ?? ''),
    message: String(raw.message ?? ''),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    // Normalize email errors to short key for translateError in the client component
    const normalizedErrors: ContactFormState['errors'] = {
      name: fieldErrors.name,
      email: fieldErrors.email?.map(() => 'email'),
      subject: fieldErrors.subject,
      message: fieldErrors.message,
    };
    return {
      success: false,
      errors: normalizedErrors,
      values: submittedValues,
    };
  }

  const { name, email, subject, message } = parsed.data;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
      to: [process.env.ORG_EMAIL!],
      subject: `Contact Form: ${subject}`,
      html: `
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    if (error) {
      const detail = `Resend error: ${error.name} — ${error.message}`;
      console.error(detail);
      return { success: false, sendError: true, sendErrorDetail: detail, values: submittedValues };
    }

    return { success: true };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error('Contact form send error:', detail);
    return { success: false, sendError: true, sendErrorDetail: detail, values: submittedValues };
  }
}
