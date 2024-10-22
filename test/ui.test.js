const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('UI Testing using Selenium', function() {
    this.timeout(30000); // Set timeout for Mocha tests
    let driver;

    // Inisialisasi WebDriver sebelum menjalankan test case
    before(async function() {
        driver = await new Builder().forBrowser('chrome').build(); // Bisa diganti 'firefox' untuk Firefox
    });

    // Tutup WebDriver setelah semua test selesai
    after(async function() {
        await driver.quit();
    });

    it('should load the login page', async function() {
        await driver.get('file://path/to/your/login.html'); // Ubah path sesuai lokasi file login.html
        const title = await driver.getTitle();
        expect(title).to.equal('Login Page');
    });

    it('should validate that login button and input fields are visible', async function() {
        // Memeriksa apakah tombol login terlihat
        const isLoginButtonDisplayed = await driver.findElement(By.id('loginButton')).isDisplayed();
        expect(isLoginButtonDisplayed).to.be.true;

        // Memeriksa apakah field username terlihat
        const isUsernameDisplayed = await driver.findElement(By.id('username')).isDisplayed();
        expect(isUsernameDisplayed).to.be.true;

        // Memeriksa apakah field password terlihat
        const isPasswordDisplayed = await driver.findElement(By.id('password')).isDisplayed();
        expect(isPasswordDisplayed).to.be.true;
    });

    it('should input username and password using CSS Selector and XPath', async function() {
        // Menggunakan CSS Selector untuk menemukan elemen username
        await driver.findElement(By.css('#username')).sendKeys('testuser');
        
        // Menggunakan XPath untuk menemukan elemen password
        await driver.findElement(By.xpath('//*[@id="password"]')).sendKeys('password123');

        const usernameValue = await driver.findElement(By.css('#username')).getAttribute('value');
        const passwordValue = await driver.findElement(By.xpath('//*[@id="password"]')).getAttribute('value');

        expect(usernameValue).to.equal('testuser');
        expect(passwordValue).to.equal('password123');
    });

    it('should click the login button', async function() {
        await driver.findElement(By.id('loginButton')).click();
        // Lakukan tindakan lebih lanjut, seperti validasi login
    });

    it('should display an error message for incorrect login', async function() {
        // Mengisi dengan username dan password yang salah
        await driver.findElement(By.css('#username')).clear();
        await driver.findElement(By.xpath('//*[@id="password"]')).clear();

        await driver.findElement(By.css('#username')).sendKeys('wronguser');
        await driver.findElement(By.xpath('//*[@id="password"]')).sendKeys('wrongpassword');
        
        // Klik tombol login
        await driver.findElement(By.id('loginButton')).click();
        
        // Tunggu pesan error muncul
        await driver.wait(until.elementLocated(By.id('errorMessage')), 5000);

        // Verifikasi pesan error
        const errorMessage = await driver.findElement(By.id('errorMessage')).getText();
        expect(errorMessage).to.equal('Invalid username or password');
    });
});
