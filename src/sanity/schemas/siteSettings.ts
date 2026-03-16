import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string' }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number (with country code, e.g. 60123456789)',
      type: 'string',
    }),
    defineField({ name: 'facebookUrl', title: 'Facebook URL', type: 'url' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'heroImage', title: 'Hero Background Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'memberCount', title: 'Member Count', type: 'number', description: 'Displayed on homepage impact section. Update when membership grows.' }),
    defineField({ name: 'programmesDelivered', title: 'Programmes Delivered', type: 'number', description: 'Total programmes delivered to date. Update manually.' }),
  ],
});
