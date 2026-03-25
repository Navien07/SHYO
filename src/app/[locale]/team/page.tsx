import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import imageUrlBuilder from '@sanity/image-url';
import { Users } from 'lucide-react';
import { client } from '@/sanity/client';
import { getAllTeamMembers } from '@/lib/sanity/queries';
import type { TeamMember } from '@/lib/sanity/queries';

const builder = imageUrlBuilder(client);

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function MemberCard({
  member,
  locale,
  photoSize,
}: {
  member: TeamMember;
  locale: string;
  photoSize: number;
}) {
  const name =
    member.name?.[locale as 'en' | 'ms' | 'ta'] ?? member.name?.en ?? '';
  const role =
    member.role?.[locale as 'en' | 'ms' | 'ta'] ?? member.role?.en ?? '';
  const maxWidth = photoSize === 80 ? 'max-w-[320px]' : 'max-w-[200px]';

  return (
    <div
      className={`bg-card rounded-lg p-4 text-center shadow-sm border border-border ${maxWidth} w-full`}
    >
      {member.photo ? (
        <Image
          src={builder
            .image(member.photo)
            .width(photoSize * 2)
            .height(photoSize * 2)
            .url()}
          alt={name}
          width={photoSize}
          height={photoSize}
          className="rounded-full object-cover mx-auto mb-3"
          style={{ width: photoSize, height: photoSize }}
        />
      ) : (
        <div
          className="rounded-full bg-brand-green text-white flex items-center justify-center mx-auto mb-3 font-semibold"
          style={{ width: photoSize, height: photoSize, fontSize: photoSize * 0.35 }}
        >
          {getInitials(name)}
        </div>
      )}
      <h3 className="text-[20px] font-semibold text-foreground leading-tight">
        {name}
      </h3>
      <p className="text-[14px] text-muted-foreground mt-1">{role}</p>
    </div>
  );
}

interface TeamPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = await params;
  const [t, members] = await Promise.all([
    getTranslations('team'),
    getAllTeamMembers(),
  ]);

  if (members.length === 0) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <Users className="text-muted-foreground mb-4" size={48} />
        <h1 className="text-[28px] font-semibold">{t('emptyState')}</h1>
      </main>
    );
  }

  const president = members
    .filter((m) => m.tier === 'president')
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const senior = members
    .filter((m) => m.tier === 'senior')
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const committee = members
    .filter((m) => !m.tier || m.tier === 'committee')
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-[28px] font-semibold mb-12">{t('title')}</h1>

      {president.length > 0 && (
        <section className="mb-12">
          <h2 className="text-[20px] font-semibold border-l-4 border-brand-green pl-3 mb-6">
            {t('presidentSection')}
          </h2>
          <div className="flex justify-center">
            {president.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                locale={locale}
                photoSize={80}
              />
            ))}
          </div>
        </section>
      )}

      {senior.length > 0 && (
        <section className="mb-12">
          <h2 className="text-[20px] font-semibold border-l-4 border-brand-green pl-3 mb-6">
            {t('seniorSection')}
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {senior.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                locale={locale}
                photoSize={64}
              />
            ))}
          </div>
        </section>
      )}

      {committee.length > 0 && (
        <section className="mb-12">
          <h2 className="text-[20px] font-semibold border-l-4 border-brand-green pl-3 mb-6">
            {t('committeeSection')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {committee.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                locale={locale}
                photoSize={64}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
