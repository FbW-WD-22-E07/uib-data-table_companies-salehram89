const puppeteer = require("puppeteer");
const path = require('path');

const browserOptions = {
    headless: true,
    defaultViewport: null,
    devtools: false,
}
let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
    //await page.screenshot({ path: 'Homepage.png' });
},30000);

afterAll((done) =>{
    try{
        this.puppeteer.close(); 
    } catch(e){
        console.log(e);
    }
    done();
});

describe("UIB Data Table", () => {
    it("Index file should contain appropriate meta tags", async () => {
        const metaTags = await page.$$('meta');
        expect(metaTags.length).toBeGreaterThan(1);
    });
    it("CSS Stylesheet Should be linked", async () => {
        const cssLink = await page.$('link[rel="stylesheet"]');
        expect(cssLink).toBeTruthy();
    })
    it("Index file Should contain a title tag that is not empty", async () => {
        const title = await page.$eval('title', el => el.innerHTML);
        expect(title).not.toBe('');
    });
    it("Table exists", async () => {
        const table = await page.$('table');
        expect(table).toBeTruthy();
    });
    it("Table should contain 4 Columns", async () => {
        const columns = await page.$$('table th');
        expect(columns.length).toBe(4);
    });
    it("All Links on the Page should open in a new tab", async () => {
        const links = await page.$$('a');
        links.forEach(async link => {
            const target = await page.evaluate(el => el.target, link);
            expect(target).toMatch(/blank/i);
        });
    });
    it('No style attribute should be present on the table', async () => {
        // get all child elements of the table
        const table = await page.$('table');
        const styleAttributes = await table.$x('//*[@style]');
        // expect no style attributes to be present on the table
        expect(styleAttributes.length).toBe(0);
       
    });
});