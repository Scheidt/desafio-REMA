// pages/api/extract-map.ts
import type { NextApiRequest, NextApiResponse } from "next";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

export function get_xlsx(req: NextApiRequest, res: NextApiResponse) {
  // Caminho absoluto do arquivo
  const filePath = path.join(process.cwd(), "public", "RSLs_summaryTable.xlsx");

  // Lê o arquivo como Buffer
  const fileBuffer = fs.readFileSync(filePath);

  // Converte em workbook
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0]; // primeira planilha
  const worksheet = workbook.Sheets[sheetName];

  // Converte a planilha em array de arrays
  const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const resultMap = new Map<string, string>();

  // Percorre as linhas (pulando cabeçalho)
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    const key = row[13];   // Coluna N → índice 13
    const value = row[4];  // Coluna E → índice 4

    if (key !== undefined && value !== undefined) {
      resultMap.set(String(key), String(value));
    }
  }

  // Retorna o Map como objeto JSON
  res.status(200).json(Object.fromEntries(resultMap));
}