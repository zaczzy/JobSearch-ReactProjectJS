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
} */

it('register invalid user', async () => {
    // call the mock function
    //const element = await mockUserAction();
    driver.wait(until.urlIs('http://localhost:3000/register'));
    await driver.get('http://localhost:3000/register');
    // locate the textbox, provide a timeout
    const textbox1 = await driver.wait(until.elementLocated(By.id('email')), 20000);
    // enter text in the textbox
    await textbox1.sendKeys('test1@gmail.com', Key.RETURN);
    // locate the textbox, provide a timeout
    const textbox2 = await driver.wait(until.elementLocated(By.id('displayName')), 20000);
    // enter text in the textbox
    await textbox2.sendKeys('test_1', Key.RETURN);
    // locate the textbox, provide a timeout
    const textbox3 = await driver.wait(until.elementLocated(By.id('handle')), 20000);
    // enter text in the textbox
    await textbox3.sendKeys('test1', Key.RETURN);
    // locate the textbox, provide a timeout
    const textbox4 = await driver.wait(until.elementLocated(By.id('password')), 20000);
    // enter text in the textbox
    await textbox4.sendKeys('notvalidpass', Key.RETURN);
    // click on 'get weather' button
    await driver.findElement(By.id('regButton')).click();
    // return the element contining the value to test
    const element = driver.wait(until.elementLocated(By.id('regTitle')), 20000);
    // retrieve the content of the element
    //const returnedText = await element.getText();
    // test the values
    expect(element).not.toBeNull();
});

  
it('register valid user', async () => {
    // call the mock function
    //const element = await mockUserAction();
    driver.wait(until.urlIs('http://localhost:3000/register'));
    await driver.get('http://localhost:3000/register');
    // locate the textbox, provide a timeout
    const textbox1 = await driver.wait(until.elementLocated(By.id('email')), 20000);
    // enter text in the textbox
    await textbox1.sendKeys('test1@gmail.com', Key.RETURN);
    // locate the textbox, provide a timeout
    const textbox2 = await driver.wait(until.elementLocated(By.id('displayName')), 20000);
    // enter text in the textbox
    await textbox2.sendKeys('test_1', Key.RETURN);
    // locate the textbox, provide a timeout
    const textbox3 = await driver.wait(until.elementLocated(By.id('handle')), 20000);
    // enter text in the textbox
    await textbox3.sendKeys('test1', Key.RETURN);
    // locate the textbox, provide a timeout
    const textbox4 = await driver.wait(until.elementLocated(By.id('password')), 20000);
    // enter text in the textbox
    await textbox4.sendKeys('Password1', Key.RETURN);
    // click on 'get weather' button
    await driver.findElement(By.id('regButton')).click();
    // return the element contining the value to test
    const element = driver.wait(until.elementLocated(By.id('title')), 20000);
    // retrieve the content of the element
    //const returnedText = await element.getText();
    // test the values
    expect(element).not.toBeNull();
});

