'use client'

import { useActionState } from 'react';
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

  if (state.success) {
    return (
      <div className="rounded-lg border border-brand-green/30 bg-brand-green/5 p-6 text-center">
        <p className="text-brand-green font-medium">{t('successMessage')}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          {t('formName')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
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
        className="w-full bg-brand-green hover:bg-brand-green-dark text-white"
      >
        {pending ? '...' : t('formSubmit')}
      </Button>
    </form>
  );
}
