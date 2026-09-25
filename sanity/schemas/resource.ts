import { defineType, defineField } from 'sanity';
import { localizedStringField, localizedTextField } from './i18n';

export const resource = defineType({
  name: 'resource',
  title: 'Downloadable resource',
  type: 'document',
  fields: [
    localizedStringField('title', 'Title', { required: true }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.en', maxLength: 96 },
    }),
    localizedTextField('description', 'Description', { rows: 2 }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Factsheet', value: 'factsheets' },
          { title: 'Poster', value: 'posters' },
          { title: 'Media kit', value: 'media' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File (PDF, DOCX, image)',
      type: 'file',
      options: { accept: '.pdf,.doc,.docx,.png,.jpg,.jpeg' },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail image (optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'category',
      media: 'thumbnail',
    },
  },
});
