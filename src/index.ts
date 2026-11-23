import { definePlugin, defineType } from 'sanity';
import type { StringDefinition } from 'sanity';
import { PresetPickerInput } from './PresetPickerInput';
import type { PresetPickerOptions } from './types';

export { PresetPickerInput } from './PresetPickerInput';
export type { Preset, PresetPickerOptions } from './types';

export const presetPickerTypeName = 'presetPicker' as const;

/** @public */
export interface PresetPickerDefinition extends Omit<StringDefinition, 'type' | 'options'> {
  type: typeof presetPickerTypeName;
  options: PresetPickerOptions;
}

declare module 'sanity' {
  interface IntrinsicDefinitions {
    presetPicker: PresetPickerDefinition;
  }
}

/** The `presetPicker` schema type: a string field edited with {@link PresetPickerInput}. */
export const presetPickerType = defineType({
  name: presetPickerTypeName,
  title: 'Preset',
  type: 'string',
  components: { input: PresetPickerInput },
});

/**
 * Adds the `presetPicker` field type to the Studio.
 *
 * @example
 * ```ts
 * // sanity.config.ts
 * plugins: [presetPicker()]
 * ```
 */
export const presetPicker = definePlugin({
  name: 'sanity-plugin-preset-picker',
  schema: { types: [presetPickerType] },
});
