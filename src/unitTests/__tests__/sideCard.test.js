import {SideCard} from '../../front-end/components/sideCard.jsx'

describe('Testing functionality of side card', () => {
    let card;
    let tracker1 = {
        id: "test",
        objectType: "tracker",
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        content: ["Lorem ipsum dolor sit amet", "consectetur adipiscing elit", "sed do eiusmod tempor"],
        parent: "testparrent"
    }
    beforeAll(() =>{
        card = new SideCard(null,null);
    });
    test('check card title is properly set', () =>{
        card.setTitle("Test Title 1");
        expect(card.shadowRoot.getElementById('title').innerText).toEqual("Test Title 1");
    });
    test('check card tracker is properly set', () =>{
        card.addTracker(tracker1);
        expect(card.tracker).toEqual(tracker1);
    });
    test('check card tracker title is properly displayed', () =>{
        expect(card.shadowRoot.getElementById('trackerTitle').innerText).toEqual(tracker1.title);
    });
    test('check card tracker content 0 is properly displayed', () =>{
        expect(card.shadowRoot.getElementById("trackerText0").innerText).toEqual(tracker1.content[0]);
    });
    test('check card tracker content 1 is properly displayed', () =>{
        expect(card.shadowRoot.getElementById("trackerText1").innerText).toEqual(tracker1.content[1]);
    });
    test('check card tracker content 2 is properly displayed', () =>{
        expect(card.shadowRoot.getElementById("trackerText2").innerText).toEqual(tracker1.content[2]);
    });
})