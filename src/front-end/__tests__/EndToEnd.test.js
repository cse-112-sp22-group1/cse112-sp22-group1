// Puppeteer
​
​/* eslint-disable */

describe('Basic user flow for SPA ', () => {
    jest.setTimeout(35000);
    beforeAll(async () => {
        await page.goto('http://localhost:8080/login');
        await page.waitForTimeout(1000);
    });
    // Test 1
    it('Test1: Initial Home Page - Check Home Page', async () => {
      // Remember to change this after deploy
      expect(page.url()).toBe("http://localhost:8080/login");
      
    });
    
    // Test 2A
    it('Create New User Fails with Empty Email and Empty Password', async () => {
        // check that alert shows & url
        await page.click('input#input-email');
        await page.click('button#btn-create');
        expect(page.url()).toBe("http://localhost:8080/login");
    });
​
    // Test 2B
    it('Create New User Fails with Empty Password', async () => {
        // check that alert shows & url 
        await page.click('input#input-email');
        await page.type('input#input-email','test10');
        await page.click('input#input-password');
        await page.click('button#btn-create');
        expect(page.url()).toBe("http://localhost:8080/login");
    });
​
    // Test 2C
    it('Create New User Fails with Empty Email', async () => {
        // check that alert shows & url
        await page.click('input#input-email',{clickCount: 3});
        await page.keyboard.press('Backspace');
        await page.type('input#input-password', '123ABC');
        await page.click('button#btn-create');
        expect(page.url()).toBe("http://localhost:8080/login");
    });
​
    // Test 3
    it('Log in fail', async () => {
        // fill in fields, click login, check link
        //await page.waitForSelector('email-field');
        await page.click('input#input-email', {clickCount:3});
        await page.keyboard.press('Backspace');
        await page.type('input#input-email','test10');
        await page.click('input#input-password',{clickCount:3});
        await page.keyboard.press('Backspace');
        await page.type('input#input-password','fail');
        await page.click("button#btn-login");
        // --> add expect error message
        await page.waitForTimeout(3000);
        expect(page.url()).toBe("http://localhost:8080/login");
        });
​
    // Test 3B  
    it('Create New User with existing fail', async () => {
        // check that alert shows & url
        await page.click('button#btn-create');
        await page.click('input#input-email', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('input#input-email', 'test16');
        await page.click('input#input-password', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('input#input-password','qwer3');
        await page.click('button#btn-create');
        await page.waitForTimeout(3000);
        expect(page.url()).toBe("http://localhost:8080/login");
    });
​
    // Test 3C
    it('Log in', async () => {
        // check that alert shows & url
        // fill in fields, click login, check link
        await page.click('input#input-email', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('input#input-email', 'test13');
        await page.click('input#input-password', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('input#input-password', 'qwer3');
        await page.click("button#btn-login");
        await page.waitForTimeout(3000);
        expect(page.url()).toBe("http://localhost:8080/");
    });
    // Test 4 log out from my account
    it('Log out', async () => {
        // fill in fields, click login, check link
        const userbutton = await page.evaluateHandle(`document.querySelector("#sidebar > nav-bar").shadowRoot.querySelector("#user")`); 
        await userbutton.evaluate(e => e.click());
        const logoutbutton = await page.evaluateHandle(`document.querySelector("#settings-panel-generated-0 > general-settings-panel").shadowRoot.querySelector("#logout")`);
        await logoutbutton.evaluate(e => e.click());
        await page.waitForTimeout(3000);
        expect(page.url()).toBe("http://localhost:8080/login");
    }, 10000);
    
    // Test 5
    it('log in', async () => {
        // fill in fields, click login, check link
        await page.click('input#input-email', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('input#input-email', 'test13');
        await page.click('input#input-password', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('input#input-password', 'qwer3');
        await page.click("button#btn-login");
        await page.waitForTimeout(3000);
        expect(page.url()).toBe("http://localhost:8080/");
    }, 10000);
​
    //Test 5 
    it('testing opening the settings menu by clicking the user button', async () => {
        const userButton = await page.evaluateHandle(`document.querySelector("#sidebar > nav-bar").shadowRoot.querySelector("#user")`);
        await userButton.evaluate(e => e.click());
​
        //press user button
        const settingsMenu = await page.$('settings-menu');
​
        const settingsMenuHidden = await settingsMenu.evaluate(e => e.getAttribute('aria-hidden'));
        expect(settingsMenuHidden).toBe("false");
    }, 10000);
​
    //currenty fails due to themes not complete
    it('testing changing themes', async () => {
        //pressing  theme tab 
        const themeTab = await page.evaluateHandle(`document.querySelector("#settings-tab-generated-1")`);
        await themeTab.evaluate(e => e.click());
​
        //checking background color
        const darkThemeButton = await page.evaluateHandle(`document.querySelector("#settings-panel-generated-1 > theme-panel").shadowRoot.querySelector("#theme > label:nth-child(1)")`);
        const lightThemeButton = await page.evaluateHandle(`document.querySelector("#settings-panel-generated-1 > theme-panel").shadowRoot.querySelector("#theme > label:nth-child(2)")`);
​
        // start on dark theme
        await darkThemeButton.evaluate(e => e.click());
        //check the background color
        const firstBackgroundColor = await page.$eval(":root", root => getComputedStyle(root).backgroundColor);
        console.log(firstBackgroundColor);
​
        // switch to light theme
        await lightThemeButton.evaluate(e => e.click());
        const lightBackgroundColor = await page.$eval(":root", root => getComputedStyle(root).backgroundColor);
        console.log("first " + firstBackgroundColor);
        console.log("light " + lightBackgroundColor);
        let pass = true;
        if(lightBackgroundColor === firstBackgroundColor){
            pass = false;
        }
        // go back to dark theme
        await darkThemeButton.evaluate(e => e.click());
        const secondDarkBackgroundColor = await page.$eval(":root", root => getComputedStyle(root).backgroundColor);
        console.log(secondDarkBackgroundColor, secondDarkBackgroundColor == firstBackgroundColor);
        if(secondDarkBackgroundColor !== firstBackgroundColor){
            pass = false;
        }
        expect(pass).toBe(true);
    }, 10000);
    
    it('test closing the settings menu', async() => {
        const userButton = await page.evaluateHandle(`document.querySelector("#sidebar > nav-bar").shadowRoot.querySelector("#user")`);
        await userButton.evaluate(e => e.click());
​
        //press user button
        const settingsMenu = await page.$('settings-menu');
​
        const settingsMenuHidden = await settingsMenu.evaluate(e => e.getAttribute('aria-hidden'));
        expect(settingsMenuHidden).toBe("true");
    }, 10000);    
​
    it('test new button triggers dropdown', async() =>{
        const newButton = await page.evaluateHandle(`document.querySelector("#topbar > page-header").shadowRoot.querySelector("button.new-button")`);
        await newButton.evaluate(e => e.click());
        const dropdown = await page.evaluateHandle(`document.querySelector("#adderDropdown > inline-dropdown").shadowRoot.querySelector("#myDropdown")`);
        const classes = await dropdown.evaluate(e => e.classList);
        expect(classes[1]).toBe("show");
    }, 10000);
​
    it('test new future log in dropdown', async() =>{
        const futurelogButton = await page.evaluateHandle(`document.querySelector("#adderDropdown > inline-dropdown").shadowRoot.querySelector("li")`);
        await futurelogButton.evaluate(e => e.click());
        const creationMenu = await page.evaluateHandle(`document.querySelector("#creationMenu > creation-menu").shadowRoot.querySelector("#popup")`);
        const style = await creationMenu.evaluate(e => e.style.display);
        expect(style).toBe("block");
    }, 10000);
    /**
     * Wanted to test making futurelog with no input but theres an issue with handling dialog popup
    it('test creating future log with no input', async() =>{
        await page.on("dialog", (dialog) => {
            console.log("Dialog is up...");
                delay(1000);
            console.log("Accepted...");
            dialog.accept();
                delay(1000);
        });
        
        const futureFrom = await page.evaluateHandle(`document.querySelector("#creationMenu > creation-menu").shadowRoot.querySelector("#futureFrom")`);
        await futureFrom.evaluate(e => e.innerText ="Wed Jun 01 2022");
        const createButton= await page.evaluateHandle(`document.querySelector("#creationMenu > creation-menu").shadowRoot.querySelector("#createButton")`);
        await page.evaluate(`window.confirm = () => true`)
        await createButton.evaluate(e => e.click());
        await page.waitForTimeout(3000);
        const creationMenu = await page.evaluateHandle(`document.querySelector("#creationMenu > creation-menu").shadowRoot.querySelector("#popup")`);
        const style = await creationMenu.evaluate(e => e.style.display);
        expect(style).toBe("block");
    }, 10000);
    */
​
});
​/* eslint-enable */
