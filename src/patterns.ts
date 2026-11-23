/**
 * Ready-made background presets built from CSS gradients only (plus two tiny inline SVG tiles).
 *
 * This entry point does not import Sanity, so a front end can import the same presets and
 * render the background an editor picked:
 *
 * ```tsx
 * import { patternPresets } from 'sanity-plugin-preset-picker/patterns';
 * const style = patternPresets(colors).find((p) => p.value === post.heroBackground)?.style;
 * ```
 */
import type { Preset } from './types';

export interface PatternColors {
  /** Background colour. Any CSS colour. Default `#0f172a`. */
  base?: string;
  /** Pattern colour. Any CSS colour. Default `#f59e0b`. */
  accent?: string;
}

function svgTile(width: number, height: number, body: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${body}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** The `value` of every preset {@link patternPresets} returns, in order. */
export const PATTERN_VALUES = [
  'solid',
  'glow',
  'grid',
  'dots',
  'stripes',
  'chevron',
  'checker',
  'rings',
  'waves',
  'hexagons',
] as const;

export type PatternValue = (typeof PATTERN_VALUES)[number];

/**
 * Returns ten background presets in your colours: solid, glow, grid, dots, stripes, chevron,
 * checker, rings, waves and hexagons.
 */
export function patternPresets({
  base = '#0f172a',
  accent = '#f59e0b',
}: PatternColors = {}): Array<Preset & { value: PatternValue }> {
  // Accent at a given opacity, for any CSS colour the caller passes.
  const tint = (percent: number) => `color-mix(in srgb, ${accent} ${percent}%, transparent)`;

  return [
    { value: 'solid', title: 'Solid', style: { background: base } },
    {
      value: 'glow',
      title: 'Glow',
      style: {
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${tint(35)} 0%, transparent 70%), ${base}`,
      },
    },
    {
      value: 'grid',
      title: 'Grid',
      style: {
        backgroundColor: base,
        backgroundImage: `linear-gradient(${tint(15)} 1px, transparent 1px), linear-gradient(90deg, ${tint(15)} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      },
    },
    {
      value: 'dots',
      title: 'Dots',
      style: {
        backgroundColor: base,
        backgroundImage: `radial-gradient(circle, ${tint(45)} 1.5px, transparent 1.5px)`,
        backgroundSize: '14px 14px',
      },
    },
    {
      value: 'stripes',
      title: 'Stripes',
      style: {
        backgroundColor: base,
        backgroundImage: `repeating-linear-gradient(45deg, ${tint(22)} 0 10px, transparent 10px 20px)`,
      },
    },
    {
      value: 'chevron',
      title: 'Chevron',
      style: {
        backgroundColor: base,
        backgroundImage: [
          `linear-gradient(45deg, ${tint(25)} 33%, transparent 33%, transparent 66%, ${tint(25)} 66%)`,
          `linear-gradient(135deg, ${tint(25)} 33%, transparent 33%, transparent 66%, ${tint(25)} 66%)`,
        ].join(', '),
        backgroundSize: '24px 24px',
      },
    },
    {
      value: 'checker',
      title: 'Checker',
      style: {
        backgroundColor: base,
        backgroundImage: `linear-gradient(90deg, ${tint(20)} 50%, transparent 0), linear-gradient(${tint(20)} 50%, transparent 0)`,
        backgroundSize: '20px 20px',
      },
    },
    {
      value: 'rings',
      title: 'Rings',
      style: {
        backgroundColor: base,
        backgroundImage: `radial-gradient(transparent 5px, ${tint(35)} 5px, ${tint(35)} 8px, transparent 8px)`,
        backgroundSize: '20px 20px',
      },
    },
    {
      value: 'waves',
      title: 'Waves',
      style: {
        backgroundColor: base,
        backgroundImage: svgTile(
          40,
          20,
          `<path d="M0 10c5-8 15-8 20 0s15 8 20 0" fill="none" stroke="${accent}" stroke-opacity="0.5" stroke-width="1.6"/>`,
        ),
      },
    },
    {
      value: 'hexagons',
      title: 'Hexagons',
      style: {
        backgroundColor: base,
        backgroundImage: svgTile(
          28,
          48,
          `<path d="M14 0l14 8v16l-14 8-14-8V8z" fill="none" stroke="${accent}" stroke-opacity="0.55" stroke-width="1.2"/>`,
        ),
      },
    },
  ];
}
