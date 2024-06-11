import { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import ExcelJS from 'exceljs';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ICountries, ISearchResult } from './types';

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

export default class Scrapper {
    private url: string;
    private countries: ICountries[];
    private driver!: Page;
    private results: Array<ISearchResult> = [];
    private fileName: string;

    constructor(urlStr: string, data: ICountries[], fileName: string) {
        this.url = urlStr;
        this.countries = data;
        this.fileName = fileName;
    }

    async initialize(): Promise<void> {
        const browser = await puppeteer.launch({
            headless: true
        });
        this.driver = await browser.newPage();
    }

    async prepareUrlGPlay(countryCode: string): Promise<string> {
        const baseUrl = new URL(this.url);
        const searchParams = baseUrl.searchParams;
        const queries = Array.from(searchParams.entries());
        if (queries.length > 0) {
            const lastParam = queries[queries.length - 1][0];
            searchParams.set(lastParam, countryCode);
        }
        return baseUrl.toString();
    }

    async prepareUrlIos(countryCode: string): Promise<string> {
        const modifiedUrl = this.url.replace(/\.com\/\/(.*?)\/app/, countryCode);
        return modifiedUrl;
    }

    async scrapeGooglePlay(): Promise<void> {
        while (this.countries.length > 0) {
            const country = this.countries.pop();
            if (country) {
                const url = await this.prepareUrlGPlay(country.code);
                await this.driver.goto(url);
                const installAble = await this.driver.$("xpath///button[@aria-label='Install']");
                if (!installAble) {
                    this.results.push({ country: country.name, code: country.code, url });
                }
                else continue;
            }
            else break;
        }
        await this.driver.close();

        await this.exportToExcel();
    }

    async scrapeIos(): Promise<void> {
        while (this.countries.length > 0) {
            const country = this.countries.pop();
            if (country) {
                const url = await this.prepareUrlIos(country.code);
                await this.driver.goto(url);
                const notInstallAble = await this.driver.$("#we-connecting-instructions");
                if (notInstallAble) {
                    this.results.push({ country: country.name, code: country.code, url });
                }
                else continue;
            }
            else break;
        }
        await this.driver.close();

        await this.exportToExcel();
    };

    async exportToExcel(): Promise<void> {
        const workBook = new ExcelJS.Workbook();
        const sheet = workBook.addWorksheet("Results");

        sheet.columns = [
            { header: 'URL', key: 'url', width: 90 },
            { header: 'Country Name', key: 'country', width: 30 },
            { header: 'Country Code', key: 'code', width: 15 }
        ];

        this.results.filter((result) => result.country !== '' && result.code);
        this.results.forEach((result) => sheet.addRow(result));

        const dataDir = path.join(process.cwd(), "results");
        if (!existsSync(dataDir)) mkdirSync(dataDir);
        await workBook.xlsx.writeFile(path.join(dataDir, `${this.fileName}.xlsx`));
    }
};