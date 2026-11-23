// Renders the input outside a Studio, in both themes, with local state standing in for the
// document. Run with `npm run playground`.
import '@sanity/ui/styles.css';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Card, Flex, Heading, Stack, Text, ThemeProvider, studioTheme } from '@sanity/ui';
import type { FormPatch, PatchEvent, StringInputProps } from 'sanity';
import { PresetPickerInput } from '../../src/PresetPickerInput';
import { patternPresets } from '../../src/patterns';
import type { PresetPickerOptions } from '../../src/types';

const options: PresetPickerOptions = {
  presets: patternPresets({ base: '#0f172a', accent: '#f59e0b' }),
  emptyValue: 'solid',
  columns: 5,
};

function Field({ readOnly = false }: { readOnly?: boolean }) {
  const [value, setValue] = useState<string | undefined>('dots');
  const onChange = (patch: FormPatch | PatchEvent | FormPatch[]) => {
    const first = (Array.isArray(patch) ? patch[0] : patch) as FormPatch;
    setValue(first.type === 'set' ? (first.value as string) : undefined);
  };
  const props = {
    value,
    readOnly,
    onChange,
    schemaType: { name: 'background', title: 'Background', options },
    elementProps: { id: 'bg', onFocus() {}, onBlur() {}, ref: { current: null } },
  } as unknown as StringInputProps;

  return (
    <Stack gap={3}>
      <PresetPickerInput {...props} />
      <Text size={1} muted>value: {JSON.stringify(value)}</Text>
    </Stack>
  );
}

function Panel({ scheme }: { scheme: 'light' | 'dark' }) {
  return (
    <ThemeProvider theme={studioTheme} scheme={scheme}>
      <Card padding={4} style={{ minHeight: '100vh', flex: 1 }}>
        <Stack gap={4}>
          <Heading size={1}>{scheme} theme</Heading>
          <Field />
          <Heading size={0}>read-only</Heading>
          <Field readOnly />
        </Stack>
      </Card>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={studioTheme}>
      <Flex wrap="wrap">
      <Panel scheme="light" />
      <Panel scheme="dark" />
      </Flex>
    </ThemeProvider>
  </StrictMode>,
);
