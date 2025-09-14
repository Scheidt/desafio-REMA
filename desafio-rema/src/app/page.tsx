// In app/page.tsx

"use client"

import Image from "next/image";
import * as XLSX from "xlsx";
import { estimatedIntake, nonCarcinogenicRisk } from "@/utils/math_utils";
import { useState, useEffect, useCallback } from "react";
import { stringToNumber } from "@/utils/main";
import styles from './page.module.css';

type rlsColumns = {
  RfDo: number|undefined, //RfD_o [mg/kg-day]
};
type userArguments = {
  c?:number,
  ir?:number,
  ef?:number,
  ed?:number,
  bw?:number,
  at?:number,
  analyte?:string
}



export default function Home() {
  const [userInput, setUserInput] = useState<userArguments>({});
  const [calculateResult, setCalculateResult] = useState<string>("");
  const [mapData, setMapData] = useState<Map<string, rlsColumns>>(new Map());

  const loadDataFromXlsx = useCallback(async () => {
    const res = await fetch("/RSLs_summaryTable.xlsx");
    const arrayBuffer = await res.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const resultMap = new Map<string, rlsColumns>();
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];//
      const key = row[13];    // Coluna N
      const rfd = row[4];     // Coluna E
      if (key !== undefined) {
        resultMap.set(String(key), {
          RfDo: stringToNumber(rfd)
        });
      }
    }

    setMapData(resultMap);
    return;
  }, [setMapData]);

  useEffect(() => {
    loadDataFromXlsx();
  }, [loadDataFromXlsx]); // Added dependency to useEffect hook

  // Performs the calculation when the button is clicked
  const handleCalculate = () => {
    // Verifing if the user inform all fields.
    if (
      !userInput.c  ||
      !userInput.ir ||
      !userInput.ef ||
      !userInput.ed ||
      !userInput.bw ||
      !userInput.at ||
      !userInput.analyte
    ) {
      setCalculateResult("ERROR: You need to inform all fields.");
      return;
    }
    // Resultados
    let estimateIntake = estimatedIntake(userInput.c, userInput.ir, userInput.ef, userInput.ed, userInput.bw, userInput.at);
    
    const analyteData = mapData.get(userInput.analyte);
    if(!analyteData?.RfDo) {
      setCalculateResult("ERROR: Analyte not founded, or, RFDo not founded");
      return;
    } 
    let risk = nonCarcinogenicRisk(estimateIntake, analyteData.RfDo);
    
    setCalculateResult(String(risk));
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Left side: Inputs and Button */}
        <div className={styles.inputSection}>

          <label htmlFor="C">Contaminant Concentration in Medium [mg/L or mg/kg]:</label>
          <input
            id="C"
            type="number"
            value={userInput.c ?? ''}
            onChange={(e) => setUserInput({...userInput, c: stringToNumber(e.target.value)})}
            className={styles.inputField}
          />

          <label htmlFor="IR">Intake Rate / Contact Rate with medium [L/day or kg/day]:</label>
          <input
            id="IR"
            type="number"
            value={userInput.ir ?? ''}
            onChange={(e) => setUserInput({...userInput, ir: stringToNumber(e.target.value)})}
            className={styles.inputField}
          />

          <label htmlFor="EF">Exposure Frequency [day/year]:</label>
          <input
            id="EF"
            type="number"
            value={userInput.ef ?? ''}
            onChange={(e) => setUserInput({...userInput, ef: stringToNumber(e.target.value)})}
            className={styles.inputField}
          />

          <label htmlFor="ED">Exposure Duration [year]:</label>
          <input
            id="ED"
            type="number"
            value={userInput.ed ?? ''}
            onChange={(e) => setUserInput({...userInput, ed: stringToNumber(e.target.value)})}
            className={styles.inputField}
          />

          <label htmlFor="bw">Body Weight [kg]:</label>
          <input
            id="BW"
            type="number"
            value={userInput.bw ?? ''}
            onChange={(e) => setUserInput({...userInput, bw: stringToNumber(e.target.value)})}
            className={styles.inputField}
          />

          <label htmlFor="AT">Averaging time [day]:</label>
          <input
            id="AT"
            type="number"
            value={userInput.at ?? ''}
            onChange={(e) => setUserInput({...userInput, at: stringToNumber(e.target.value)})}
            className={styles.inputField}
          />

          <label htmlFor="anality">Anality:</label>
          <select
            id="anality"
            value={userInput.analyte ?? ''}
            onChange={(e) => setUserInput({...userInput, analyte: e.target.value})}
            className={styles.inputField} /* Matched class for consistency */
          >
            {/* Added a default, disabled option */}
            <option value="" disabled>Select an analyte</option>
            {Array.from(mapData.keys()).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          
          <button onClick={handleCalculate} className={styles.calculateButton}>
            Calculate
          </button>
        </div>

        {/* Right side: Result Display */}
        <div className={styles.resultSection}>
          <div className={styles.resultBox}>
            <p className={styles.resultText}>Risk Quotient</p>
            <span className={styles.resultValue}>{calculateResult}</span>
          </div>
        </div>
      </div>
    </main>
  );
}