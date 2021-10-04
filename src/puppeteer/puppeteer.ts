import { Injectable } from '@nestjs/common';
import Puppeteer from 'puppeteer-extra';

@Injectable()
export class puppeteer {
  private StealthPlugin = require('puppeteer-extra-plugin-stealth');

  async providePage() {
    const browser = await Puppeteer.use(this.StealthPlugin).launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 0, height: 0 });
    return page;
  }
}
