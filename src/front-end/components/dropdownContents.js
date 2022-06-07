/* eslint-disable */
import {adderDropdown, creationMenu} from "../index.js";

export let creationDropdownContents = {
    "index": [
        {
            title: "New Future Log",
            icon: "../public/resources/futureLog.png",
            listener: () => {
                creationMenu.setKind("futureLog");
                creationMenu.show();
            }
        }, {
            title: "New Collection",
            icon: "../public/resources/todaysLog.png",
            listener: () => {
                creationMenu.setKind("collection");
                creationMenu.show();
            }
        }
    ],

    "futureLog": [
        {
            title: "New Monthly Log",
            icon: "../public/resources/monthlyLog.png",
            listener: () => {
                creationMenu.setKind("monthlyLog");
                creationMenu.show();
            }
        }, {
            title: "New Goal",
            icon:"../public/resources/task_icon.png",
            listener: () => {
                creationMenu.setKind("tracker");
                creationMenu.show();
            }
        }
    ],

    "monthlyLog": [
        {
            title: "New Daily Log",
            icon: "../public/resources/todaysLog.png",
            listener: () => {
                creationMenu.setKind("dailyLog");
                creationMenu.show();
            }
        }, {
            title: "New Goal",
            icon: "../public/resources/tracker_icon.png",
            listener: () => {
                creationMenu.setKind("tracker");
                creationMenu.show();
            }
        }
    ],

    "dailyLog": [
        {
            title: "New Collection",
            icon: "../public/resources/todaysLog.png",
            listener: () => {
                creationMenu.setKind("dailyLog");
                creationMenu.show();
            }
        }, {
            title: "New Goal",
            icon: "../public/resources/tracker_icon.png",
            listener: () => {
                creationMenu.setKind("tracker");
                creationMenu.show();
            }
        }
    ],
    "collection": [
        {
            title: "New Collection",
            icon: "../public/resources/todaysLog.png",
            listener: () => {
                creationMenu.setKind("dailyLog");
                creationMenu.show();
            }
        }, {
            title: "New Goal",
            icon: "../public/resources/tracker_icon.png",
            listener: () => {
                creationMenu.setKind("tracker");
                creationMenu.show();
            }
        }
    ]

};

export let editDropdownContents = {
    "index": [
        {
            title: "Delete",
            icon: "../public/resources/delete_icon.png",
            listener: () => {
            
            }
        }, {
            title: "More",
            icon: "../public/resources/more_icon.png",
            listener: () => {
                
            }
        }
    ],

    "futureLog": [
        {
            title: "Delete",
            icon: "../public/resources/delete_icon.png",
            listener: () => {
            
            }
        }, {
            title: "More",
            icon: "../public/resources/more_icon.png",
            listener: () => {
                
            }
        }
    ],

    "monthlyLog": [
        {
            title: "Delete",
            icon: "../public/resources/delete_icon.png",
            listener: () => {
            
            }
        }, {
            title: "More",
            icon: "../public/resources/more_icon.png",
            listener: () => {
                
            }
        }
    ],
    "dailyLog": [
        {
            title: "Delete",
            icon: "../public/resources/delete_icon.png",
            listener: () => {
            
            }
        }, {
            title: "More",
            icon: "../public/resources/more_icon.png",
            listener: () => {
                
            }
        }
    ],
    "collection": [
        {
            title: "Delete",
            icon: "../public/resources/delete_icon.png",
            listener: () => {
            
            }
        }, {
            title: "More",
            icon: "../public/resources/more_icon.png",
            listener: () => {
                
            }
        }
    ]
}

export let otherDropdownContents = {
    "util": [
        {
            title: "Delete",
            icon: "../public/resources/delete_icon.png",
            listener: () => {
            }
        },{
            title: "Duplicate",
            icon: "../public/resources/copy_icon.png",
            listener: ()=>{

            }
        }, {
            title:"Turn into",
            icon: "../public/resources/turn_into_icon.png",
            listener: ()=>{
                adderDropdown.openSecondDropdown();
            }
        }
    ],
    "text": [
        {
            title: "Heading 1",
            icon: "../public/resources/h1_icon.png",
            listener: ()=>{

            }
        },{
            title: "Heading 2",
            icon: "../public/resources/h2_icon.png",
            listener: ()=>{

            }
        },{
            title: "Heading 3",
            icon: "../public/resources/h3_icon.png",
            listener: ()=>{

            }
        },{
            title: "Note",
            icon: "../public/resources/note_icon.png",
            listener: ()=>{

            }
        },{
            title: "Event",
            icon: "../public/resources/event_icon.png",
            listener: ()=>{

            }
        },{
            title: "Task",
            icon: "../public/resources/task_icon.png",
            listener: ()=>{

            }
        },{
            title: "Paragraph",
            icon: "../public/resources/paragraph_icon.png",
            listener: ()=>{

            }
        }
    ],
    "transform": [
        {
            title: "Heading 1",
            icon: "../public/resources/h1_icon.png",
            listener: ()=>{

            }
        },{
            title: "Heading 2",
            icon: "../public/resources/h2_icon.png",
            listener: ()=>{

            }
        },{
            title: "Heading 3",
            icon: "../public/resources/h3_icon.png",
            listener: ()=>{

            }
        },{
            title: "Note",
            icon: "../public/resources/note_icon.png",
            listener: ()=>{

            }
        },{
            title: "Event",
            icon: "../public/resources/event_icon.png",
            listener: ()=>{

            }
        },{
            title: "Task",
            icon: "../public/resources/task_icon.png",
            listener: ()=>{

            }
        },{
            title: "Paragraph",
            icon: "../public/resources/paragraph_icon.png",
            listener: ()=>{

            }
        }
    ]
}

/* eslint-enable */
