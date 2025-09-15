import type { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";
import path from "path";
import { parseRSLXlsx } from "@/utils/parse_xlsx";

export function get_xlsx(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "public", "RSLs_summaryTable.xlsx");
  const fileBuffer = fs.readFileSync(filePath);
  const resultMap = parseRSLXlsx(fileBuffer);
  res.status(200).json(Object.fromEntries(
    Array.from(resultMap.entries()).map(([k, v]) => [k, v.RfDo])
  ));
}