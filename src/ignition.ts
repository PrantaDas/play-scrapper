import Scrapper from "./scrapper";
import { fly, retriveDataForGPlay, retriveDataForIos } from "./utils"

export default async function ignition(): Promise<void> {
    const inputData = await fly();
    if (!inputData) process.exit();
    switch (inputData.storeName) {
        case "android":
            const playData = retriveDataForGPlay();
            if (!playData) {
                console.log("=> No Data Found");
                process.exit();
            }
            console.log(`=> Found ${playData.length} Countries`);
            const playScrapper = new Scrapper(
                inputData.url,
                playData,
                inputData.fileName
            );
            await playScrapper.initialize();
            console.log("=> Scrapper initialized");
            await playScrapper.scrapeGooglePlay();
            console.log("=> Scraping Completed");
            break;
        case "ios":
            const iosData = retriveDataForIos();
            if (!iosData) {
                console.log("=> No Data Found");
                process.exit();
            }
            console.log(`=> Found ${iosData.length} Countries`);
            const iosScrapper = new Scrapper(
                inputData.url,
                iosData,
                inputData.fileName
            );
            await iosScrapper.initialize();
            console.log("=> Scrapper initialized");
            await iosScrapper.scrapeGooglePlay();
            console.log("=> Scraping Completed");
            break;
        default:
            console.log("[+] Exiting... Invalid App Store Provided");
            process.exit();
    }
    process.exit(0);

};