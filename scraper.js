const puppeteer = require("puppeteer")
const fs = require("fs")
const tabletojson = require('tabletojson').Tabletojson;

const AppDAO = require('./dao')
const TokenRepository = require('./model');
const { table } = require("console");

// Entry Path Defination
const ADDRESS = "0x53930807383be7139e1da1a758370cd64469ee43"; // String Input for Contract Address
var pageNo = 1; //start of the page

// Define Base URL
var baseURL = "https://arbiscan.io/token/" + ADDRESS;
console.log(baseURL)

// Fetch baseURL HTML and extract Total No of Pages
// Fetch Table from BaseURL

const main = async _ => {
    console.log("Start");
    var jsonData = [];

    const tableData = await getData(baseURL);
    console.log(tableData.length)
    const dao = new AppDAO('./database.db');
    const tokenRepo = new TokenRepository(dao);

    tokenRepo.createTable().then(() => {
        for (let index = 0; index < tableData.length; index++){
            tableData[index].forEach(row => {
                console.log(row)
                tokenRepo.create(row)
            })
        }
    })

    // // Save data to json
    // fs.writeFileSync('jsonData.json', JSON.stringify(tableData));

    console.log("End");
};

main()


// Supporting Functions

async function getData(url) {
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(baseURL)

        // Leave extra time for complete the page load (Just to be cautious);
        await page.waitForTimeout(2000)

        // Get the src of the iframe

        const frames = await page.frames();
        let iframe = frames.find(f => f.name() === 'tokentxnsiframe')

        // Get the context
        let context = await iframe.executionContext();

        //evaulate the frame and get the required data
        const lastPage = await context.evaluate(() => {
            const el = document.querySelector("#maindiv > div.d-md-flex.justify-content-between.mb-4 > nav > ul \
                                                > li:nth-child(3) > span > strong:nth-child(2)");
            if (el) return el.textContent;
        });

        console.log(lastPage)
        var jsonData = [];

        for (let index = 0; index < lastPage-1; index++) {
        // for (let index = 0; index < 2; index++) {
            console.log("Feteching Dataframe from " + [index + 1] + " of " + lastPage + " page")

            //evaulate the frame and get the required data
            const tableData = await context.evaluate(() => {
                const el = document.querySelector("#maindiv > div.table-responsive.mb-2.mb-md-0");
                if (el) return el.outerHTML;
            });

            // Convert html table data to json format    
            const tableJsonData = tabletojson.convert(tableData);

            // console.log(tableJsonData)
            // Some of the values are not mapped correctly, the following commands are to correct and format json keys
            var formattedtableJsonData = tableJsonData[0].map(
                obj => {
                    return {
                        // "0": obj["0"],
                        "timestamp": obj["Age"],
                        "txn_hash": obj["Txn Hash"],
                        "method": obj["Method"],
                        'age': obj["From"],
                        "sender": obj["4"],
                        "receiver": obj["TokenID"],
                        "token_id": obj["7"]
                    }
                })

            jsonData.push(formattedtableJsonData)
            
            const navigationSelector = '#maindiv > div.d-md-flex.justify-content-between.mb-4 > nav > ul > li:nth-child(4) > a';

            // let framedButton = await iframe.$eval(navigationSelector, e => e.outerHTML);
            // console.log(framedButton)

            // click next to navigate to next page
            const [response] = await Promise.all([
                iframe.waitForNavigation("domcontentloaded"), // The navigation promise resolves after navigation has finished
                iframe.click(navigationSelector),
            ]);

            // additional wait to make sure frame is loaded. It depends on internet speed 2 second is more than enough for me
            await page.waitForTimeout(2000)

            iframe = response.frame();
            context = await iframe.executionContext();
        }

        // Close Browser
        await browser.close()

        // Return Aggregated Json Data Array
        return jsonData
    }
    catch (err) {
        console.error(err);
    }
}