import { defineField, defineType } from 'sanity';

const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      { name: 'en', title: 'English', type: 'string' },
      { name: 'ms', title: 'Bahasa Malaysia', type: 'string' },
      { name: 'ta', title: 'Tamil', type: 'string' },
    ],
  });

export const document = defineType({
  name: 'document',
  title: 'Document',
  type: 'document',
  fields: [
    localizedString('title', 'Title'),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Annual Report', 'Constitution', 'Minutes', 'Policy', 'Other'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(2000).max(2100),
    }),
    defineField({ name: 'file', title: 'PDF File', type: 'file', options: { accept: '.pdf' } }),
    defineField({ name: 'uploadDate', title: 'Upload Date', type: 'date' }),
  ],
  preview: { select: { title: 'title.en', subtitle: 'year' } },
});
