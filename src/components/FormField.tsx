import type React from "react";
import { FIELD_LABELS } from "@/constants";
import { FieldErrors, type UserArguments } from "@/types";
import styles from "../app/page.module.css";

interface FormFieldProps {
	id: keyof UserArguments;
	type: "number" | "select";
	value: string | number | undefined;
	onChange: (value: string | number) => void;
	error?: string;
	options?: string[];
	min?: number;
	max?: number;
	step?: number;
	required?: boolean;
	"aria-label"?: string;
}

export function FormField({
	id,
	type,
	value,
	onChange,
	error,
	options = [],
	min,
	max,
	step,
	required = false,
	"aria-label": ariaLabel,
}: FormFieldProps) {
	const label = FIELD_LABELS[id] || id;
	const fieldId = id.toUpperCase();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		if (type === "number") {
			const numValue = Number(e.target.value);
			onChange(Number.isNaN(numValue) ? "" : numValue);
		} else {
			onChange(e.target.value);
		}
	};

	return (
		<div className={styles.formFieldContainer}>
			<label htmlFor={fieldId} className={styles.fieldLabel}>
				{label}
				{required && (
					<span className={styles.required} aria-label="required">
						{" "}
						*
					</span>
				)}
			</label>

			{type === "number" ? (
				<input
					id={fieldId}
					type="number"
					value={value ?? ""}
					onChange={handleChange}
					className={`${styles.inputField} ${error ? styles.inputError : ""}`}
					min={min}
					max={max}
					step={step}
					required={required}
					aria-label={ariaLabel || label}
					aria-invalid={error ? "true" : "false"}
					aria-describedby={error ? `${fieldId}-error` : undefined}
				/>
			) : (
				<select
					id={fieldId}
					value={value ?? ""}
					onChange={handleChange}
					className={`${styles.inputField} ${error ? styles.inputError : ""}`}
					required={required}
					aria-label={ariaLabel || label}
					aria-invalid={error ? "true" : "false"}
					aria-describedby={error ? `${fieldId}-error` : undefined}
				>
					<option value="" disabled>
						Select a contaminant
					</option>
					{options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			)}

			{error && (
				<div
					id={`${fieldId}-error`}
					className={styles.fieldError}
					role="alert"
					aria-live="polite"
				>
					{error}
				</div>
			)}
		</div>
	);
}
