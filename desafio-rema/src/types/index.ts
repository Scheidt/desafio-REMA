// Type definitions for the REMA Risk Assessment Calculator

export interface RlsColumns {
  RfDo: number | undefined; // RfD_o [mg/kg-day]
}

export interface UserArguments {
  c?: number; // Contaminant concentration
  ir?: number; // Intake rate
  ef?: number; // Exposure frequency
  ed?: number; // Exposure duration
  bw?: number; // Body weight
  at?: number; // Averaging time
  contaminant?: string; // Contaminant name
}

export interface FieldErrors {
  c?: string;
  ir?: string;
  ef?: string;
  ed?: string;
  bw?: string;
  at?: string;
  contaminant?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FieldErrors;
}

export interface CalculationResult {
  riskQuotient: number | null;
  resultMessage: string | null;
  isError: boolean;
}

export interface ExcelRow {
  [key: number]: any;
}

export interface ExcelData {
  [key: number]: ExcelRow;
}

// Form field configuration
export interface FormField {
  id: keyof UserArguments;
  label: string;
  type: 'number' | 'select';
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
}
