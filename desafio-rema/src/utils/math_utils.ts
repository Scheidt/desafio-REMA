/**
 * Estimates the daily intake (I) of a contaminant for a human based on exposure parameters.
 * 
 * This function calculates the amount of a contaminant absorbed by a human using the formula:
 * 
 * I = (C × IR × EF × ED) / (BW × AT)
 * 
 * Where:
 * - I: Intake of the contaminant [mg/(kg·day)]
 * - C: Contaminant concentration in the medium [mg/L or mg/kg]
 * - IR: Intake rate or contact rate with the medium [L/day or kg/day]
 * - EF: Exposure frequency [day/year]
 * - ED: Exposure duration [year]
 * - BW: Body weight [kg]
 * - AT: Averaging time [day]
 * 
 * @param {number} c - Contaminant concentration in the medium [mg/L or mg/kg].
 * @param {number} ir - Intake rate or contact rate with the medium [L/day or kg/day].
 * @param {number} ef - Exposure frequency [day/year].
 * @param {number} ed - Exposure duration [year].
 * @param {number} bw - Body weight [kg].
 * @param {number} at - Averaging time [day].
 * @returns {number} The estimated daily intake of the contaminant [mg/(kg·day)].
 * 
 * @example
 * const intake = estimatedIntake(0.01, 2, 350, 30, 70, 25550);
 * console.log(intake); // Output: estimated intake value in mg/(kg·day)
 */
export function estimatedIntake(
    c: number,
    ir: number,
    ef: number,
    ed: number,
    bw: number,
    at: number
): number {
    return c*(ir*ef*ed)/(bw*at)
}

/**
 * Calculates the non-carcinogenic risk (Risk Quotient, QR) for a given contaminant.
 * 
 * The non-carcinogenic risk is computed as the ratio of the contaminant intake
 * to its Reference Dose (RfD), which defines the maximum exposure level
 * without expected adverse health effects.
 * 
 * Interpretation:
 * - QR > 1 indicates a potential health risk
 * - QR ≤ 1 indicates exposure is within safe limits
 * 
 * @param {number} intake - The daily intake of the contaminant [mg/(kg·day)].
 * @param {number} rfd - The Reference Dose of the contaminant [mg/(kg·day)].
 * @returns {number}  The calculated non-carcinogenic risk quotient (QR), unitless.
 * 
 * @example
 * const qr = nonCarcinogenicRisk(0.005, 0.01);
 * console.log(qr); // Output: 0.5 (safe exposure)
 * 
 * @example
 * const qr = nonCarcinogenicRisk(0.02, 0.01);
 * console.log(qr); // Output: 2 (potential health risk)
 */
export function nonCarcinogenicRisk(
    intake: number,
    rfd: number
): number {
    return intake/rfd;
}