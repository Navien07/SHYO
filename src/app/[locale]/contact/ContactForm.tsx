'use client'

import { useActionState, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { sendContactForm, type ContactFormState } from './actions';
import { Button } from '@/components/ui/button';

const initialState: ContactFormState = { success: false };

// Maps Zod error keys to next-intl translation keys
function translateError(key: string | undefined, t: (k: string) => string): string | undefined {
  if (!key) return undefined;
  if (key === 'required') return t('errorRequired');
  if (key === 'email') return t('errorEmail');
  if (key === 'messageMin') return t('errorMessageMin');
  return key;
}

export function ContactForm() {
  const t = useTranslations('contact');
  const [state, formAction, pending] = useActionState(sendContactForm, initialState);
  const [showSuccess, setShowSuccess] = useState(false);

  // Controlled field values — preserved across server round-trips
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });

  // Restore field values from server state on validation error
  useEffect(() => {
    if (state.values) {
      setValues(state.values);
    }
  }, [state.values]);

  // Show popup when server confirms success
  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      setValues({ name: '', email: '', subject: '', message: '' });
    }
  }, [state.success]);

  function set(field: keyof typeof values) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  return (
    <>
      {/* Success popup overlay */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-sm w-full text-center mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('successTitle')}</h3>
            <p className="text-gray-500 mb-6">{t('successMessage')}</p>
            <Button
              onClick={() => setShowSuccess(false)}
              className="bg-brand-green hover:bg-brand-green/90 text-white px-8"
            >
              {t('successClose')}
            </Button>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        {/* Send error banner */}
        {state.sendError && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {t('sendError')}
            {state.sendErrorDetail && (
              <p className="mt-1 text-xs opacity-70">{state.sendErrorDetail}</p>
            )}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('formName')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={set('name')}
            placeholder={t('namePlaceholder')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            aria-describedby={state.errors?.name ? 'name-error' : undefined}
          />
          {state.errors?.name?.[0] && (
            <p id="name-error" className="mt-1 text-sm text-red-600">
              {translateError(state.errors.name[0], t)}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('formEmail')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={set('email')}
            placeholder={t('emailPlaceholder')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            aria-describedby={state.errors?.email ? 'email-error' : undefined}
          />
          {state.errors?.email?.[0] && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {translateError(state.errors.email[0], t)}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            {t('formSubject')}
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={values.subject}
            onChange={set('subject')}
            placeholder={t('subjectPlaceholder')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            aria-describedby={state.errors?.subject ? 'subject-error' : undefined}
          />
          {state.errors?.subject?.[0] && (
            <p id="subject-error" className="mt-1 text-sm text-red-600">
              {translateError(state.errors.subject[0], t)}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            {t('formMessage')}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={set('message')}
            placeholder={t('messagePlaceholder')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
            aria-describedby={state.errors?.message ? 'message-error' : undefined}
          />
          {state.errors?.message?.[0] && (
            <p id="message-error" className="mt-1 text-sm text-red-600">
              {translateError(state.errors.message[0], t)}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="w-full bg-brand-green hover:bg-brand-green/90 text-white"
        >
          {pending ? '...' : t('formSubmit')}
        </Button>
      </form>
    </>
  );
}
