// Constants for the REMA Risk Assessment Calculator

// Excel column indices
export const EXCEL_COLUMNS = {
	CONTAMINANT_NAME: 13,
	RfD_VALUE: 4,
} as const;

// Error messages
export const ERROR_MESSAGES = {
	REQUIRED_FIELD: "Please, inform",
	CONTAMINANT_NOT_FOUND:
		"ERROR: Contaminant not found, or Contaminant dos not have a RFD0 value",
	CALCULATION_ERROR: "Error while calculating QR, please fill all fields",
	INVALID_NUMBER: "Please enter a valid number",
	NEGATIVE_NUMBER: "Please enter a positive number",
} as const;

// Field labels - using variable names as keys for easy access
export const FIELD_LABELS = {
	c: "Contaminant Concentration in Medium [mg/L or mg/kg]:",
	ir: "Intake Rate / Contact Rate with medium [L/day or kg/day]:",
	ef: "Exposure Frequency [day/year]:",
	ed: "Exposure Duration [year]:",
	bw: "Body Weight [kg]:",
	at: "Averaging time [day]:",
	contaminant: "Contaminant:",
} as const;

// Result messages
export const RESULT_MESSAGES = {
	POTENTIAL_RISK: "Potential Health Risk",
	LOW_RISK: "Low or No Potential Health Risks",
} as const;

// Risk thresholds
export const RISK_THRESHOLDS = {
	HIGH_RISK: 1,
} as const;

// Display precision
export const DISPLAY_PRECISION = 3;

// Input validation limits
export const VALIDATION_LIMITS = {
	MIN_VALUE: 0,
	MAX_CONCENTRATION: 10000,
	MAX_INTAKE_RATE: 100,
	MAX_EXPOSURE_FREQUENCY: 365,
	MAX_EXPOSURE_DURATION: 100,
	MAX_BODY_WEIGHT: 500,
	MAX_AVERAGING_TIME: 36500, // ~100 years
} as const;
