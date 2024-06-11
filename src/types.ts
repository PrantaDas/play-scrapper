export interface ICountries {
    name: string;
    code: string;
};

export interface ISearchResult {
    country: string;
    code: string;
    url: string;
};

export interface IInput {
    url: string;
    storeName: string;
    fileName: string;
};