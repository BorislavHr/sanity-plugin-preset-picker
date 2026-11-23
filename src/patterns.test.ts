import { describe, expect, it } from 'vitest';
import { PATTERN_VALUES, patternPresets } from './patterns';

describe('patternPresets', () => {
  it('returns one preset per documented value, in order', () => {
    expect(patternPresets().map((p) => p.value)).toEqual([...PATTERN_VALUES]);
  });

  it('uses the given colours', () => {
    const presets = patternPresets({ base: 'rgb(1, 2, 3)', accent: 'tomato' });
    expect(presets[0]?.style?.background).toBe('rgb(1, 2, 3)');
    for (const preset of presets.slice(1)) {
      expect(JSON.stringify(preset.style)).toContain('tomato');
    }
  });

  it('has unique values', () => {
    const values = patternPresets().map((p) => p.value);
    expect(new Set(values).size).toBe(values.length);
  });
});
