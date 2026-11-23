import { useCallback, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, FocusEventHandler, KeyboardEvent } from 'react';
import { set, unset } from 'sanity';
import type { StringInputProps } from 'sanity';
import { Button, Card, Stack, Text } from '@sanity/ui';
import type { Preset, PresetPickerOptions } from './types';

function tileStyle(preset: Preset, height: number): CSSProperties {
  const image: CSSProperties = preset.image
    ? {
        backgroundImage: `url(${JSON.stringify(preset.image)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};
  return {
    height,
    borderRadius: 3,
    // A faint inset outline keeps light tiles visible on a light card (and dark on dark).
    boxShadow: 'inset 0 0 0 1px rgba(128, 128, 128, 0.3)',
    ...image,
    ...preset.style,
  };
}

/**
 * Input component for a string field: a grid of visual tiles, one per preset.
 *
 * Registered for you as the `presetPicker` type by the `presetPicker()` plugin. Exported for
 * custom setups.
 */
export function PresetPickerInput(props: StringInputProps) {
  const { value, onChange, readOnly, schemaType, elementProps } = props;
  const options = (schemaType.options ?? {}) as Partial<PresetPickerOptions>;
  const presets = options.presets ?? [];
  const columns = Math.max(1, Math.floor(options.columns ?? 3));
  const tileHeight = options.tileHeight ?? 64;
  const { emptyValue } = options;

  const shown = value || emptyValue;
  const selectedIndex = presets.findIndex((preset) => preset.value === shown);
  const isUnknownValue = Boolean(value) && selectedIndex === -1;
  const tabStop = selectedIndex >= 0 ? selectedIndex : 0;

  const groupRef = useRef<HTMLDivElement>(null);

  const focusTile = useCallback((index: number) => {
    groupRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[index]?.focus();
  }, []);

  // Lets Studio focus the field, e.g. when an editor clicks a validation message.
  useImperativeHandle(elementProps.ref, () => ({ focus: () => focusTile(tabStop) }), [
    focusTile,
    tabStop,
  ]);

  const choose = useCallback(
    (preset: Preset) => {
      onChange(emptyValue !== undefined && preset.value === emptyValue ? unset() : set(preset.value));
    },
    [onChange, emptyValue],
  );

  // Radio-group keyboard pattern: arrows move and select, Home / End jump to the ends.
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
    const last = presets.length - 1;
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
        next = index === last ? 0 : index + 1;
        break;
      case 'ArrowLeft':
        next = index === 0 ? last : index - 1;
        break;
      case 'ArrowDown':
        next = Math.min(index + columns, last);
        break;
      case 'ArrowUp':
        next = Math.max(index - columns, 0);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    const preset = presets[next];
    if (preset) choose(preset);
    focusTile(next);
  };

  if (presets.length === 0) {
    return (
      <Card tone="caution" padding={3} radius={2} border>
        <Text size={1}>No presets configured. Add them to this field under options.presets.</Text>
      </Card>
    );
  }

  return (
    <Stack gap={3}>
      <div
        ref={groupRef}
        id={elementProps.id}
        role="radiogroup"
        aria-label={schemaType.title ?? schemaType.name}
        aria-describedby={elementProps['aria-describedby']}
        aria-readonly={readOnly || undefined}
        onFocus={elementProps.onFocus as FocusEventHandler<HTMLDivElement>}
        onBlur={elementProps.onBlur as FocusEventHandler<HTMLDivElement>}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: 8,
        }}
      >
        {presets.map((preset, index) => {
          const selected = index === selectedIndex;
          return (
            <Button
              key={preset.value}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={index === tabStop ? 0 : -1}
              disabled={readOnly}
              mode={selected ? 'default' : 'ghost'}
              tone={selected ? 'primary' : 'default'}
              padding={1}
              radius={2}
              title={preset.description ?? preset.title}
              onClick={() => choose(preset)}
              onKeyDown={(event: KeyboardEvent<HTMLElement>) => handleKeyDown(event, index)}
            >
              <Stack gap={2}>
                <div aria-hidden="true" style={tileStyle(preset, tileHeight)} />
                <Text size={1} align="center" textOverflow="ellipsis">
                  {preset.title}
                </Text>
              </Stack>
            </Button>
          );
        })}
      </div>

      {isUnknownValue && (
        <Card tone="caution" padding={3} radius={2} border>
          <Text size={1}>
            The current value “{value}” is not one of the presets. Pick a preset to replace it.
          </Text>
        </Card>
      )}

      {Boolean(value) && emptyValue === undefined && !readOnly && (
        <div>
          <Button mode="bleed" padding={2} fontSize={1} text="Clear" onClick={() => onChange(unset())} />
        </div>
      )}
    </Stack>
  );
}
