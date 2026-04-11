const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
async function run() {
  try {
    const launchPath = await chromium.executablePath();
    console.log("CrPath:", launchPath);
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: launchPath,
      headless: chromium.headless,
    });
    console.log("Launched!");
    await browser.close();
  } catch(e) { console.error("Error:", e.message); }
}
run();
