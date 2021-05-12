import { browser, logging } from 'protractor';
import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display message saying Ristorante Con Fusion', async () => {
    await page.navigateTo(browser.baseUrl);
    expect(await page.getTitleText('app-root h1')).toEqual('Ristorante Con Fusion');
  });

  it('should navigate to about us page by clicking on the link', async () => {
    await page.navigateTo(browser.baseUrl);
    let navlink = await page.getAllElements('a').get(1);
    await navlink.click();
    expect(await page.getTitleText('h3')).toBe('About Us');
  })

  it('should enter a new comment for the first dish', async () => {
    await page.navigateTo(browser.baseUrl + 'dishdetail/0');

    const newAuthor = await page.getElement('input[type=text]');
    await newAuthor.sendKeys('Test Author');

    const newComment = await page.getElement('textarea');
    await newComment.sendKeys('Test Comment');

    const newSubmitComment = await page.getElement('button[type=submit]');
    await newSubmitComment.click();

    await browser.sleep(10000);
  })

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
