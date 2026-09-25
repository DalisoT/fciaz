import { defineType, defineField } from 'sanity';
import { localizedStringField, localizedTextField } from './i18n';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings (singleton)',
  type: 'document',
  // Hide from "create new" menu — only one allowed, edited via the desk.
  __experimental_omnisearch_visibility: false as any,
  fields: [
    defineField({
      name: 'orgName',
      title: 'Organisation name',
      type: 'string',
      initialValue: 'FCIAZ',
      validation: (Rule: any) => Rule.required(),
    }),
    localizedStringField('tagline', 'Tagline', {}),
    localizedStringField('footerBlurb', 'Footer blurb', {}),
    defineField({
      name: 'address',
      title: 'Registered office address',
      type: 'object',
      fields: [
        defineField({ name: 'line1', title: 'Line 1', type: 'string' }),
        defineField({ name: 'line2', title: 'Line 2', type: 'string' }),
        defineField({ name: 'city', title: 'City', type: 'string' }),
        defineField({ name: 'country', title: 'Country', type: 'string' }),
      ],
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp number (international format)',
      type: 'string',
      description: 'Digits only, no spaces. e.g. 260971234567',
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'twitter', title: 'X (Twitter) URL', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site settings' };
    },
  },
});
