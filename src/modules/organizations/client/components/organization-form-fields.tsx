'use client';

import { ImageInput } from '@/components/image-input';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type Control, Controller } from 'react-hook-form';
import type { OrganizationFormValues } from './organization-form.schema';

interface OrganizationFormFieldsProps {
  control: Control<OrganizationFormValues>;
  currentLogoUrl?: string | null;
}

export function OrganizationFormFields({
  control,
  currentLogoUrl,
}: OrganizationFormFieldsProps) {
  return (
    <FieldGroup>
      <Controller
        name="logo"
        control={control}
        render={({ field: { value, onChange, ...field }, fieldState }) => {
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="logo">Logo</FieldLabel>
              <ImageInput
                id="logo"
                value={value === undefined ? currentLogoUrl : value}
                onChange={onChange}
                className="flex justify-center"
                {...field}
              />
              <FieldDescription className="text-center text-xs">
                Max 50MB. PNG, JPEG or WEBP only.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />

      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="name">Organization Name</FieldLabel>
            <Input
              id="name"
              placeholder="Acme Inc."
              {...field}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              placeholder="Tell us a bit about your organization"
              {...field}
              value={field.value || ''}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
