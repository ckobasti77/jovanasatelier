"use client";

import { useEffect } from "react";
import { FormProvider, useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  measurementProfileSchema,
  type MeasurementProfileValues,
} from "@/lib/measurements";

type ProfileFormProps = {
  defaultValues?: Partial<MeasurementProfileValues>;
  onSubmit: (values: MeasurementProfileValues) => Promise<void>;
  onDelete?: () => Promise<void>;
  submitting: boolean;
  deleting: boolean;
  copy: {
    label: string;
    labelHelper: string;
    bust: string;
    waist: string;
    hips: string;
    height: string;
    heel: string;
    notes: string;
    notesHelper: string;
    save: string;
    saving: string;
    delete?: string;
    deleting?: string;
  };
};

const FIELD_ORDER: Array<keyof MeasurementProfileValues> = [
  "bust",
  "waist",
  "hips",
  "height",
  "heel",
];

export function ProfileForm({
  defaultValues,
  onSubmit,
  onDelete,
  submitting,
  deleting,
  copy,
}: ProfileFormProps) {
  const form = useForm<MeasurementProfileValues>({
    resolver: zodResolver(measurementProfileSchema),
    mode: "onBlur",
    defaultValues: {
      label: "",
      bust: undefined,
      waist: undefined,
      hips: undefined,
      height: undefined,
      heel: undefined,
      notes: undefined,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (!defaultValues) return;
    for (const [key, value] of Object.entries(defaultValues)) {
      const typedKey = key as keyof MeasurementProfileValues;
      form.setValue(typedKey, value as MeasurementProfileValues[typeof typedKey], {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [defaultValues, form]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  return (
    <FormProvider {...form}>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
        })}
      >
        <div className="space-y-2">
          <Label htmlFor="profile-label" helper={copy.labelHelper}>
            {copy.label}
          </Label>
          <Input
            id="profile-label"
            {...register("label")}
            placeholder="Evening heels"
            autoComplete="off"
          />
          {errors.label ? (
            <p className="text-xs text-rose-500">{errors.label.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {FIELD_ORDER.map((fieldKey) => (
            <Field
              key={fieldKey}
              fieldKey={fieldKey}
              label={copy[fieldKey]}
              error={errors[fieldKey]?.message}
              register={register}
            />
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-notes" helper={copy.notesHelper}>
            {copy.notes}
          </Label>
          <Textarea
            id="profile-notes"
            {...register("notes")}
            placeholder="Optional: note the heel brand or desired ease."
            className="min-h-[120px]"
          />
          {errors.notes ? (
            <p className="text-xs text-rose-500">{errors.notes.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {onDelete && copy.delete ? (
            <Button
              type="button"
              variant="outline"
              onClick={onDelete}
              disabled={deleting || submitting}
            >
              {deleting && copy.deleting ? copy.deleting : copy.delete}
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={submitting || deleting}>
            {submitting ? copy.saving : copy.save}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

type FieldProps = {
  fieldKey: keyof MeasurementProfileValues;
  label: string;
  error?: string;
  register: UseFormRegister<MeasurementProfileValues>;
};

function Field({ fieldKey, label, error, register }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`profile-${fieldKey}`}>{label}</Label>
      <Input
        id={`profile-${fieldKey}`}
        inputMode="decimal"
        placeholder="0"
        {...register(fieldKey)}
      />
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}
