const html = `<template id="block">
<style>
	@font-face {
		font-family:"SF-Pro";
		src: url("./public/fonts/SF-Pro.ttf");
	}
	#textBlock {
		font-family: system-ui;
		border: none;
		overflow: auto;
		outline: none;
		resize: none;
		display: inline-block;
	}

	#textBlock:empty::before{
		content: attr(placeholder);
		color: gray;
	}

	.eventNodateFocused::after{
		content: attr(dateFiller);
		color: gray;
	}

	.unstylized{
		margin: 7px 0 12px;
		font-size: 18px;
		line-height: 28px;
		width: calc(100% - 74px);
	}

	.note{	
		margin: 0;
		margin-left: -62px;
		position: relative;
		font-size: 18px;
		line-height: 28px;
		vertical-align: top;
		width: calc(100% - 95px);
	}

	.task{
		margin: 7px 0 2px;
		font-size: 18px;
		line-height: 28px;
		width: calc(100% - 96px);
	}

	.header1{
		font-size: 42px;
		line-height: 50px;
		font-weight: bold;
		margin: 15px 0 20px;
		width: calc(100% - 74px);
	}

	.header2{
		font-size: 30px;
		line-height: 36px;
		font-weight: bold;
		margin: 8px 0 13px;
		width: calc(100% - 74px);
	}

	.header3{
		font-size: 25px;
		line-height: 30px;
		font-weight: bold;
		margin: 7px 0 10px;
		width: calc(100% - 74px);
	}

	.bold{
		font-weight: 900;
	}

	.italics{
		font-style: italic;
	}

	.underlined{
		text-decoration: underline;
	}

	.crossed{
		text-decoration: line-through;
		text-decoration-thickness: 2px;
	}

	#editorIcons{
		position: relative;
		display: inline;
		vertical-align: top;
	}
	
	#editorIcons img{
		margin-right: 7px;
		height: 15px;
		cursor: pointer;
		filter: var(--icon-filter);
	}

	#editorIcons div{
		display: inline;
		margin-right: 0;
		opacity: 1;
		width: 20px;
		cursor: pointer;
	}

	.unfocusedIcons{
		opacity: 0.3;
		transition: 0.2s;
	}

	.focusedIcons{
		opacity: 0.5;
		transition: 0.2s;
	}

	#editorIcons img:hover{
		opacity: 0.8;
		transition: opacity 0.2s;
	}
	
	.header1Icons{
		top: 35px;
	}

	.header2Icons{
		top: 18px;
	}

	.header3Icons{
		top: 12px;
	}

	.noteIcons{
		position: relative;
		top: 2px;
		left: -87px;
	}

	.paragraphIcons{
		top: 10px;
	}

	#checkerContainer{
		position: relative;
		overflow: hidden;
		user-select: none;
	}

	#taskChecker{
		display: inline-block;
		user-select: none;
		background-color: #fafafa;
		border: 1px solid #cacece;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0 -15px 10px -12px rgba(0,0,0,0.05);
		width: 18px;
		height: 18px;
		margin-top: 11px;
		margin-right: 3px;
		margin-left: -1px;
		vertical-align: top;
		border-radius: 3px;
	}

	#taskChecker:active, #checkerContainer[checked="checked"]:active #taskChecker{
		box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0 1px 3px rgba(0,0,0,0.1);
	}

	#checkerContainer[checked="checked"] #taskChecker{
		background-color: #218be2;
		border: 1px solid #218be2;
		box-shadow: 0 1px 2px rgba(0, 87, 168, 0.05);
		color: #218be2;
	}

	#checkerContainer[checked="checked"]:after {
		position: absolute;
		left: 4px;
		top: -12px;
		content: '\\2714';
		font-size: 13px;
		color: #fff;
	}

	#signifier{
		opacity: 1;
	}

</style>
<div id="editorIcons" class="paragraphIcons"><img src="../public/resources/plusIcon.png" class="unfocusedIcons"/><img src="../public/resources/sixDotIcon.png" class="unfocusedIcons"/><div id="signifier"></div></div>
<div id="checkerContainer" checked=""><div id="taskChecker"></div></div>
<div id="textBlock" contenteditable="true" ondrop="return false;" placeholder='Type "/" to create a block'></div>
</template>
`
const tabSize = 20;
const paddingSize = 10;

