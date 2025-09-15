import * as XLSX from "xlsx";
import { RlsColumns } from '@/types';
import { EXCEL_COLUMNS } from '@/constants';

/**
 * Parse XLSX buffer and return a Map of contaminant keys to RfDo values
 * @param buffer - The Excel file buffer to parse
 * @returns Map of contaminant names to their RfD values
 */
export function parseRSLXlsx(buffer: ArrayBuffer | Buffer): Map<string, RlsColumns> {
  try {
    const workbook = XLSX.read(buffer, { 
      type: ArrayBuffer.isView(buffer) ? "array" : "buffer" 
    });
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('No worksheets found in the Excel file');
    }
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!worksheet) {
      throw new Error('First worksheet is empty or invalid');
    }
    
    const jsonData: unknown[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const resultMap = new Map<string, RlsColumns>();
    
    // Skip header row (index 0)
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0) continue;
      
      const contaminantName = row[EXCEL_COLUMNS.CONTAMINANT_NAME];
      const rfdValue = row[EXCEL_COLUMNS.RfD_VALUE];
      
      if (contaminantName !== undefined && contaminantName !== null && contaminantName !== '') {
        const name = String(contaminantName).trim();
        if (name) {
          const rfd = typeof rfdValue === "number" && Number.isFinite(rfdValue) 
            ? rfdValue 
            : undefined;
          
          resultMap.set(name, { RfDo: rfd });
        }
      }
    }
    
    return resultMap;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
