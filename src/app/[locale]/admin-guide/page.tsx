import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('adminGuideTitle'),
    description: t('adminGuideDescription'),
    robots: { index: false, follow: false },
  };
}

export default async function AdminGuidePage() {
  const sections = [
    {
      heading: '1. How to log into Sanity Studio',
      body: (
        <>
          Navigate to <code className="bg-gray-100 px-1 rounded">/studio</code> on the website (e.g.{' '}
          <code className="bg-gray-100 px-1 rounded">seputehhyo.org/studio</code>). Log in with your
          organisation email address. If you do not have access, ask the site administrator to invite you.
        </>
      ),
    },
    {
      heading: '2. Adding or editing a team member',
      body: (
        <>
          In <strong>Sanity Studio</strong>, click <strong>Team Member</strong> in the left sidebar.
          Click <strong>+ Create</strong> to add a new member. Fill in the name (in English, Bahasa Malaysia,
          and Tamil), select a role (President, VP, Secretary, etc.), upload a photo, and set the display
          order. Click <strong>Publish</strong> to make the changes live.
        </>
      ),
    },
    {
      heading: '3. Adding or editing a programme',
      body: (
        <>
          Click <strong>Programme</strong> in the sidebar. Click <strong>+ Create</strong>. Fill in the
          title, description, and category in all three languages. Upload a cover photo and set the slug
          (URL-friendly name). Click <strong>Publish</strong>.
        </>
      ),
    },
    {
      heading: '4. Uploading a document (PDF)',
      body: (
        <>
          Click <strong>PDF Document</strong> in the sidebar. Click <strong>+ Create</strong>. Fill in the
          display title in all three languages, select a category, enter the year, and upload the PDF file.
          All fields are required. Click <strong>Publish</strong>.
        </>
      ),
    },
    {
      heading: '5. Updating site settings',
      body: (
        <>
          Click <strong>Site Settings</strong> in the sidebar. This is a singleton document. Update the
          contact email, WhatsApp number, Facebook URL, or Instagram URL as needed. Click{' '}
          <strong>Publish</strong> to apply settings site-wide.
        </>
      ),
    },
    {
      heading: '6. How content updates appear live (ISR)',
      body: (
        <>
          When you click <strong>Publish</strong> in <strong>Sanity Studio</strong>, the website
          automatically refreshes the affected pages within a few seconds. This is called{' '}
          <strong>Incremental Static Regeneration (ISR)</strong>. You do not need to redeploy the website
          or contact a developer.
        </>
      ),
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">Admin Guide</h1>
      <p className="text-base text-muted-foreground mb-12">
        Quick reference for Seputeh HYO content administrators.
      </p>

      {sections.map((section) => (
        <section key={section.heading} className="mb-8">
          <h2 className="text-xl font-normal mb-3">{section.heading}</h2>
          <p className="text-base leading-relaxed">{section.body}</p>
        </section>
      ))}
    </main>
  );
}
