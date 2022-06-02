import { HelpMenu } from '../components/help.jsx';

describe('Testing functionality of Help Menu', () => {
    let helpMenu;

    beforeAll(() => {
        helpMenu = new HelpMenu();
    });

    test('Toggle properly opens and closes the menu', () => {
        helpMenu.toggle();
        expect(helpMenu.getAttribute("aria-hidden")).toEqual("false");
        helpMenu.toggle();
        expect(helpMenu.getAttribute("aria-hidden")).toEqual("true");
    });
});