const protectedKeys = ["Control", "Alt", "CapsLock", "Escape", "PageUp", "PageDown", "End", "Home", "PrintScreen", "Insert", "Delete", "Backspace", "Tab", "Enter", "Meta", "ArrowTop", "ArrowBottom", "ArrowRight", "ArrowLeft", "Shift"]

export class TextBlock extends HTMLElement{
	constructor(controller, itemObject, callback){
		super();
		/* fetch("./components/block.html").then((response) => {
			return response.text();
		}).then((html) => { */
			let parser = new DOMParser();
			let blockTemplateFile = parser.parseFromString(html, 'text/html');
			let blockTemplate = blockTemplateFile.getElementById("block");
			this.attachShadow({ mode: "open" });
			this.shadowRoot.appendChild(blockTemplate.content.cloneNode(true));
			this.root = this.shadowRoot;
			this.kind = "paragraph";
			this.initialHeight = 3;
			this.item = itemObject;
			this.controller = controller;
			this.shadowRoot.getElementById("textBlock").classList.add("unstylized");
			this.currentBlock = null;
			this.checkBox = this.shadowRoot.getElementById("checkerContainer");
			this.checkBox.style.display = "none";
			this.currentPointerSpot = 0;
			this.editorIcons = this.shadowRoot.getElementById("editorIcons");
			this.currentPointerHeight = 2;
			if (this.controller.creatingFromBullet.isTrue){
				if (this.controller.creatingFromBullet.kind == "note"){
					this.setupNote();
				} else if (this.controller.creatingFromBullet.kind == "event"){
					this.setupEvent();
				} else {
					this.setupTask();
				}
			}
			this.tabLevel = controller.currentTabLevel;
			this.atPressed = false;
			this.hashPressed = false;
			this.timeSetter = false;
			this.dateSetter = false;
			callback(true);
	/* 	}) */
        
	}

    setCurrentSpot(){
        let container = this.shadowRoot.getElementById("textBlock");
        let range = shadow.getRange(this.shadowRoot);
        if (range != undefined){
            let preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(container);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
			this.atPressed = false;
			this.hashPressed = false;
			includesClock(this, container.innerText.slice(0, range.endOffset), false);
            this.currentPointerSpot = (range.getClientRects()[0] != undefined) ? range.getClientRects()[0].x : (this.tabLevel * tabSize) + paddingSize;
            this.currentPointerHeight = (range.getClientRects()[0] != undefined) ? range.getClientRects()[0].y - container.getBoundingClientRect().top : this.initialHeight;
        } else {
            this.currentPointerSpot = (this.tabLevel * tabSize) + paddingSize;
            this.currentPointerHeight = this.initialHeight;
        }
        
    }

    moveToSpot(newSpot, up){
        let container = this.shadowRoot.getElementById("textBlock");
        if (container.childNodes.length > 0){
            if (!this.controller.resetPosition){
                newSpot = this.currentPointerSpot;
            }
            container.focus();
            let range = shadow.getRange(this.shadowRoot);
            container.blur();
            console.log(newSpot);
            console.log(newSpot);
            setTimeout(() => {
                let offset = 0;
                if (up) {
                    offset = container.textContent.length;
                }
                range.setStart(container.childNodes[0], offset);
                let currentCoordinate = range.getClientRects()[0].x;
                let currentOffset = offset;
                let counter = 0;
                newSpot = Math.floor(newSpot);
                while(counter < 1000){
                    if (up){
                        offset = (offset > 0) ? offset - 1 : offset;
                    } else {
                        offset = (offset < container.textContent.length) ? offset + 1 : offset;
                    }
                    range.setStart(container.childNodes[0], offset);
                    range.collapse(true);
                    let nextCoordinate = range.getClientRects()[0].x;
                    if (Math.abs(Math.floor(currentCoordinate) - newSpot) <= Math.abs(Math.floor(nextCoordinate) - newSpot)){
                        range.setStart(container.childNodes[0], currentOffset);
                        break;
                    }
                    currentCoordinate = nextCoordinate;
                    currentOffset = offset;
                    counter += 1;
                }
                range.collapse(true);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                container.focus();
            }, 0.01);
        } else {
            container.focus();
        }
        
    }

