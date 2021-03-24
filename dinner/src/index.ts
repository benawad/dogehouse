import puppeteer, { Browser } from "puppeteer";

const go = async (browser: Browser) => {
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  // await page.goto("https://dogehouse.tv");
  await page.goto("http://localhost:3000");
  const [button] = await page.$x("//button[contains(., 'create test user')]");
  if (button) {
    await button.click();
  }
  const nameInput = await page.waitForSelector("input");
  let s = Math.random().toString(36).substring(7);
  nameInput.type(s + s);
  const [ok] = await page.$x("//button[contains(., 'ok')]");
  await ok.click();

  const el = await page.waitForSelector("button > div");
  const room = (await el.$x(".."))[0];
  await room.click();
};

const main = async () => {
  const browser = await puppeteer.launch({ headless: true });
  for (let i = 0; i < 10; i++) {
    go(browser);
  }
};

main();
