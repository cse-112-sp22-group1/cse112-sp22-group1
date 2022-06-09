import { adderDropdown } from "../index.js";

/**
 *
 * @param {TextBlock} blockReference
 */
export let bindDropdown = (blockReference) => {
	let textBlock = blockReference.shadowRoot.getElementById("textBlock");
	if (blockReference.tracker) {
		blockReference.dropdownContents = {
			"text": [
				{
					title: "Note",
					icon: "../public/resources/note_icon.png",
					listener: ()=>{
						blockReference.setupNote();
						adderDropdown.hide();
					}
				}, {
					title: "Event",
					icon: "../public/resources/event_icon.png",
					listener: ()=>{
						blockReference.setupEvent();
						adderDropdown.hide();
					}
				}, {
					title: "Task",
					icon: "../public/resources/task_icon.png",
					listener: ()=>{
						blockReference.setupTask();
						adderDropdown.hide();
					}
				}, {
					title: "Paragraph",
					icon: "../public/resources/paragraph_icon.png",
					listener: ()=>{
						adderDropdown.hide();
					}
				}
			],
			"transform": [
				{
					title: "Note",
					icon: "../public/resources/note_icon.png",
					listener: ()=>{
						let content = textBlock.innerText;
						blockReference.setupNote();
						textBlock.innerText = content;
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}, {
					title: "Event",
					icon: "../public/resources/event_icon.png",
					listener: ()=>{
						let content = textBlock.innerText;
						blockReference.setupEvent();
						textBlock.innerText = content;
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}, {
					title: "Task",
					icon: "../public/resources/task_icon.png",
					listener: ()=>{
						let content = textBlock.innerText;
						blockReference.setupTask();
						textBlock.innerText = content;
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}, {
					title: "Paragraph",
					icon: "../public/resources/paragraph_icon.png",
					listener: ()=>{
						let content = textBlock.innerText;
						blockReference.removeStyles();
						textBlock.innerText = content;
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}
			],
			"util": [
				{
					title: "Delete",
					icon: "../public/resources/delete_icon.png",
					listener: () => {
						if (blockReference.controller.blockArray.length > 1) {
							blockReference.controller.removeBlock();
						} else {
							blockReference.removeStyles();
						}
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}, {
					title: "Duplicate",
					icon: "../public/resources/copy_icon.png",
					/* eslint-disable */
					listener: ()=>{}
					/* eslint-enable */
				}, {
					title: "Turn into",
					icon: "../public/resources/turn_into_icon.png",
					listener: ()=>{
						adderDropdown.openSecondDropdown(blockReference.dropdownContents.transform);
					}
				}
			]
		}
	} else {
		blockReference.dropdownContents = {
			"text": [
				{
					title: "Heading 1",
					icon: "../public/resources/h1_icon.png",
					listener: ()=>{
						blockReference.setupHeader1();
						adderDropdown.hide();
					}
				}, {
					title: "Heading 2",
					icon: "../public/resources/h2_icon.png",
					listener: ()=>{
						blockReference.setupHeader2();
						adderDropdown.hide();
					}
				}, {
					title: "Heading 3",
					icon: "../public/resources/h3_icon.png",
					listener: ()=>{
						blockReference.setupHeader3();
						adderDropdown.hide();
					}
				}, {
					title: "Note",
					icon: "../public/resources/note_icon.png",
					listener: ()=>{
						blockReference.setupNote();
						adderDropdown.hide();
					}
				}, {
					title: "Event",
					icon: "../public/resources/event_icon.png",
					listener: ()=>{
						blockReference.setupEvent();
						adderDropdown.hide();
					}
				}, {
					title: "Task",
					icon: "../public/resources/task_icon.png",
					listener: ()=>{
						blockReference.setupTask();
						adderDropdown.hide();
					}
				}, {
					title: "Paragraph",
					icon: "../public/resources/paragraph_icon.png",
					listener: ()=>{
						adderDropdown.hide();
					}
				}
			],
			"transform": [
				{
					title: "Heading 1",
					icon: "../public/resources/h1_icon.png",
					listener: ()=>{
						let content = textBlock.innerText;
						blockReference.setupHeader1();
						textBlock.innerText = content;
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}, {
					title: "Heading 2",
					icon: "../public/resources/h2_icon.png",
					listener: ()=>{
						let content = textBlock.innerText;
						blockReference.setupHeader2();
						textBlock.innerText = content;
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}, {
					title: "Heading 3",
					icon: "../public/resources/h3_icon.png",
					listener: ()=>{
						let content = textBlock.innerText;
						blockReference.setupHeader3();
						textBlock.innerText = content;
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}, {
					title: "Note",
					icon: "../public/resources/note_icon.png",
					listener: ()=>{
						let content = textBlock.innerText;
						blockReference.setupNote();
						textBlock.innerText = content;
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}, {
					title: "Event",
					icon: "../public/resources/event_icon.png",
					listener: ()=>{
						let content = textBlock.innerText;
						blockReference.setupEvent();
						textBlock.innerText = content;
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}, {
					title: "Task",
					icon: "../public/resources/task_icon.png",
					listener: ()=>{
						let content = textBlock.innerText;
						blockReference.setupTask();
						textBlock.innerText = content;
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}, {
					title: "Paragraph",
					icon: "../public/resources/paragraph_icon.png",
					listener: ()=>{
						let content = textBlock.innerText;
						blockReference.removeStyles();
						textBlock.innerText = content;
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}
			],
			"util": [
				{
					title: "Delete",
					icon: "../public/resources/delete_icon.png",
					listener: () => {
						if (blockReference.controller.blockArray.length > 1) {
							blockReference.controller.removeBlock();
						} else {
							blockReference.removeStyles();
						}
						adderDropdown.hide();
						adderDropdown.hideSecondDropdown();
					}
				}, {
					title: "Duplicate",
					icon: "../public/resources/copy_icon.png",
					/* eslint-disable */
					listener: ()=>{}
					/* eslint-enable */
				}, {
					title: "Turn into",
					icon: "../public/resources/turn_into_icon.png",
					listener: ()=>{
						adderDropdown.openSecondDropdown(blockReference.dropdownContents.transform);
					}
				}
			]
		}
	}

}
