import * as XLSX from "xlsx";

// Parse XLSX buffer and return a Map of contaminant keys to RfDo values
export function parseRSLXlsx(buffer: ArrayBuffer | Buffer): Map<string, { RfDo: number | undefined }> {
  const workbook = XLSX.read(buffer, { type: ArrayBuffer.isView(buffer) ? "array" : "buffer" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const resultMap = new Map<string, { RfDo: number | undefined }>();
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    const key = row[13];
    const rfd = row[4];
    if (key !== undefined) {
      resultMap.set(String(key), { RfDo: typeof rfd === "number" ? rfd : undefined });
    }
  }
  return resultMap;
}
