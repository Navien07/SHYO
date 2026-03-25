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

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    localizedString('name', 'Name'),
    localizedString('role', 'Role / Position'),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (President = 1)',
    }),
    defineField({
      name: 'tier',
      title: 'Committee Tier',
      type: 'string',
      options: {
        list: [
          { title: 'President', value: 'president' },
          { title: 'Senior Officer', value: 'senior' },
          { title: 'Committee Member', value: 'committee' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: 'name.en' } },
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
});
