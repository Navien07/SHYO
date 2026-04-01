'use client'

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import { submitMembership, type MembershipFormState } from './actions';
import { Button } from '@/components/ui/button';

const initialState: MembershipFormState = { success: false };

function translateError(key: string | undefined, t: (k: string) => string): string | undefined {
  if (!key) return undefined;
  if (key === 'required') return t('errorRequired');
  if (key === 'email') return t('errorEmail');
  if (key === 'dobFormat') return t('errorDobFormat');
  if (key === 'interestsMin') return t('errorInterestsMin');
  if (key === 'pdpaRequired') return t('errorPdpaRequired');
  return key;
}

// Separate inner component so we can remount it (clearing values) via key change
function FormFields({
  t,
  state,
  formAction,
  pending,
  pdpaChecked,
  setPdpaChecked,
}: {
  t: ReturnType<typeof useTranslations<'membership'>>;
  state: MembershipFormState;
  formAction: (payload: FormData) => void;
  pending: boolean;
  pdpaChecked: boolean;
  setPdpaChecked: (v: boolean) => void;
}) {
  const [values, setValues] = useState({
    fullName: '',
    dob: '',
    gender: '',
    mobile: '',
    email: '',
    location: '',
  });

  function set(field: keyof typeof values) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.sendError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {t('sendError')}
          {state.sendErrorDetail && (
            <p className="mt-1 text-xs opacity-70">{state.sendErrorDetail}</p>
          )}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-normal text-gray-700 mb-1">
          {t('fullNameLabel')}
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={values.fullName}
          onChange={set('fullName')}
          placeholder={t('fullNamePlaceholder')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          aria-describedby={state.errors?.fullName ? 'fullName-error' : undefined}
        />
        {state.errors?.fullName?.[0] && (
          <p id="fullName-error" className="mt-1 text-sm text-red-600">
            {translateError(state.errors.fullName[0], t)}
          </p>
        )}
      </div>

      {/* DOB + Gender row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dob" className="block text-sm font-normal text-gray-700 mb-1">
            {t('dobLabel')}
          </label>
          <input
            id="dob"
            name="dob"
            type="text"
            value={values.dob}
            onChange={set('dob')}
            placeholder={t('dobPlaceholder')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            aria-describedby={state.errors?.dob ? 'dob-error' : undefined}
          />
          {state.errors?.dob?.[0] && (
            <p id="dob-error" className="mt-1 text-sm text-red-600">
              {translateError(state.errors.dob[0], t)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-normal text-gray-700 mb-1">
            {t('genderLabel')}
          </label>
          <select
            id="gender"
            name="gender"
            value={values.gender}
            onChange={set('gender')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green appearance-none bg-white"
            aria-describedby={state.errors?.gender ? 'gender-error' : undefined}
          >
            <option value="">—</option>
            <option value="male">{t('genderMale')}</option>
            <option value="female">{t('genderFemale')}</option>
            <option value="prefer_not_to_say">{t('genderPreferNot')}</option>
          </select>
          {state.errors?.gender?.[0] && (
            <p id="gender-error" className="mt-1 text-sm text-red-600">
              {translateError(state.errors.gender[0], t)}
            </p>
          )}
        </div>
      </div>

      {/* Mobile + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mobile" className="block text-sm font-normal text-gray-700 mb-1">
            {t('mobileLabel')}
          </label>
          <input
            id="mobile"
            name="mobile"
            type="text"
            value={values.mobile}
            onChange={set('mobile')}
            placeholder={t('mobilePlaceholder')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            aria-describedby={state.errors?.mobile ? 'mobile-error' : undefined}
          />
          {state.errors?.mobile?.[0] && (
            <p id="mobile-error" className="mt-1 text-sm text-red-600">
              {translateError(state.errors.mobile[0], t)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-normal text-gray-700 mb-1">
            {t('emailLabel')}
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
      </div>

      {/* Area / Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-normal text-gray-700 mb-1">
          {t('locationLabel')}
        </label>
        <input
          id="location"
          name="location"
          type="text"
          value={values.location}
          onChange={set('location')}
          placeholder={t('locationPlaceholder')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          aria-describedby={state.errors?.location ? 'location-error' : undefined}
        />
        {state.errors?.location?.[0] && (
          <p id="location-error" className="mt-1 text-sm text-red-600">
            {translateError(state.errors.location[0], t)}
          </p>
        )}
      </div>

      {/* Interests checkboxes */}
      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          {t('interestsLabel')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'leadership', label: t('interestLeadership') },
            { value: 'cultural', label: t('interestCultural') },
            { value: 'community', label: t('interestCommunity') },
            { value: 'social', label: t('interestSocial') },
            { value: 'health', label: t('interestHealth') },
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 min-h-[44px] cursor-pointer">
              <input
                type="checkbox"
                name="interests"
                value={value}
                className="h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
        {state.errors?.interests?.[0] && (
          <p id="interests-error" className="mt-1 text-sm text-red-600">
            {translateError(state.errors.interests[0], t)}
          </p>
        )}
      </div>

      {/* PDPA Consent */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="pdpaConsent"
            name="pdpaConsent"
            checked={pdpaChecked}
            onChange={(e) => setPdpaChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
            aria-describedby={state.errors?.pdpaConsent ? 'pdpaConsent-error' : undefined}
          />
          <span className="text-sm text-gray-700">{t('pdpaLabel')}</span>
        </label>
        {state.errors?.pdpaConsent?.[0] && (
          <p id="pdpaConsent-error" className="mt-1 text-sm text-red-600">
            {translateError(state.errors.pdpaConsent[0], t)}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={pending || !pdpaChecked}
        className="w-full bg-brand-green hover:bg-brand-green/90 text-white h-12"
      >
        {pending ? '...' : t('formSubmit')}
      </Button>
    </form>
  );
}

export function MembershipForm() {
  const t = useTranslations('membership');
  const [state, formAction, pending] = useActionState(submitMembership, initialState);

  // Track which state object the popup was closed for.
  const [closedForState, setClosedForState] = useState<MembershipFormState | null>(null);
  // Incrementing this key remounts FormFields, clearing all input values.
  const [formKey, setFormKey] = useState(0);
  // PDPA checkbox state — starts unchecked to enforce consent
  const [pdpaChecked, setPdpaChecked] = useState(false);

  const showPopup = state.success && closedForState !== state;

  function handleClose() {
    setClosedForState(state);
    setFormKey((k) => k + 1);
    setPdpaChecked(false);
  }

  return (
    <>
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-sm w-full text-center mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-brand-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-normal text-gray-900 mb-2">{t('successTitle')}</h3>
            <p className="text-gray-500 mb-6">{t('successMessage')}</p>
            <Button
              onClick={handleClose}
              className="bg-brand-green hover:bg-brand-green/90 text-white px-8"
            >
              {t('successClose')}
            </Button>
          </div>
        </div>
      )}
      <FormFields
        key={formKey}
        t={t}
        state={state}
        formAction={formAction}
        pending={pending}
        pdpaChecked={pdpaChecked}
        setPdpaChecked={setPdpaChecked}
      />
    </>
  );
}
