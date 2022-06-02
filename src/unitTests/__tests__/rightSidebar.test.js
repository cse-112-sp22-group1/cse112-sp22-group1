import {RightSidebar} from '../../front-end/components/rightSidebar.jsx'
import {SideCard} from '../../front-end/components/sideCard.jsx'

describe('Testing functionality of right sidebar', () => {
    let tracker1 = {
        id: "test",
        objectType: "tracker",
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        content: ["Lorem ipsum dolor sit amet", "consectetur adipiscing elit", "sed do eiusmod tempor"],
        parent: "testparrent"
    }
    test('test adding null tracker', () =>{
        let sidebar = new RightSidebar();
        sidebar.addCard(null,null);
        let card = new SideCard(null,null);
        card.id = "sideCard";
        expect(sidebar.shadowRoot.getElementById('sideCard')).toEqual(card);
    });

    test('test adding title to card', () =>{
        let sidebar = new RightSidebar();
        sidebar.addCard("test1",null);
        expect(sidebar.shadowRoot.getElementById('sideCard').shadowRoot.getElementById('title').innerText).toEqual("test1");
    });
    test('test adding tracker to card', () =>{
        let sidebar = new RightSidebar();
        sidebar.addCard("test1",tracker1);
        expect(sidebar.shadowRoot.getElementById('sideCard').shadowRoot.getElementById('trackerTitle').innerText).toEqual(tracker1.title);
    });
    test('test delete button functionality', () =>{
        let sidebar = new RightSidebar();
        sidebar.addCard("test1",tracker1);
        sidebar.addCard("test2",tracker1);
        let card = sidebar.shadowRoot.getElementById('sideCard');
        card.shadowRoot.getElementById('deleteButton').click();
        expect(sidebar.shadowRoot.getElementById('sideCard').shadowRoot.getElementById('title').innerText).toEqual("test2");
    });
});