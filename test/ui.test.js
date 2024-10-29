const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

const options = new chrome.Options();
options.addArguments('--headless'); // Run headless
options.addArguments('--disable-gpu');
options.addArguments('--no-sandbox');
options.addArguments('--window-size=1920,1080');
options.addArguments('--disable-extensions');
options.addArguments('--disable-infobars');
options.addArguments('--disable-dev-shm-usage');

describe('UI Testing using Selenium', function () {
    this.timeout(60000); // Set timeout for Mocha tests

    let driver;

    // Initialize WebDriver before running test cases
    before(async function () {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    // Close WebDriver after all tests are done
    after(async function () {
        await driver.quit();
    });

    it('should load the login page', async function () {
        const loginPagePath = 'file:///C:/Users/Lenovo/Documents/Project/PPMPL/praktikum-testing/loginPage.html'; // Full path to your HTML file
        await driver.get(loginPagePath);
        const title = await driver.getTitle();
        expect(title).to.equal('Login Page');
    });

    it('should input username and password using CSS Selectors', async function () {
        await driver.findElement(By.css('#username')).sendKeys('testuser');
        await driver.findElement(By.css('#password')).sendKeys('password123');
        
        const usernameValue = await driver.findElement(By.css('#username')).getAttribute('value');
        const passwordValue = await driver.findElement(By.css('#password')).getAttribute('value');
        expect(usernameValue).to.equal('testuser');
        expect(passwordValue).to.equal('password123');
    });

    it('should click the login button and validate successful login', async function () {
        await driver.findElement(By.css('#loginButton')).click();
        
        // Wait for the dashboard element to be displayed after a successful login
        const dashboardElement = await driver.wait(
            async () => {
                const el = await driver.findElement(By.id('dashboardElement')); // Ensure this ID matches the dashboard's HTML
                return el.isDisplayed() ? el : null;
            },
            10000 // Timeout after 10 seconds
        );

        expect(dashboardElement).to.exist; // Ensure the dashboard element is present
    });

    it('should handle failed login attempts', async function () {
        await driver.get('file:///C:/Users/Lenovo/Documents/Project/PPMPL/praktikum-testing/loginPage.html'); // Reload the login page
        
        await driver.findElement(By.css('#username')).sendKeys('wronguser');
        await driver.findElement(By.css('#password')).sendKeys('wrongpassword');
        await driver.findElement(By.css('#loginButton')).click();
        
        // Wait for the error message to be displayed
        const errorMessageElement = await driver.wait(
            async () => {
                const el = await driver.findElement(By.id('errorMessage'));
                return el.isDisplayed() ? el : null;
            },
            10000 // Timeout after 10 seconds
        );

        const errorMessage = await errorMessageElement.getText();
        expect(errorMessage).to.equal('Invalid username or password.'); // Adjust expected message as needed
    });
    
    it('should input data using CSS Selector and XPath', async function () {

        await driver.findElement(By.id('username')).clear();
        await driver.findElement(By.id('password')).clear();

        await driver.findElement(By.css('#username')).sendKeys('testuser');

        await driver.findElement(By.xpath('//*[@id="password"]')).sendKeys('password123');

        const usernameValue = await driver.findElement(By.id('username')).getAttribute('value');
        const passwordValue = await driver.findElement(By.id('password')).getAttribute('value');

        expect(usernameValue).to.equal('testuser');
        expect(passwordValue).to.equal('password123');
    });

    it('should validate visibility of login elements', async function () {
        const isLoginButtonDisplayed = await driver.findElement(By.css('#loginButton')).isDisplayed();
        expect(isLoginButtonDisplayed).to.be.true;

        const isUsernameFieldDisplayed = await driver.findElement(By.css('#username')).isDisplayed();
        expect(isUsernameFieldDisplayed).to.be.true;

        const isPasswordFieldDisplayed = await driver.findElement(By.css('#password')).isDisplayed();
        expect(isPasswordFieldDisplayed).to.be.true;
    });
});