    setupHeader1(){
        let textBlock = this.shadowRoot.getElementById("textBlock");
		while(this.editorIcons.classList.length > 0){
            this.editorIcons.classList.remove(this.editorIcons.classList[0]);
        }
        while(textBlock.classList.length > 0){
            textBlock.classList.remove(textBlock.classList[0]);
        }
        while(this.classList.length > 0){
            this.classList.remove(this.classList[0]);
        }
        this.controller.creatingFromBullet = {isTrue: false, kind: ""};
        this.kind = "h1";
        this.initialHeight = 0;
        textBlock.setAttribute("placeholder", "Header 1");
        textBlock.classList.add("header1");
		this.editorIcons.classList.add("header1Icons");
        textBlock.innerHTML = "";
		this.checkBox.style.display = "none";
    }

    setupHeader2(){
        let textBlock = this.shadowRoot.getElementById("textBlock");
		while(this.editorIcons.classList.length > 0){
            this.editorIcons.classList.remove(this.editorIcons.classList[0]);
        }
        while(textBlock.classList.length > 0){
            textBlock.classList.remove(textBlock.classList[0]);
        }
        while(this.classList.length > 0){
            this.classList.remove(this.classList[0]);
        }
        this.controller.creatingFromBullet = {isTrue: false, kind: ""};
        this.kind = "h2";
        this.initialHeight = 0;
        textBlock.setAttribute("placeholder", "Header 2");
        textBlock.classList.add("header2");
		this.editorIcons.classList.add("header2Icons");
        textBlock.innerHTML = "";
		this.checkBox.style.display = "none";
    }

	setupHeader3(){
        let textBlock = this.shadowRoot.getElementById("textBlock");
		while(this.editorIcons.classList.length > 0){
            this.editorIcons.classList.remove(this.editorIcons.classList[0]);
        }
        while(textBlock.classList.length > 0){
            textBlock.classList.remove(textBlock.classList[0]);
        }
        while(this.classList.length > 0){
            this.classList.remove(this.classList[0]);
        }
        this.controller.creatingFromBullet = {isTrue: false, kind: ""};
        this.kind = "h3";
        this.initialHeight = 0;
        textBlock.setAttribute("placeholder", "Header 3");
        textBlock.classList.add("header3");
		this.editorIcons.classList.add("header3Icons");
        textBlock.innerHTML = "";
		this.checkBox.style.display = "none";
    }

    setupNote(){
        let textBlock = this.shadowRoot.getElementById("textBlock");
		while(this.editorIcons.classList.length > 0){
            this.editorIcons.classList.remove(this.editorIcons.classList[0]);
        }
        while(textBlock.classList.length > 0){
            textBlock.classList.remove(textBlock.classList[0]);
        }
        while(this.classList.length > 0){
            this.classList.remove(this.classList[0]);
        }
        this.kind = "note";
		this.controller.creatingFromBullet = {isTrue: true, kind: this.kind};
        this.initialHeight = 3;
        textBlock.setAttribute("placeholder", "Note");
        this.classList.add("noteContainer");
		this.editorIcons.classList.add("noteIcons");
        textBlock.classList.add("note");
        textBlock.innerHTML = "";
		this.checkBox.style.display = "none";
    }

	setupEvent(){
        let textBlock = this.shadowRoot.getElementById("textBlock");
		while(this.editorIcons.classList.length > 0){
            this.editorIcons.classList.remove(this.editorIcons.classList[0]);
        }
        while(textBlock.classList.length > 0){
            textBlock.classList.remove(textBlock.classList[0]);
        }
        while(this.classList.length > 0){
            this.classList.remove(this.classList[0]);
        }
        this.kind = "event";
		this.controller.creatingFromBullet = {isTrue: true, kind: this.kind};
        this.initialHeight = 3;
        textBlock.setAttribute("placeholder", "Event:");
		let dateFiller = "";
		if (!this.timeSetter){
			dateFiller = `${dateFiller} use @ for time HH:MM`;
			if (!this.dateSetter){
				dateFiller = `${dateFiller} and # for weekdays or dates MM/DD/YY`;
			}
		} else if (!this.dateSetter){
			dateFiller = `${dateFiller} use # for weekdays or dates MM/DD/YY`;
		}
		textBlock.setAttribute("dateFiller", dateFiller);
        this.classList.add("eventContainer");
		this.editorIcons.classList.add("noteIcons");
        textBlock.classList.add("note");
		textBlock.classList.add("eventNodateFocused");
        textBlock.innerHTML = "";
		this.checkBox.style.display = "none";
    }

