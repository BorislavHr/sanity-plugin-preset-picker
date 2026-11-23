// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, studioTheme } from '@sanity/ui';
import type { StringInputProps } from 'sanity';
import { PresetPickerInput } from './PresetPickerInput';
import type { PresetPickerOptions } from './types';

afterEach(cleanup);

const presets: PresetPickerOptions['presets'] = [
  { value: 'plain', title: 'Plain', style: { background: '#111' } },
  { value: 'glow', title: 'Glow', style: { background: '#222' } },
  { value: 'grid', title: 'Grid', style: { background: '#333' } },
  { value: 'dots', title: 'Dots', image: 'https://example.com/dots.png' },
];

function renderPicker(
  {
    value,
    readOnly = false,
    options = { presets },
  }: { value?: string; readOnly?: boolean; options?: Partial<PresetPickerOptions> } = {},
) {
  const onChange = vi.fn();
  const props = {
    value,
    readOnly,
    onChange,
    schemaType: { name: 'background', title: 'Background', options },
    elementProps: {
      id: 'background',
      onFocus: vi.fn(),
      onBlur: vi.fn(),
      ref: { current: null },
      'aria-describedby': undefined,
    },
  } as unknown as StringInputProps;

  render(
    <ThemeProvider theme={studioTheme}>
      <PresetPickerInput {...props} />
    </ThemeProvider>,
  );
  return { onChange, user: userEvent.setup() };
}

const setPatch = (value: string) => expect.objectContaining({ type: 'set', path: [], value });
const unsetPatch = expect.objectContaining({ type: 'unset', path: [] });
const radio = (name: string) => screen.getByRole('radio', { name });

describe('PresetPickerInput', () => {
  it('renders one radio per preset inside a labelled radio group', () => {
    renderPicker();
    expect(screen.getByRole('radiogroup', { name: 'Background' })).toBeTruthy();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
  });

  it('marks the current value as checked', () => {
    renderPicker({ value: 'grid' });
    expect(radio('Grid').getAttribute('aria-checked')).toBe('true');
    expect(radio('Glow').getAttribute('aria-checked')).toBe('false');
  });

  it('sets the value on click', async () => {
    const { onChange, user } = renderPicker();
    await user.click(radio('Glow'));
    expect(onChange).toHaveBeenCalledWith(setPatch('glow'));
  });

  it('treats emptyValue as "nothing set"', async () => {
    const { onChange, user } = renderPicker({
      value: 'glow',
      options: { presets, emptyValue: 'plain' },
    });
    await user.click(radio('Plain'));
    expect(onChange).toHaveBeenCalledWith(unsetPatch);
  });

  it('shows the emptyValue preset as selected when the field is empty', () => {
    renderPicker({ options: { presets, emptyValue: 'plain' } });
    expect(radio('Plain').getAttribute('aria-checked')).toBe('true');
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });

  it('offers Clear when there is no emptyValue', async () => {
    const { onChange, user } = renderPicker({ value: 'glow' });
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onChange).toHaveBeenCalledWith(unsetPatch);
  });

  it('uses a roving tab stop on the selected tile', () => {
    renderPicker({ value: 'grid' });
    expect(radio('Grid').tabIndex).toBe(0);
    expect(radio('Plain').tabIndex).toBe(-1);
  });

  it('moves and selects with arrow keys, wrapping around', async () => {
    const { onChange, user } = renderPicker({ value: 'dots', options: { presets, columns: 2 } });
    radio('Dots').focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(setPatch('plain'));
    expect(document.activeElement).toBe(radio('Plain'));
  });

  it('moves a whole row with up and down', async () => {
    const { onChange, user } = renderPicker({ value: 'plain', options: { presets, columns: 2 } });
    radio('Plain').focus();
    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith(setPatch('grid'));
  });

  it('jumps with Home and End', async () => {
    const { onChange, user } = renderPicker({ value: 'glow' });
    radio('Glow').focus();
    await user.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith(setPatch('dots'));
    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith(setPatch('plain'));
  });

  it('warns about a value that is not a preset', () => {
    renderPicker({ value: 'removed-pattern' });
    expect(screen.getByText(/“removed-pattern” is not one of the presets/)).toBeTruthy();
  });

  it('is disabled and shows no Clear button when read-only', () => {
    renderPicker({ value: 'glow', readOnly: true });
    for (const r of screen.getAllByRole('radio')) expect((r as HTMLButtonElement).disabled).toBe(true);
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });

  it('explains what to do when no presets are configured', () => {
    renderPicker({ options: {} });
    expect(screen.getByText(/No presets configured/)).toBeTruthy();
  });
});
