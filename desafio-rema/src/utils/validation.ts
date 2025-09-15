import { UserArguments, FieldErrors, ValidationResult } from '@/types';
import { ERROR_MESSAGES, FIELD_LABELS, VALIDATION_LIMITS } from '@/constants';

/**
 * Validates user input for the risk assessment calculator
 */
export function validateUserInput(userInput: UserArguments): ValidationResult {
  const errors: FieldErrors = {};

  // Required field validation
  if (!userInput.c) {
    errors.c = `${ERROR_MESSAGES.REQUIRED_FIELD} Contaminant Concentration`;
  } else if (!isValidNumber(userInput.c)) {
    errors.c = ERROR_MESSAGES.INVALID_NUMBER;
  } else if (userInput.c < VALIDATION_LIMITS.MIN_VALUE) {
    errors.c = ERROR_MESSAGES.NEGATIVE_NUMBER;
  } else if (userInput.c > VALIDATION_LIMITS.MAX_CONCENTRATION) {
    errors.c = `Concentration must be less than ${VALIDATION_LIMITS.MAX_CONCENTRATION}`;
  }

  if (!userInput.ir) {
    errors.ir = `${ERROR_MESSAGES.REQUIRED_FIELD} Intake Rate`;
  } else if (!isValidNumber(userInput.ir)) {
    errors.ir = ERROR_MESSAGES.INVALID_NUMBER;
  } else if (userInput.ir < VALIDATION_LIMITS.MIN_VALUE) {
    errors.ir = ERROR_MESSAGES.NEGATIVE_NUMBER;
  } else if (userInput.ir > VALIDATION_LIMITS.MAX_INTAKE_RATE) {
    errors.ir = `Intake rate must be less than ${VALIDATION_LIMITS.MAX_INTAKE_RATE}`;
  }

  if (!userInput.ef) {
    errors.ef = `${ERROR_MESSAGES.REQUIRED_FIELD} Exposure Frequency`;
  } else if (!isValidNumber(userInput.ef)) {
    errors.ef = ERROR_MESSAGES.INVALID_NUMBER;
  } else if (userInput.ef < VALIDATION_LIMITS.MIN_VALUE) {
    errors.ef = ERROR_MESSAGES.NEGATIVE_NUMBER;
  } else if (userInput.ef > VALIDATION_LIMITS.MAX_EXPOSURE_FREQUENCY) {
    errors.ef = `Exposure frequency must be less than ${VALIDATION_LIMITS.MAX_EXPOSURE_FREQUENCY}`;
  }

  if (!userInput.ed) {
    errors.ed = `${ERROR_MESSAGES.REQUIRED_FIELD} Exposure Duration`;
  } else if (!isValidNumber(userInput.ed)) {
    errors.ed = ERROR_MESSAGES.INVALID_NUMBER;
  } else if (userInput.ed < VALIDATION_LIMITS.MIN_VALUE) {
    errors.ed = ERROR_MESSAGES.NEGATIVE_NUMBER;
  } else if (userInput.ed > VALIDATION_LIMITS.MAX_EXPOSURE_DURATION) {
    errors.ed = `Exposure duration must be less than ${VALIDATION_LIMITS.MAX_EXPOSURE_DURATION}`;
  }

  if (!userInput.bw) {
    errors.bw = `${ERROR_MESSAGES.REQUIRED_FIELD} Body Weight`;
  } else if (!isValidNumber(userInput.bw)) {
    errors.bw = ERROR_MESSAGES.INVALID_NUMBER;
  } else if (userInput.bw < VALIDATION_LIMITS.MIN_VALUE) {
    errors.bw = ERROR_MESSAGES.NEGATIVE_NUMBER;
  } else if (userInput.bw > VALIDATION_LIMITS.MAX_BODY_WEIGHT) {
    errors.bw = `Body weight must be less than ${VALIDATION_LIMITS.MAX_BODY_WEIGHT}`;
  }

  if (!userInput.at) {
    errors.at = `${ERROR_MESSAGES.REQUIRED_FIELD} Averaging Time`;
  } else if (!isValidNumber(userInput.at)) {
    errors.at = ERROR_MESSAGES.INVALID_NUMBER;
  } else if (userInput.at < VALIDATION_LIMITS.MIN_VALUE) {
    errors.at = ERROR_MESSAGES.NEGATIVE_NUMBER;
  } else if (userInput.at > VALIDATION_LIMITS.MAX_AVERAGING_TIME) {
    errors.at = `Averaging time must be less than ${VALIDATION_LIMITS.MAX_AVERAGING_TIME}`;
  }

  if (!userInput.contaminant) {
    errors.contaminant = `${ERROR_MESSAGES.REQUIRED_FIELD} Contaminant`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Checks if a number is valid (not NaN and finite)
 */
function isValidNumber(value: number): boolean {
  return !Number.isNaN(value) && Number.isFinite(value);
}
