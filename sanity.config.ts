/**
 * Sanity Studio configuration for FCIAZ.
 * Mounts at /studio inside the Next.js app — same deployment, same domain.
 */
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your_project_id_here';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';

export default defineConfig({
  name: 'fciaz',
  title: 'FCIAZ — Content Studio',

  projectId,
  dataset,
  apiVersion,

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('FCIAZ content')
          .items([
            // Site-wide settings (singleton — pinned at the top)
            S.listItem()
              .title('Site settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),
            S.divider(),
            // Content collections
            S.listItem()
              .title('News posts')
              .schemaType('post')
              .child(S.documentTypeList('post').title('News posts')),
            S.listItem()
              .title('Events')
              .schemaType('event')
              .child(S.documentTypeList('event').title('Events')),
            S.listItem()
              .title('Resources')
              .schemaType('resource')
              .child(S.documentTypeList('resource').title('Resources')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
