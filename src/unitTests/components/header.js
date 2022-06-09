import * as localStorage from "../localStorage/userOperations.js";
import {navbar} from "../index.js";

export class PageHeader extends HTMLElement {
	constructor() {
		super();
		let template = document.createElement("template");
		template.innerHTML = `
			<style>
				@font-face {
					font-family:"SF-Pro";
					src: url("./public/fonts/SF-Pro.ttf");
				}
		
				/* Top navigation */
				#menuToggle{
					display: none;
				}

				.header {
					font-family: system-ui;
					position: relative;
					top: 1em;
					margin-top: 100px;
					margin-left: 0;
				}
		
				button {
					vertical-align: bottom;
					border: none;
					background-color: rgba(0,0,0,0);
				}
		
				button.imgbutton{
					height: 20px;
					position: relative;
					z-index: -1;
				}
		
				button.imgbutton img {
					filter: opacity(50%);
					height: 20px;
				}
		
				button.imgbutton:hover img {
					filter: opacity(100%);
					transition: 150ms;
				}
		
				button {
					display: inline;
					margin-top: 0;
					margin-bottom: 0;
				}
		
				h1 {
					display: inline;
					font-size: 40px;
					font-weight: bold;
					letter-spacing: 1.7px;
					vertical-align: middle;
					position: relative;
					z-index: 0;
					outline: none;
				}
		
				.search_bar {
					margin-top: 15px;
					margin-right: 0;
					margin-left: 10px;
					height: 30px;
					border-radius: 5px;
					border-color: rgba(0, 0, 0, 0.1);
					border-width: 2px;
					border-style: solid;
					opacity: 60%;
				}
		
				.search_bar img {
					display: inline-block;
				
					opacity: 50%;
		
					height: 21px;
					line-height: 36px;
					vertical-align: text-bottom;
		
					/* TODO: unjank */
					position: relative;
					top: 0;
					right: 15px;
					margin-left: 10px;
				}
		
				.search_bar input{
					/* TODO: hard coded */
					margin-top: -6px;
					background-color: rgba(0, 0, 0, 0);
					font-size: 14pt;
					opacity: 90%;
					height: 35px;
					text-align: left;
					width: 400px;
					border: solid;
					border-radius: 5px;
					margin-left: 10px;
					border-color: rgba(0, 0, 0, 0);
					outline: none;
				}
		
				/* Fade in for search bar */
				.search_bar:hover img {
					opacity: 50%;
					transition: 150ms;
				}
		
				.search_bar:hover {
					transition: 150ms;
					opacity: 90%;
				}
		
				.search_bar input:focus .search_bar{
					transition: 150ms;
					opacity: 90%;
				}
		
				#header_back{
					margin-left: 0;
					margin-right: 5px;
				}
		
				#header_forward{
					margin-right: 0;
					margin-left: 5px;
				}
		
				.hide{
					display: none;
					opacity: 0;
				}

				.plus {
					position: relative;
					display: inline-block;
					float: right;
					background-image: url(../public/resources/plusIcon.png);
					background-size: cover;
					background-color: transparent;
					background-blend-mode: multiply;
					top: 20px;
					width: 23px;
					height: 23px;
					opacity: 50%;
					transition: opacity .2s;
				}

				.plus:hover {
					opacity: 100%;
					transition: opacity .2s;
				}
				#menuToggle {
					flex-direction: column;
					position: absolute;
					top: 45px;
					left: 20px;
					z-index: 1;
				  }
				  
				#menuToggle input {
					display: flex;
					width: 40px;
					height: 32px;
					position: absolute;
					cursor: pointer;
					opacity: 0;
					z-index: 2;
				  }
				  
				#menuToggle span {
					display: flex;
					width: 29px;
					height: 2px;
					margin-bottom: 5px;
					position: relative;
					background: grey;
					border-radius: 3px;
					z-index: 1;
					transform-origin: 5px 0px;
					transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
								background 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
								opacity 0.55s ease;
				}
				  
				#menuToggle span:first-child {
					transform-origin: 0% 0%;
				}
				  
				#menuToggle span:nth-last-child(2) {
					transform-origin: 0% 100%;
				}
				  
				#menuToggle input:checked ~ span {
					opacity: 1;
					transform: rotate(45deg) translate(-7px, -10px);
					background: #36383F;
				}
				
				#menuToggle input:checked ~ span:nth-last-child(3) {
					opacity: 0;
					transform: rotate(0deg) scale(0.2, 0.2);
				}
				
				#menuToggle input:checked ~ span:nth-last-child(2) {
					transform: rotate(-45deg) translate(-5px, 10px);
				}
				
				@media screen and (max-width: 1250px) {
					.search_bar input {
						width: 220px;
					}
				}

				@media screen and (max-width: 1080px) {
					.search_bar input {
						width: 170px;
					}
				}

				@media screen and (max-width: 1020px) {
					.search_bar {
						display: none;
					}
				}

				@media screen and (max-width: 900px) {
					.search_bar {
						display: none;
					}

					.header{
						margin-left: 35px;
						margin-right: 35px;
					}

					#menuToggle{
						display: inline;
					}

					.plus{
						position: absolute;
						top: 42px;
						right: 20px;
					}

					#title_page{
						top: 5px;
						font-size: 35px;
						letter-spacing: 1.5px;
					}

					button.imgbutton img {
						height: 15px;
					}

					button.imgbutton {
						height: 15px;
						padding: 0;
					}
					#header_back{
						margin-left: 0;
						margin-right: 1px;
					}
			
					#header_forward{
						margin-right: 0;
						margin-left: 1px;
					}

				}

				@media screen and (max-width: 700px) {
					.plus{
						position: absolute;
					}

					#title_page{
						top: 5px;
						font-size: 22px;
						letter-spacing: 1px;
					}

					button.imgbutton img {
						height: 15px;
					}

					button.imgbutton {
						height: 15px;
						padding: 0;
					}
					#header_back{
						margin-left: 0;
						margin-right: 1px;
					}
			
					#header_forward{
						margin-right: 0;
						margin-left: 1px;
					}
				}
				@media screen and (min-width: 600px) {
					.search_bar {
						float: right;
					}
				}
			</style>

			<div id="menuToggle">
				<input type="checkbox" />
				<span></span>
				<span></span>
				<span></span>
			
			</div>

			<span class="header">
				<button class="imgbutton" id="header_back"><img src="../public/resources/left-chevron.png"></button>
		
				<h1 id="title_page">Template Page Title</h1>
		
				<button class="imgbutton" id="header_forward"><img src="../public/resources/right-chevron.png"></button>
			</span>

			
		
			<span class="search_bar">
				<input type="text" placeholder="Search">
				<img src="../public/resources/search_icon.png">
			</span>
			<button class="plus">
			</button>
		`;

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.h1 = this.shadowRoot.querySelector("h1");

		this.createFutureLog = this.createFutureLog.bind(this);
		this.futureLogButton = this.shadowRoot.querySelector(".plus");
		this.menu = this.shadowRoot.querySelector("#menuToggle");
		this.input = this.shadowRoot.querySelector("#menuToggle input");
	}

	connectedCallback() {
		this.menu.onclick = () => {
			console.log(this.input.checked);
			navbar.toggleMenu();
		};

		this.futureLogButton.addEventListener("click", () => {
			this.createFutureLog();
		});
	}

	makeEditabe(){
		this.h1.contentEditable = true;
	}

	makeUneditable(){
		this.h1.contentEditable = false;
	}

	set title(title) {
		this.h1.innerText = title;
	}

	get title() {
		return this.h1.innerText;
	}

	createFutureLog() {
		localStorage.createFutureLog( new Date(2021, 5, 22), new Date(2021, 8, 23), [], [], [], (err, futureLog) => {
			console.log(futureLog);
			localStorage.readUser( (err, res) => {
				if (err) {
					console.log(err);
				} else {
					console.log(res);
					// localStorage.createCollection("testing createCollection", "1", [], (err, collection) => {
					// 	console.log(collection);
					// 	localStorage.readUser((err, res) => {
					// 		if(err) {
					// 			console.log(err);
					// 		} else {
					// 			console.log(res);
					// 		}
					// 	});
					// });
				}
			})
		});
		
	}
}

customElements.define('page-header', PageHeader);
