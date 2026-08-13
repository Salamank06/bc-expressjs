import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Report } from './types.js';

export async function writeReport(report: Report, path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(report, null, 2), 'utf-8');
}
