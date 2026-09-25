import { defineType, defineField } from 'sanity';
import { localizedStringField, localizedTextField } from './i18n';

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    localizedStringField('title', 'Event title', { required: true }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Used in /events/[slug].',
      options: { source: 'title.en', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    }),
    localizedTextField('summary', 'Short summary', { rows: 2 }),
    defineField({
      name: 'startDate',
      title: 'Start date & time',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date & time',
      type: 'datetime',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Venue name',
          type: 'string',
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        },
      ],
    }),
    defineField({
      name: 'rsvpLink',
      title: 'RSVP / registration link',
      type: 'url',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Advocacy', value: 'advocacy' },
          { title: 'Treatment', value: 'treatment' },
          { title: 'Reintegration', value: 'integration' },
          { title: 'Community', value: 'community' },
          { title: 'Training', value: 'training' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Show on home page',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'heroImage',
      date: 'startDate',
    },
    prepare({ title, media, date }) {
      return {
        title: title || 'Untitled event',
        subtitle: date ? new Date(date).toLocaleString() : 'No date',
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Upcoming first',
      name: 'startAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
    {
      title: 'Newest first',
      name: 'startDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
});
