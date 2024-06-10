import Scrapper from "./scrapper";
import { retriveData } from "./utils";

async function main(): Promise<void> {
    try {
        const data = retriveData();
        if (!data) {
            console.log("=> No Data Found");
            process.exit();
        }
        console.log(`=> Found ${data.length} Countries`);
        const scrapper = new Scrapper(
            "https://play.google.com/store/apps/details?id=com.app.smartcriccricketmatch&gl=us",
            data
        );
        await scrapper.initialize();
        console.log("=> Scrapper initialized");
        await scrapper.scrape();
        console.log("=> Scraping Completed");
    } catch (err: any) {
        console.log(err.message);
    }

    console.log("=> Report Generated");
    process.exit();
};

main();