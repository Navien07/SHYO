'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Download, FileText } from 'lucide-react';
import type { SanityDocument } from '@/lib/sanity/queries';

const CATEGORIES = ['All', 'Annual Report', 'Constitution', 'Minutes', 'Policy', 'Other'];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocumentLibraryProps {
  documents: SanityDocument[];
  locale: string;
  translations: {
    colTitle: string;
    colCategory: string;
    colYear: string;
    colDate: string;
    colSize: string;
    download: string;
    filterAll: string;
    emptyState: string;
  };
}

export function DocumentLibrary({ documents, locale, translations: t }: DocumentLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = activeCategory === 'All'
    ? documents
    : documents.filter(d => d.category === activeCategory);

  // Empty state — no documents at all
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <FileText className="w-12 h-12 mb-4" />
        <p className="text-lg">{t.emptyState}</p>
      </div>
    );
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            className={cn(
              'min-h-[44px]',
              activeCategory === cat && 'bg-brand-green text-white hover:bg-brand-green/90'
            )}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'All' ? t.filterAll : cat}
          </Button>
        ))}
      </div>

      {/* Document table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted text-muted-foreground text-xs uppercase tracking-wide font-medium">
              <th className="text-left p-3">{t.colTitle}</th>
              <th className="text-left p-3">{t.colCategory}</th>
              <th className="text-left p-3">{t.colYear}</th>
              <th className="text-left p-3">{t.colDate}</th>
              <th className="text-left p-3">{t.colSize}</th>
              <th className="text-left p-3">{t.download}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  No {activeCategory} documents found.
                </td>
              </tr>
            ) : (
              filtered.map(doc => {
                const title = doc.title?.[locale as 'en' | 'ms' | 'ta'] ?? doc.title?.en ?? '';
                const fileUrl = doc.file?.asset?.url;
                const fileSize = doc.file?.asset?.size;
                const uploadDate = doc.uploadDate
                  ? new Date(doc.uploadDate).toLocaleDateString()
                  : '—';

                return (
                  <tr key={doc._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-3 text-foreground">{title}</td>
                    <td className="p-3 text-sm text-muted-foreground">{doc.category}</td>
                    <td className="p-3 text-sm text-muted-foreground">{doc.year}</td>
                    <td className="p-3 text-sm text-muted-foreground">{uploadDate}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {fileSize ? formatBytes(fileSize) : '—'}
                    </td>
                    <td className="p-3">
                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${t.download} ${title}`}
                        >
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            {t.download}
                          </Button>
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
