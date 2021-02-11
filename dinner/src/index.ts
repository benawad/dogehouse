import puppeteer, { Browser } from "puppeteer";

const go = async (browser: Browser) => {
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  await page.goto("https://dogehouse.tv");
  // await page.goto("http://localhost:3000");
  page.on("dialog", async (dialog: any) => {
    let s = Math.random().toString(36).substring(7);
    await dialog.accept(s + s);

    const el = await page.waitForSelector("button > div");
    const room = (await el.$x(".."))[0];
    await room.click();
  });
  const [button] = await page.$x("//button[contains(., 'create test user')]");
  if (button) {
    await button.click();
  }
};

const main = async () => {
  const browser = await puppeteer.launch({ headless: true });
  for (let i = 0; i < 10; i++) {
    go(browser);
  }
};

main();
