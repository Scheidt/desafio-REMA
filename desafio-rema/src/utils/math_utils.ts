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
 * @param c - Contaminant concentration in the medium [mg/L or mg/kg].
 * @param ir - Intake rate or contact rate with the medium [L/day or kg/day].
 * @param ef - Exposure frequency [day/year].
 * @param ed - Exposure duration [year].
 * @param bw - Body weight [kg].
 * @param at - Averaging time [day].
 * @returns The estimated daily intake of the contaminant [mg/(kg·day)].
 * @throws {Error} If any parameter is invalid (NaN, negative, or zero for denominators).
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
    // Input validation
    const params = { c, ir, ef, ed, bw, at };
    for (const [key, value] of Object.entries(params)) {
        if (Number.isNaN(value) || !Number.isFinite(value)) {
            throw new Error(`Invalid parameter ${key}: must be a valid number`);
        }
        if (value < 0) {
            throw new Error(`Invalid parameter ${key}: must be non-negative`);
        }
    }
    
    // Check for division by zero
    if (bw === 0 || at === 0) {
        throw new Error('Body weight and averaging time must be greater than zero');
    }
    
    return (c * ir * ef * ed) / (bw * at);
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
 * @param intake - The daily intake of the contaminant [mg/(kg·day)].
 * @param rfd - The Reference Dose of the contaminant [mg/(kg·day)].
 * @returns The calculated non-carcinogenic risk quotient (QR), unitless.
 * @throws {Error} If any parameter is invalid or RfD is zero.
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
    // Input validation
    if (Number.isNaN(intake) || !Number.isFinite(intake)) {
        throw new Error('Invalid intake: must be a valid number');
    }
    if (Number.isNaN(rfd) || !Number.isFinite(rfd)) {
        throw new Error('Invalid RfD: must be a valid number');
    }
    if (intake < 0) {
        throw new Error('Intake must be non-negative');
    }
    if (rfd <= 0) {
        throw new Error('RfD must be greater than zero');
    }
    
    return intake / rfd;
}