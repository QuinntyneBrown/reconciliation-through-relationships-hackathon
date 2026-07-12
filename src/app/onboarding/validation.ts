import type { OnboardingData } from "./page";

export type OnboardingFieldError = {
  fieldId: string;
  errorId: string;
  message: string;
};

function error(fieldId: string, message: string): OnboardingFieldError {
  return { fieldId, errorId: `${fieldId}-error`, message };
}

export function validateBasicInfo(data: OnboardingData): OnboardingFieldError[] {
  const errors: OnboardingFieldError[] = [];

  if (!data.first_name.trim()) errors.push(error("first_name", "Enter your first name."));
  if (!data.last_name.trim()) errors.push(error("last_name", "Enter your last name."));
  if (data.age === null || !Number.isInteger(data.age) || data.age < 13 || data.age > 120) {
    errors.push(error("age", "Enter an age from 13 to 120."));
  }
  if (data.is_indigenous === null) {
    errors.push(error("indigenous_group", "Choose whether you are Indigenous."));
  }
  if (!data.sex) errors.push(error("sex_group", "Choose your sex."));

  const requiredCategories = new Set([
    "indigenous_leader",
    "indigenous_individual",
    "non_indigenous_individual",
  ]);
  if (!data.participation_categories.some((category) => requiredCategories.has(category))) {
    errors.push(
      error("participation_categories", "Choose at least one required participation category."),
    );
  }

  return errors;
}

export function validateLocation(data: OnboardingData): OnboardingFieldError[] {
  const errors: OnboardingFieldError[] = [];
  if (!data.city.trim()) errors.push(error("city", "Enter your city, town, or county."));
  if (!data.province) errors.push(error("province", "Choose a province or territory."));
  return errors;
}

export function validateFaithInterests(data: OnboardingData): OnboardingFieldError[] {
  return data.faith_tradition
    ? []
    : [error("faith_tradition", "Choose a faith tradition or prefer not to say.")];
}

export function validateAvailability(data: OnboardingData): OnboardingFieldError[] {
  const errors: OnboardingFieldError[] = [];
  if (data.participation_format.length === 0) {
    errors.push(error("participation_format", "Choose at least one participation format."));
  }
  if (data.language_preferences.length === 0) {
    errors.push(error("language_preferences", "Choose at least one language."));
  }
  return errors;
}

export function findError(errors: OnboardingFieldError[], fieldId: string) {
  return errors.find((item) => item.fieldId === fieldId);
}
