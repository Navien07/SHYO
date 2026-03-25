import { defineField, defineType } from 'sanity';

export const pdfDocument = defineType({
  name: 'pdfDocument',
  title: 'Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'ms', title: 'Bahasa Malaysia', type: 'string' },
        { name: 'ta', title: 'Tamil', type: 'string' },
      ],
    }),
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
