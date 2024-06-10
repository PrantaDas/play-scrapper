import fs from 'fs';
import path from 'path';
import { ICountries } from './types';

export function retriveData(): Array<ICountries> | null {
    const data = fs.readFileSync(path.join(
        process.cwd(), 'country.txt'
    ), "utf8");
    if (data.trim().length === 0) return null;
    const parts = data.split(/\d+\.\s/).filter(Boolean).map((item) => item.trim());
    const countriesArray: ICountries[] = parts.map((p) => {
        return {
            name: p.split("=")[0]?.trim(),
            code: p.split("=")[1]?.trim()?.toLowerCase()
        };
    });
    if (countriesArray.length === 0) return null;
    return countriesArray;
};