import { IndexDropdown } from "../components/indexDropdown.jsx";

describe('Testing functionality of the Index Dropdown', () => {
    let futureLogIndexDropdown;
    let collectionIndexDropdown;

    // Timeframe text won't show on IndexDropdowns with collection as param (null dates)
    let collection = {
        id: "123",
        title: "Notes",
        objectType: "FutureLog",
        startDate: null,
        endDate: null,
        months: [
            {
                id: "1234",
                monthlyLog: "February 2022"
            },
            {
                id: "5677",
                monthlyLog: "March 2022"
            }	
        ]
    };

    let futureLog = {
        id: "123",
        title: "Spring Quarter",
        objectType: "FutureLog",
        startDate: new Date("2022/02/01"),
        endDate: new Date(),
        months: [
            {
                id: "1234",
                monthlyLog: "February 2022"
            },
            {
                id: "5677",
                monthlyLog: "March 2022"
            }	
        ]
    }; 

    beforeAll(() => {
        collectionIndexDropdown = new IndexDropdown(collection);
        futureLogIndexDropdown = new IndexDropdown(futureLog);
    });

    test('Component properly sets Future Log info', () => {
        expect(futureLogIndexDropdown.timeframe.innerText).toEqual("February 1st 2022 → June 4th 2022");
        expect(futureLogIndexDropdown.header.innerText).toEqual("Spring Quarter");
    });

    test('Component properly sets Collection info', () => {
        expect(collectionIndexDropdown.timeframe.innerText).toEqual(undefined);
        expect(collectionIndexDropdown.header.innerText).toEqual("Notes");
    });

    test('ToggleItems properly shows and hides the dropdown items', () => {
        futureLogIndexDropdown.toggleItems();
        expect(futureLogIndexDropdown.wrapper.classList.contains("open")).toEqual(true);
        futureLogIndexDropdown.toggleItems();
        expect(futureLogIndexDropdown.wrapper.classList.contains("open")).toEqual(false);
    });
});