//import '@babel/polyfill'
require('regenerator-runtime/runtime');

const {
    Builder, By, Key, until,
} = require('selenium-webdriver');
  
// this example will run the test on Firefox
// install and import chromedriver for Chrome
//require('geckodriver');
require('chromedriver');
  
// declare the -web- driver
let driver;
  
beforeAll(async () => {
    // initialize the driver before running the tests
    // driver = await new Builder().forBrowser('firefox').build();
    driver = await new Builder().forBrowser('chrome').build();
});
  
afterAll(async () => {
    // close the driver after running the tests
    await driver.quit();
});
  
// use the driver to mock user's actions
/* async function mockUserAction() {
    // open the URL
    driver.wait(until.urlIs('http://localhost:8000/index.html'));
    await driver.get('http://localhost:8000/index.html');
    // locate the textbox, provide a timeout
    const textbox = await driver.wait(until.elementLocated(By.id('city')), 20000);
    // enter text in the textbox
    await textbox.sendKeys('Philadelphia', Key.RETURN);
    // click on 'get weather' button
    await driver.findElement(By.id('okButton')).click();
    // return the element contining the value to test
    return driver.wait(until.elementLocated(By.id('dat')), 20000);
}
*/

it('unsuccessful login with existing user', async () => {
    // call the mock function
    //const element = await mockUserAction();
    driver.wait(until.urlIs('http://localhost:3000/login'));
    await driver.get('http://localhost:3000/login');
    // locate the textbox, provide a timeout
    const textbox1 = await driver.wait(until.elementLocated(By.id('email')), 20000);
    // enter text in the textbox
    await textbox1.sendKeys('dlee@gmail.com', Key.RETURN);
    // locate the textbox, provide a timeout
    const textbox2 = await driver.wait(until.elementLocated(By.id('password')), 20000);
    // enter text in the textbox
    await textbox2.sendKeys('wrongpassword', Key.RETURN);
    // click on 'get weather' button
    await driver.findElement(By.id('loginButton')).click();
    // return the element contining the value to test
    const element = driver.wait(until.elementLocated(By.id('title')), 20000);
    // retrieve the content of the element
    //const returnedText = await element.getText();
    // test the values
    expect(element).not.toBeNull();
});

it('unsuccessful login with non-existing user', async () => {
    // call the mock function
    //const element = await mockUserAction();
    driver.wait(until.urlIs('http://localhost:3000/login'));
    await driver.get('http://localhost:3000/login');
    // locate the textbox, provide a timeout
    const textbox1 = await driver.wait(until.elementLocated(By.id('email')), 20000);
    // enter text in the textbox
    await textbox1.sendKeys('asdfasdf@gmail.com', Key.RETURN);
    // locate the textbox, provide a timeout
    const textbox2 = await driver.wait(until.elementLocated(By.id('password')), 20000);
    // enter text in the textbox
    await textbox2.sendKeys('wrongpassword', Key.RETURN);
    // click on 'get weather' button
    await driver.findElement(By.id('loginButton')).click();
    // return the element contining the value to test
    const element = driver.wait(until.elementLocated(By.id('title')), 20000);
    // retrieve the content of the element
    //const returnedText = await element.getText();
    // test the values
    expect(element).not.toBeNull();
});

it('successful login check', async () => {
    // call the mock function
    //const element = await mockUserAction();
    driver.wait(until.urlIs('http://localhost:3000/login'));
    await driver.get('http://localhost:3000/login');
    // locate the textbox, provide a timeout
    const textbox1 = await driver.wait(until.elementLocated(By.id('email')), 20000);
    // enter text in the textbox
    await textbox1.sendKeys('dlee@gmail.com', Key.RETURN);
    // locate the textbox, provide a timeout
    const textbox2 = await driver.wait(until.elementLocated(By.id('password')), 20000);
    // enter text in the textbox
    await textbox2.sendKeys('Daniel15', Key.RETURN);
    // click on 'get weather' button
    await driver.findElement(By.id('loginButton')).click();
    // return the element contining the value to test
    const element = driver.wait(until.elementLocated(By.id('displayName')), 20000);
    // retrieve the content of the element
    //const returnedText = await element.getText();
    // test the values
    expect(element).not.toBeNull();
});

