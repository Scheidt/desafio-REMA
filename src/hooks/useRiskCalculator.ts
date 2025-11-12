import { useState, useEffect, useCallback } from "react";
import { UserArguments, FieldErrors, CalculationResult } from "@/types";
import { estimatedIntake, nonCarcinogenicRisk } from "@/utils/math_utils";
import { validateUserInput } from "@/utils/validation";
import { parseRSLXlsx } from "@/utils/parse_xlsx";
import {
	ERROR_MESSAGES,
	RESULT_MESSAGES,
	RISK_THRESHOLDS,
	DISPLAY_PRECISION,
} from "@/constants";

interface UseRiskCalculatorReturn {
	userInput: UserArguments;
	setUserInput: React.Dispatch<React.SetStateAction<UserArguments>>;
	fieldErrors: FieldErrors;
	globalError: string | null;
	calculationResult: CalculationResult;
	mapData: Map<string, { RfDo: number | undefined }>;
	isLoading: boolean;
	handleCalculate: () => void;
	updateField: (field: keyof UserArguments, value: string | number) => void;
}

export function useRiskCalculator(): UseRiskCalculatorReturn {
	const [userInput, setUserInput] = useState<UserArguments>({});
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [globalError, setGlobalError] = useState<string | null>(null);
	const [calculationResult, setCalculationResult] = useState<CalculationResult>(
		{
			riskQuotient: null,
			resultMessage: null,
			isError: false,
		},
	);
	const [mapData, setMapData] = useState<
		Map<string, { RfDo: number | undefined }>
	>(new Map());
	const [isLoading, setIsLoading] = useState(true);

	const loadDataFromXlsx = useCallback(async () => {
		try {
			setIsLoading(true);
			const res = await fetch("/RSLs_summaryTable.xlsx");
			if (!res.ok) {
				throw new Error(`Failed to fetch Excel file: ${res.statusText}`);
			}
			const arrayBuffer = await res.arrayBuffer();
			const resultMap = parseRSLXlsx(arrayBuffer);
			setMapData(resultMap);
		} catch (error) {
			console.error("Error loading Excel data:", error);
			setGlobalError(
				"Failed to load contaminant data. Please refresh the page.",
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadDataFromXlsx();
	}, [loadDataFromXlsx]);

	const updateField = useCallback(
		(field: keyof UserArguments, value: string | number) => {
			setUserInput((prev) => ({ ...prev, [field]: value }));
			// Clear field error when user starts typing
			if (fieldErrors[field]) {
				setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
			}
		},
		[fieldErrors],
	);

	const handleCalculate = useCallback(() => {
		// Clear previous errors
		setFieldErrors({});
		setGlobalError(null);
		setCalculationResult({
			riskQuotient: null,
			resultMessage: null,
			isError: false,
		});

		// Validate input
		const validation = validateUserInput(userInput);
		if (!validation.isValid) {
			setFieldErrors(validation.errors);
			setCalculationResult({
				riskQuotient: null,
				resultMessage: ERROR_MESSAGES.CALCULATION_ERROR,
				isError: true,
			});
			return;
		}

		try {
			// Calculate estimated intake
			const intake = estimatedIntake(
				userInput.c!,
				userInput.ir!,
				userInput.ef!,
				userInput.ed!,
				userInput.bw!,
				userInput.at!,
			);

			// Get contaminant data
			const contaminantData = mapData.get(userInput.contaminant!);
			if (!contaminantData?.RfDo) {
				setGlobalError(ERROR_MESSAGES.CONTAMINANT_NOT_FOUND);
				setCalculationResult({
					riskQuotient: null,
					resultMessage: ERROR_MESSAGES.CALCULATION_ERROR,
					isError: true,
				});
				return;
			}

			// Calculate risk quotient
			const risk = nonCarcinogenicRisk(intake, contaminantData.RfDo);

			// Determine result message
			const resultMessage =
				risk >= RISK_THRESHOLDS.HIGH_RISK
					? RESULT_MESSAGES.POTENTIAL_RISK
					: RESULT_MESSAGES.LOW_RISK;

			setCalculationResult({
				riskQuotient: Number(risk.toPrecision(DISPLAY_PRECISION)),
				resultMessage,
				isError: false,
			});
		} catch (error) {
			console.error("Calculation error:", error);
			setGlobalError(
				error instanceof Error ? error.message : "An unexpected error occurred",
			);
			setCalculationResult({
				riskQuotient: null,
				resultMessage: ERROR_MESSAGES.CALCULATION_ERROR,
				isError: true,
			});
		}
	}, [userInput, mapData]);

	return {
		userInput,
		setUserInput,
		fieldErrors,
		globalError,
		calculationResult,
		mapData,
		isLoading,
		handleCalculate,
		updateField,
	};
}