	setupTask(){
        let textBlock = this.shadowRoot.getElementById("textBlock");
		while(this.editorIcons.classList.length > 0){
            this.editorIcons.classList.remove(this.editorIcons.classList[0]);
        }
        while(textBlock.classList.length > 0){
            textBlock.classList.remove(textBlock.classList[0]);
        }
        while(this.classList.length > 0){
            this.classList.remove(this.classList[0]);
        }
        this.kind = "task";
		this.controller.creatingFromBullet = {isTrue: true, kind: this.kind};
        this.initialHeight = 3;
		textBlock.classList.add("task");
        textBlock.setAttribute("placeholder", "Task");
        textBlock.innerHTML = "";
		this.editorIcons.classList.add("paragraphIcons");
		this.checkBox.style.display = "inline";
    }

    removeStyles(){
        let textBlock = this.shadowRoot.getElementById("textBlock");
		while(this.editorIcons.classList.length > 0){
            this.editorIcons.classList.remove(this.editorIcons.classList[0]);
        }
        while(textBlock.classList.length > 0){
            textBlock.classList.remove(textBlock.classList[0]);
        }
        while(this.classList.length > 0){
            this.classList.remove(this.classList[0]);
        }
        this.kind = "paragraph";
        this.initialHeight = 3;
        textBlock.classList.add("unstylized");
        textBlock.setAttribute("placeholder", 'Type "/" to create a block');
        textBlock.innerHTML = "";
		this.editorIcons.classList.add("paragraphIcons");
        this.controller.creatingFromBullet = {isTrue: false, kind: ""};
		this.checkBox.style.display = "none";
    }

    setupTabLevel(){
        this.style.position = "relative";
        this.style.left = (this.tabLevel * tabSize) + "px";
        this.controller.currentTabLevel = this.tabLevel;
        this.setCurrentSpot();
    }

