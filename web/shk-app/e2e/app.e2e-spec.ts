import { ShkAppPage } from './app.po';

describe('shk-app App', () => {
  let page: ShkAppPage;

  beforeEach(() => {
    page = new ShkAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
