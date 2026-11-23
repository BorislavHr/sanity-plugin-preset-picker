// A minimal Studio using the plugin. Set SANITY_STUDIO_PROJECT_ID to try it against a project:
//   SANITY_STUDIO_PROJECT_ID=abc123 npx sanity dev examples/studio
import { defineConfig, defineField, defineType } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presetPicker } from '../../src';
import { patternPresets } from '../../src/patterns';

const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({
      name: 'heroBackground',
      title: 'Hero background',
      type: 'presetPicker',
      options: {
        presets: patternPresets({ base: '#0f172a', accent: '#f59e0b' }),
        emptyValue: 'solid',
        columns: 5,
      },
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'presetPicker',
      options: {
        columns: 2,
        tileHeight: 48,
        presets: [
          { value: 'narrow', title: 'Narrow column', style: { background: 'linear-gradient(90deg, #ddd 30%, #555 30% 70%, #ddd 70%)' } },
          { value: 'wide', title: 'Full width', style: { background: '#555' } },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
});

export default defineConfig({
  name: 'preset-picker-example',
  title: 'Preset picker example',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'example',
  dataset: 'production',
  plugins: [structureTool(), presetPicker()],
  schema: { types: [post] },
});
