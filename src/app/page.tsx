"use client";

import { FormField } from "@/components/FormField";
import { useRiskCalculator } from "@/hooks/useRiskCalculator";
import styles from "./page.module.css";

export default function Home() {
	const {
		userInput,
		fieldErrors,
		globalError,
		calculationResult,
		mapData,
		isLoading,
		handleCalculate,
		updateField,
	} = useRiskCalculator();

	const contaminantOptions = Array.from(mapData.keys());

	if (isLoading) {
		return (
			<main className={styles.main}>
				<div className={styles.container}>
					<div className={styles.loadingMessage}>
						Loading contaminant data...
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<div className={styles.inputSection}>
					<FormField
						id="c"
						type="number"
						value={userInput.c}
						onChange={(value) => updateField("c", value)}
						error={fieldErrors.c}
						min={0}
						step={0.001}
						required
						aria-label="Contaminant concentration in medium"
					/>

					<FormField
						id="ir"
						type="number"
						value={userInput.ir}
						onChange={(value) => updateField("ir", value)}
						error={fieldErrors.ir}
						min={0}
						step={0.1}
						required
						aria-label="Intake rate or contact rate with medium"
					/>

					<FormField
						id="ef"
						type="number"
						value={userInput.ef}
						onChange={(value) => updateField("ef", value)}
						error={fieldErrors.ef}
						min={0}
						max={365}
						step={1}
						required
						aria-label="Exposure frequency"
					/>

					<FormField
						id="ed"
						type="number"
						value={userInput.ed}
						onChange={(value) => updateField("ed", value)}
						error={fieldErrors.ed}
						min={0}
						step={1}
						required
						aria-label="Exposure duration"
					/>

					<FormField
						id="bw"
						type="number"
						value={userInput.bw}
						onChange={(value) => updateField("bw", value)}
						error={fieldErrors.bw}
						min={0}
						step={0.1}
						required
						aria-label="Body weight"
					/>

					<FormField
						id="at"
						type="number"
						value={userInput.at}
						onChange={(value) => updateField("at", value)}
						error={fieldErrors.at}
						min={0}
						step={1}
						required
						aria-label="Averaging time"
					/>

					<FormField
						id="contaminant"
						type="select"
						value={userInput.contaminant}
						onChange={(value) => updateField("contaminant", value)}
						error={fieldErrors.contaminant}
						options={contaminantOptions}
						required
						aria-label="Select contaminant"
					/>

					<button
						onClick={handleCalculate}
						className={styles.calculateButton}
						disabled={isLoading}
						aria-label="Calculate risk quotient"
					>
						{isLoading ? "Loading..." : "Calculate"}
					</button>

					{globalError && (
						<div
							className={styles.errorMessage}
							role="alert"
							aria-live="polite"
						>
							{globalError}
						</div>
					)}
				</div>

				<div className={styles.resultSection}>
					<div className={styles.resultBox}>
						<h2 className={styles.resultText}>Risk Quotient</h2>
						{calculationResult.riskQuotient !== null && (
							<span className={styles.resultValue}>
								{calculationResult.riskQuotient}
							</span>
						)}
						{calculationResult.resultMessage && (
							<span
								className={
									calculationResult.isError
										? styles.resultError
										: styles.resultValue
								}
								role={calculationResult.isError ? "alert" : "status"}
								aria-live="polite"
							>
								{calculationResult.resultMessage}
							</span>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
