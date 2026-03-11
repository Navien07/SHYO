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

export const programme = defineType({
  name: 'programme',
  title: 'Programme',
  type: 'document',
  fields: [
    localizedString('title', 'Title'),
    localizedString('description', 'Description'),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Leadership', 'Cultural', 'Community Service', 'Well-being', 'Social Awareness'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.en' } }),
  ],
  preview: { select: { title: 'title.en' } },
});
