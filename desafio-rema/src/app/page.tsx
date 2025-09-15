"use client";

import Image from "next/image";
import { estimatedIntake, nonCarcinogenicRisk } from "@/utils/math_utils";
import { useState, useEffect, useCallback } from "react";
import { stringToNumber } from "@/utils/main";
import { parseRSLXlsx } from "@/utils/parse_xlsx";
import styles from "./page.module.css";

type rlsColumns = {
  RfDo: number | undefined; //RfD_o [mg/kg-day]
};

type userArguments = {
  c?: number;
  ir?: number;
  ef?: number;
  ed?: number;
  bw?: number;
  at?: number;
  contaminant?: string;
};

type FieldErrors = {
  c?: string;
  ir?: string;
  ef?: string;
  ed?: string;
  bw?: string;
  at?: string;
  contaminant?: string;
};

export default function Home() {
  const [userInput, setUserInput] = useState<userArguments>({});
  const [calculateResult, setCalculateResult] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [mapData, setMapData] = useState<Map<string, rlsColumns>>(new Map());

  const loadDataFromXlsx = useCallback(async () => {
    const res = await fetch("/RSLs_summaryTable.xlsx");
    const arrayBuffer = await res.arrayBuffer();
    // Use shared utility for parsing
    const resultMap = parseRSLXlsx(arrayBuffer);
    setMapData(resultMap);
    return;
  }, [setMapData]);

  useEffect(() => {
    if (calculateResult === null || Number.isNaN(calculateResult)) {
      return;
    }
    if (calculateResult >= 1) {
      setResultMessage("Potential Health Risk");
    } else {
      setResultMessage("Low or No Potential Health Risks");
    }
  }, [calculateResult]);

  useEffect(() => {
    loadDataFromXlsx();
  }, [loadDataFromXlsx]);

  const handleCalculate = () => {
    const newErrors: FieldErrors = {};

  if (!userInput.c) newErrors.c = "Please, inform Contaminant Concentration";
  if (!userInput.ir) newErrors.ir = "Please, inform Intake Rate";
  if (!userInput.ef) newErrors.ef = "Please, inform Exposure Frequency";
  if (!userInput.ed) newErrors.ed = "Please, inform Exposure Duration";
  if (!userInput.bw) newErrors.bw = "Please, inform Body Weight";
  if (!userInput.at) newErrors.at = "Please, inform Averaging Time";
  if (!userInput.contaminant) newErrors.contaminant = "Please, inform Contaminant";

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setGlobalError(null);
      setCalculateResult(null);
      setResultMessage("Error while calculating QR, please fill all fields");
      return;
    }

    setFieldErrors({});

    let estimateIntake = estimatedIntake(
      userInput.c!,
      userInput.ir!,
      userInput.ef!,
      userInput.ed!,
      userInput.bw!,
      userInput.at!
    );


    const contaminantData = mapData.get(userInput.contaminant!);
    if (!contaminantData?.RfDo) {
      setGlobalError("ERROR: Contaminant not found, or, RFDo not found");
      setCalculateResult(null);
      setResultMessage("Error while calculating QR, please fill all fields");
      return;
    }

    setGlobalError(null);
  let risk = nonCarcinogenicRisk(estimateIntake, contaminantData.RfDo);
  setCalculateResult(risk);
  };
  
  // A helper constant to determine if the result message is an error
  const isResultError = Object.keys(fieldErrors).length > 0 || globalError !== null;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.inputSection}>
          <label htmlFor="C">
            Contaminant Concentration in Medium [mg/L or mg/kg]:
          </label>
          <input
            id="C"
            type="number"
            value={userInput.c ?? ""}
            onChange={(e) =>
              setUserInput({ ...userInput, c: stringToNumber(e.target.value) })
            }
            className={styles.inputField}
          />
          {fieldErrors.c && <div className={styles.fieldError}>{fieldErrors.c}</div>}

          <label htmlFor="IR">
            Intake Rate / Contact Rate with medium [L/day or kg/day]:
          </label>
          <input
            id="IR"
            type="number"
            value={userInput.ir ?? ""}
            onChange={(e) =>
              setUserInput({ ...userInput, ir: stringToNumber(e.target.value) })
            }
            className={styles.inputField}
          />
          {fieldErrors.ir && <div className={styles.fieldError}>{fieldErrors.ir}</div>}

          <label htmlFor="EF">Exposure Frequency [day/year]:</label>
          <input
            id="EF"
            type="number"
            value={userInput.ef ?? ""}
            onChange={(e) =>
              setUserInput({ ...userInput, ef: stringToNumber(e.target.value) })
            }
            className={styles.inputField}
          />
          {fieldErrors.ef && <div className={styles.fieldError}>{fieldErrors.ef}</div>}

          <label htmlFor="ED">Exposure Duration [year]:</label>
          <input
            id="ED"
            type="number"
            value={userInput.ed ?? ""}
            onChange={(e) =>
              setUserInput({ ...userInput, ed: stringToNumber(e.target.value) })
            }
            className={styles.inputField}
          />
          {fieldErrors.ed && <div className={styles.fieldError}>{fieldErrors.ed}</div>}

          <label htmlFor="bw">Body Weight [kg]:</label>
          <input
            id="BW"
            type="number"
            value={userInput.bw ?? ""}
            onChange={(e) =>
              setUserInput({ ...userInput, bw: stringToNumber(e.target.value) })
            }
            className={styles.inputField}
          />
          {fieldErrors.bw && <div className={styles.fieldError}>{fieldErrors.bw}</div>}

          <label htmlFor="AT">Averaging time [day]:</label>
          <input
            id="AT"
            type="number"
            value={userInput.at ?? ""}
            onChange={(e) =>
              setUserInput({ ...userInput, at: stringToNumber(e.target.value) })
            }
            className={styles.inputField}
          />
          {fieldErrors.at && <div className={styles.fieldError}>{fieldErrors.at}</div>}

          <label htmlFor="contaminant">Contaminant:</label>
          <select
            id="contaminant"
            value={userInput.contaminant ?? ""}
            onChange={(e) =>
              setUserInput({ ...userInput, contaminant: e.target.value })
            }
            className={styles.inputField}
          >
            <option value="" disabled>Select a contaminant</option>
            {Array.from(mapData.keys()).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          {fieldErrors.contaminant && <div className={styles.fieldError}>{fieldErrors.contaminant}</div>}

          <button onClick={handleCalculate} className={styles.calculateButton}>
            Calculate
          </button>
          {globalError && <div className={styles.errorMessage}>{globalError}</div>}
        </div>

        <div className={styles.resultSection}>
          <div className={styles.resultBox}>
            <p className={styles.resultText}>Risk Quotient</p>
            {calculateResult !== null && (
              <span className={styles.resultValue}>
                {calculateResult.toPrecision(3)}
              </span>
            )}
            {resultMessage && (
              <span
                className={
                  isResultError ? styles.resultError : styles.resultValue
                }
              >
                {resultMessage}
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}