	connectedCallback(){

		let textBlock = this.shadowRoot.getElementById("textBlock");
		textBlock.focus();
        
        document.addEventListener(shadow.eventName, () => {
            this.controller.blockArray[this.controller.currentBlockIndex].setCurrentSpot();
        });

		this.checkBox.onclick = (e) => {
			if (this.checkBox.getAttribute("checked") == "checked"){
				this.checkBox.setAttribute("checked", "");
				textBlock.classList.remove("crossed");
				setTimeout(() => {
					localStorage.readUser((err, user) => {
						if (err == null){
							let task = user.tasks.filter(task => task.id == this.item.objectReference)[0];
							task.complete = 0; 
							localStorage.updateTask(task, (err, task) => {
								console.log(err);
								console.log(task);
							})
						}
					});
				}, 10);
			} else {
				this.checkBox.setAttribute("checked", "checked");
				textBlock.classList.add("crossed");
				setTimeout(() => {
					localStorage.readUser((err, user) => {
						if (err == null){
							let task = user.tasks.filter(task => task.id == this.item.objectReference)[0];
							console.log(task)
							task.complete = 1; 
							localStorage.updateTask(task, (err, task) => {
								console.log(err);
								console.log(task);
							})
						} else {
							console.log(err);
						}
					});
				}, 10);
			}
			e.preventDefault();
		}

		textBlock.onpaste = (e) => {
			// Get user's pasted data
			let data = e.clipboardData.getData('text/html') ||
				e.clipboardData.getData('text/plain');
			
			// Filter out everything except simple text and allowable HTML elements
			let regex = /<(?!(\/\s*)?(a|b|i|em|s|strong|u)[>,\s])([^>])*>/g;
			data = data.replace(regex, '');
			
			// Insert the filtered content
			document.execCommand('insertText', false, data);
			
			// Prevent the standard paste behavior
			e.preventDefault();
		};

		textBlock.onblur = () => {
			this.editorIcons.classList.remove("focusedIcons");
			textBlock.classList.remove("eventNodateFocused");
			this.editorIcons.classList.add("unfocusedIcons");
            if(this.item != null){
				console.log("hello my very old friend");
				if (textBlock.textContent != "" ) {
					this.item.kind = this.kind;
					this.item.text = textBlock.textContent;
					
					localStorage.updateTextBlock(this.item, (res) => {
						console.log(res);    
					})
				} else {
					localStorage.deleteTextBlock(this.item, (res) => {
						console.log(res);
					})
				}
			} else if (textBlock.textContent != ""){

				localStorage.createTextBlock(this.controller.parent.id, this.controller.subParent, this.controller.currentBlockIndex, textBlock.textContent, this.tabLevel, this.kind, null, null, null, (err, block) => {
					if (err){
						console.log(err);
					} else {
						this.item = block;
						console.log(err);
					}
				})
			}
		};
	

		textBlock.addEventListener("input",() =>{
			let content = textBlock.innerHTML;
			if (this.kind == "event"){
				if (content.includes('@')){
					textBlock.innerHTML = content.replace(/(@)/g, "&#128368;  ");
					content = textBlock.innerHTML;
					this.moveToSpot(1000000, true);
				}

				if (content.includes('#')){
					textBlock.innerHTML = content.replace(/(#)/g, "&#128197;  ");
					content = textBlock.innerHTML;
					this.moveToSpot(1000000, true);
				}
			}
            this.setCurrentSpot();
			this.timeSetter = false;
			this.dateSetter = false;
			includesClock(this, textBlock.textContent, true);
			if(this.kind == "event"){
				let dateFiller = "";
				if (!this.timeSetter){
					dateFiller = `${dateFiller} use @ for time HH:MM`;
					if (!this.dateSetter){
						dateFiller = `${dateFiller} and # for weekdays or dates MM/DD/YY`;
					}
				} else if (!this.dateSetter){
					dateFiller = `${dateFiller} use # for weekdays or dates MM/DD/YY`;
				}
				textBlock.setAttribute("dateFiller", dateFiller);
			}
			if (content == "#&nbsp;"){
				this.setupHeader1();
			} else if (content == "##&nbsp;"){
				this.setupHeader2();
			} else if (content == "###&nbsp;"){
				this.setupHeader3();
			} else if (content == "-&nbsp;"){
				this.setupNote();
			} else if (content == "--&nbsp;"){
				this.setupEvent();
			} else if (content == "=-&nbsp;"){
				this.setupTask();
			} else if (content == "<div><br></div>"){
				this.removeStyles();
			} else if (content == "<br>"){
                textBlock.innerHTML = "";
            } else if (textBlock.textContent != ""){
                this.controller.resetPosition = true;
            }
		});

        textBlock.onfocus = (e) => {
            this.controller.resetPosition = false;
            this.setCurrentSpot();
			this.editorIcons.classList.remove("unfocusedIcons");
			this.editorIcons.classList.add("focusedIcons");
            this.controller.currentBlockIndex = this.controller.blockArray.indexOf(this);
            this.controller.currentTabLevel = this.tabLevel;
            if (this.classList.contains("noteContainer") || this.classList.contains("eventContainer") || this.checkBox.style.display != "none"){
                this.controller.creatingFromBullet = {isTrue: true, kind: this.kind};
				if (this.kind == "event"){
					textBlock.classList.add("eventNodateFocused");
				}
            } else {
                this.controller.creatingFromBullet = {isTrue: false, kind: ""};
            }
        };

        

		textBlock.onkeydown = (e)=>{
			let key = e.key || e.keyCode;
			if (key == "Backspace" || key == "Delete"){
                let tabLevelNotZero = this.tabLevel > 0;
                let currentSpot18 = this.currentPointerSpot - (this.tabLevel * tabSize) == paddingSize;
                let currentSpotNote = this.currentPointerSpot - (this.tabLevel * tabSize) == paddingSize + 20 && this.classList.contains("noteContainer");
                let isAtBegining = currentSpot18 || currentSpotNote;
                if (textBlock.innerHTML == "" && textBlock.getAttribute('placeholder') == 'Type "/" to create a block' && this.controller.blockArray.length > 1){
                    this.controller.removeBlock();
                } else if((textBlock.innerHTML == "" || textBlock.innerHTML == "<br>") && this.tabLevel == 0){
					this.removeStyles();
				} else if (tabLevelNotZero && isAtBegining){
                    this.tabLevel -= 1;
                    this.setupTabLevel();
                }
			} else if (key == "Enter"){
				let content = textBlock.innerHTML;
				if (content == "/h1"){
					this.setupHeader1();
					e.preventDefault();
				} else if (content == "/h2"){
					this.setupHeader2()
					e.preventDefault();
				} else if (content == "/h3"){
					this.setupHeader3()
					e.preventDefault();
				} else if (content == "/note"){
					this.setupNote();
                    e.preventDefault();
				} else if (content == "/event"){
					this.setupEvent();
                    e.preventDefault();
				} else if (content == "/task"){
					this.setupTask();
                    e.preventDefault();
				} else if (content == "/futurelog"){
					alert("New Future Log will be created");
                    e.preventDefault();
				} else if (content == "/monthlylog"){
					alert("New Monthly Log will be created");
                    e.preventDefault();
				} else if (content == "/dailylog"){
					alert("New Daily Log will be created");
                    e.preventDefault();
				} else if (content == "/collection"){
					alert("New Collection will be created");
                    e.preventDefault();
				} else {
                    this.controller.resetPosition = false;
                    this.controller.addNewBlock();
                    e.preventDefault();
                }
			} else if (key == "ArrowDown"){
                let lineheight = (textBlock.classList.contains("header1")) ? 80 : ((textBlock.classList.contains("header2")) ? 57 : ((this.kind == "note" || this.kind == "event" || this.kind == "task") ? 47 : 42));
                if (this.currentPointerHeight > textBlock.offsetHeight - lineheight){
                    this.controller.moveToNextBlock();
                } 
            } else if (key == "ArrowUp"){
                let lineheight = (textBlock.classList.contains("header1")) ? 50 : ((textBlock.classList.contains("header2")) ? 36 : 28);
                if (this.currentPointerHeight < lineheight + this.initialHeight){
                    this.controller.moveToPreviousBlock();
                } 
            } else if (key == "Tab"){
                this.tabLevel += 1;
                this.setupTabLevel();
                e.preventDefault();
            } else if (key == "@" && this.kind == "event"){
				if (!this.atPressed) {
					this.atPressed = true;
					this.timeSetter = true;
					let dateFiller = "";
					if (!this.timeSetter){
						dateFiller = `${dateFiller} use @ for time HH:MM`;
						if (!this.dateSetter){
							dateFiller = `${dateFiller} and # for weekdays or dates MM/DD/YY`;
						}
					} else if (!this.dateSetter){
						dateFiller = `${dateFiller} use # for weekdays or dates MM/DD/YY`;
					}
					textBlock.setAttribute("dateFiller", dateFiller);
				} else {
					e.stopPropagation();
					e.preventDefault();
				}
			} else if (key == "#" && this.kind == "event"){
				if (!this.hashPressed) {
					this.hashPressed = true;
					this.dateSetter = true;
					let dateFiller = "";
					if (!this.timeSetter){
						dateFiller = `${dateFiller} use @ for time HH:MM`;
						if (!this.dateSetter){
							dateFiller = `${dateFiller} and # for weekdays or dates MM/DD/YY`;
						}
					} else if (!this.dateSetter){
						dateFiller = `${dateFiller} use # for weekdays or dates MM/DD/YY`;
					}
					textBlock.setAttribute("dateFiller", dateFiller);
				} else {
					e.stopPropagation();
					e.preventDefault();
				}
			} else if (this.atPressed && this.kind == "event" && key.match(/[^0123456789:]/g) && !protectedKeys.includes(key)){
				e.stopPropagation();
				e.preventDefault();
			} else if (this.hashPressed && this.kind == "event" && key.match(/[^0123456789/]/g) && !protectedKeys.includes(key)){
				e.stopPropagation();
				e.preventDefault();
			}
		};

        textBlock.onkeyup = (e) => {
            let key = e.key || e.keyCode;
            if (key == "ArrowRight" || key == "ArrowLeft" || key == "ArrowDown" || key == "ArrowUp"){
                this.setCurrentSpot();
                if (key == "ArrowRight" || key == "ArrowLeft"){
                    this.controller.resetPosition = true;
                }
            }
        };
	}
}

function includesClock (block, text, first) {
	for (let i = 0; i < text.length; i++){
		if (text.charCodeAt(i) == 56517) {
			if (!first){
				block.hashPressed = true;
				block.atPressed = false;
			} else {
				block.dateSetter = true;
			}
		}

		if (text.charCodeAt(i) == 56688){
			if (!first){
				block.atPressed = true;
				block.hashPressed = false;
			} else {
				block.timeSetter = true;
			}
		}
	}
	console.log(block.timeSetter);
	console.log(block.dateSetter);
}

window.customElements.define('text-block', TextBlock);