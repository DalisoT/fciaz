import { defineType, defineField } from 'sanity';
import { localizedStringField, localizedTextField } from './i18n';

export const post = defineType({
  name: 'post',
  title: 'News post',
  type: 'document',
  fields: [
    localizedStringField('title', 'Title', { required: true }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Auto-generated from the English title. Used in /news/[slug].',
      options: { source: 'title.en', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    }),
    localizedTextField('excerpt', 'Excerpt', { rows: 3 }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Brief description for screen readers and SEO.',
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
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
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Publicity Secretary',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'featured',
      title: 'Feature on home page',
      type: 'boolean',
      initialValue: false,
    }),
    localizedStringField('seoTitle', 'SEO title', {}),
    localizedTextField('seoDescription', 'SEO description', { rows: 2 }),
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'heroImage',
      date: 'publishedAt',
    },
    prepare({ title, media, date }) {
      return {
        title: title || 'Untitled post',
        subtitle: date ? new Date(date).toLocaleDateString() : 'No date',
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Published — newest first',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
