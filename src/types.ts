import type { CSSProperties } from 'react';

/** One choice in the picker. */
export interface Preset {
  /** The string stored in the document. */
  value: string;
  /** Label shown under the tile. */
  title: string;
  /** Tooltip text. Defaults to `title`. */
  description?: string;
  /**
   * CSS for the tile: a colour, gradient or pattern. Use the same object on your front end to
   * render exactly what the editor picked.
   */
  style?: CSSProperties;
  /** Image URL for the tile, e.g. a thumbnail of a layout or theme. Drawn under `style`. */
  image?: string;
}

/** `options` for a `presetPicker` field. */
export interface PresetPickerOptions {
  presets: Preset[];
  /** Tiles per row. Default `3`. */
  columns?: number;
  /** Tile preview height in pixels. Default `64`. */
  tileHeight?: number;
  /**
   * A preset that stands for "nothing set". Choosing it clears the field, and an empty field
   * shows it as selected. Without it the picker shows a Clear button once a value is set.
   */
  emptyValue?: string;
}
