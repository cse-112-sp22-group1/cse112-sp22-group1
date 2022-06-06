/* eslint-disable */
import {adderDropdown, creationMenu } from "./index.js";
import { currentState } from "./state/stateManager.js";

export let creationDropdownContents = {
    "index": [
        {
            title: "New Future Log",
            listener: () => {
                creationMenu.setKind("futureLog");
                creationMenu.show();
            }
        },
		{
            title: "New Collection",
            listener: () => {
                creationMenu.setKind("collection");
                creationMenu.show();
            }
        }
    ],

    "futureLog": [
        {
            title: "New Monthly Log",
            listener: () => {
                creationMenu.setKind("monthlyLog");
                creationMenu.show();
            }
        },
        {
            title: "New Collection",
            listener: () => {
                creationMenu.setKind("collection");
                creationMenu.show();
            }
        },
        {
            title: "New Tracker",
            listener: () => {
                creationMenu.setKind("tracker");
                creationMenu.show();
            }
        }
    ],

    "monthlyLog": [
        {
            title: "New Daily Log",
            listener: () => {
                creationMenu.setKind("dailyLog");
                creationMenu.show();
            }
        },
        {
            title: "New Tracker",
            listener: () => {
                creationMenu.setKind("tracker");
                creationMenu.show();
            }
        }
    ], 
	"textEditor": [
		{
			title: "New Block",
			listener: () => {

			}
		}, 
		{
			title: "New Image",
			listener: () => {
				
			}
		}
	]
};


export let utilDropdownContents = {
    "index": [
        {
            title: "Delete",
            listener: () => {
            }
        }
    ],
    "futureLog": [
    ],
    "monthlyLog": [
    ],
    "dailyLog": [
    ]
}

export function openCreationDropdown(x, y) {
    if (creationDropdownContents[currentState.objectType] === undefined) {
        return;
    }

    adderDropdown.setPosition(x, y);

    adderDropdown.fillDropdown(creationDropdownContents[currentState.objectType]);
}

export function openUtilDropdown(x, y) {
    if (utilDropdownContents[currentState.objectType] === undefined) {
        return;
    }

    adderDropdown.setPosition(x, y);

    adderDropdown.fillDropdown(utilDropdownContents[currentState.objectType]);
}
