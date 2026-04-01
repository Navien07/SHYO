'use server'

import { z } from 'zod';
import { Resend } from 'resend';

const membershipSchema = z.object({
  fullName: z.string().min(1, 'required'),
  dob: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'dobFormat'),
  gender: z.enum(['male', 'female', 'prefer_not_to_say']),
  mobile: z.string().min(1, 'required'),
  email: z.string().email(),
  location: z.string().min(1, 'required'),
  interests: z.array(z.string()).min(1, 'interestsMin'),
  pdpaConsent: z.literal(true).refine((v) => v === true, { message: 'pdpaRequired' }),
});

export type MembershipFormState = {
  success: boolean;
  sendError?: boolean;
  sendErrorDetail?: string;
  errors?: {
    fullName?: string[];
    dob?: string[];
    gender?: string[];
    mobile?: string[];
    email?: string[];
    location?: string[];
    interests?: string[];
    pdpaConsent?: string[];
  };
  values?: {
    fullName: string;
    dob: string;
    gender: string;
    mobile: string;
    email: string;
    location: string;
    interests: string[];
  };
};

export async function submitMembership(
  prevState: MembershipFormState,
  formData: FormData
): Promise<MembershipFormState> {
  const raw = {
    fullName: formData.get('fullName'),
    dob: formData.get('dob'),
    gender: formData.get('gender'),
    mobile: formData.get('mobile'),
    email: formData.get('email'),
    location: formData.get('location'),
    interests: formData.getAll('interests'),
    pdpaConsent: formData.get('pdpaConsent') === 'on',
  };

  const submittedValues = {
    fullName: String(raw.fullName ?? ''),
    dob: String(raw.dob ?? ''),
    gender: String(raw.gender ?? ''),
    mobile: String(raw.mobile ?? ''),
    email: String(raw.email ?? ''),
    location: String(raw.location ?? ''),
    interests: (raw.interests as string[]).map(String),
  };

  const parsed = membershipSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    // Normalize email errors to short key for translateError in the client component
    const normalizedErrors: MembershipFormState['errors'] = {
      fullName: fieldErrors.fullName,
      dob: fieldErrors.dob,
      gender: fieldErrors.gender,
      mobile: fieldErrors.mobile,
      email: fieldErrors.email?.map(() => 'email'),
      location: fieldErrors.location,
      interests: fieldErrors.interests,
      pdpaConsent: fieldErrors.pdpaConsent,
    };
    return {
      success: false,
      errors: normalizedErrors,
      values: submittedValues,
    };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send 1 — Applicant confirmation
    const { error: applicantError } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
      to: [parsed.data.email],
      subject: 'Your Seputeh HYO membership application has been received',
      html: `<p>Dear ${parsed.data.fullName},</p><p>Thank you for your membership application to Seputeh HYO. We have received your details and will be in touch soon.</p><p>Best regards,<br/>Seputeh HYO</p>`,
    });

    if (applicantError) {
      const detail = `Resend error (applicant): ${applicantError.name} — ${applicantError.message}`;
      console.error(detail);
      return { success: false, sendError: true, sendErrorDetail: detail, values: submittedValues };
    }

    // Send 2 — Org notification
    const { error: orgError } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
      to: [process.env.ORG_EMAIL!],
      subject: 'New Membership Application',
      html: `<p><strong>New membership application received:</strong></p>
        <p><strong>Name:</strong> ${parsed.data.fullName}</p>
        <p><strong>DOB:</strong> ${parsed.data.dob}</p>
        <p><strong>Gender:</strong> ${parsed.data.gender}</p>
        <p><strong>Mobile:</strong> ${parsed.data.mobile}</p>
        <p><strong>Email:</strong> ${parsed.data.email}</p>
        <p><strong>Location:</strong> ${parsed.data.location}</p>
        <p><strong>Interests:</strong> ${parsed.data.interests.join(', ')}</p>
        <p><strong>PDPA Consent:</strong> Yes</p>`,
    });

    if (orgError) {
      const detail = `Resend error (org): ${orgError.name} — ${orgError.message}`;
      console.error(detail);
      return { success: false, sendError: true, sendErrorDetail: detail, values: submittedValues };
    }

    return { success: true };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error('Membership form send error:', detail);
    return { success: false, sendError: true, sendErrorDetail: detail, values: submittedValues };
  }
}
