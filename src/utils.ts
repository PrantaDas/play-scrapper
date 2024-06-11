import fs from 'fs';
import path from 'path';
import readline from "readline/promises";
import { stdout as output, stdin as input } from "node:process";
import { ICountries, IInput } from './types';

const rl = readline.createInterface({ input, output });

export function retriveDataForGPlay(): Array<ICountries> | null {
    const data = fs.readFileSync(path.join(
        process.cwd(), 'misc', 'country.google.txt'
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

export function retriveDataForIos(): Array<ICountries> | null {
    const data = fs.readFileSync(
        path.join(process.cwd(), 'misc', 'country.ios.txt'),
        "utf8"
    );
    const parts = data.split(",").map((d) => {
        const dataParts = d.trim();
        const single = dataParts.split(":").map((d) => d.trim());
        return {
            name: single[0]?.trim(),
            code: single[1]?.trim()
        };
    });
    if (parts.length === 0) return null;
    return parts;
};

export async function fly(): Promise<IInput | void> {

    console.log(`
    +-++-++-+ +-++-++-+
    |A||P||P| |M||A||P|
    +-++-++-+ +-++-++-+
    `);
    console.log(`
    Made With ❤️ By Pranta Das..
    \x1b[1m\x1b[4mhttps://github.com/Prantadas\x1b[0m\n\n`);

    const appStores = ["android", "ios"];
    const storeName = (await rl.question("1. Choose App Store (android/ios): ")).trim();
    if (!appStores.includes(storeName)) {
        console.log("[+] Exiting... Invalid App Store Provided");
        process.exit();
    }

    const url = (await rl.question("2. Enter the URL: ")).trim();
    if (url.includes("apps.apple.com") && storeName !== 'ios') {
        console.log("[+] Exiting... Invalid App Store URL Provided");
        process.exit();
    }

    else if (storeName !== "android" && url.includes("play.google.com/store/apps")) {
        console.log("[+] Exiting... Invalid App Store URL Provided");
        process.exit();
    }

    const fileName = (await rl.question("3. Enter A result file name (Eg: CricBuzz): ")).trim();

    return {
        url,
        fileName,
        storeName,
    };
};