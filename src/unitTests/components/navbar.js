const template = document.createElement('template');

template.innerHTML = `
	<style>
		.navigation {
			display: none;
		}

		.nav-bar {
			position: fixed;
			width: 60px;
			height: 100%;
			top: 0;
			bottom: 0;
			left: 0;
			display: block;
			background: rgba(236, 223, 207, 0.4);


		}

		#home {
			background-image: url(../public/resources/home_icon.png);
			background-size: cover;
			background-color: transparent;
			border:none;

			position: absolute;
			width: 32px;
			height: 32px;
			left: 15px;
			top: 20px;
		}

		#target {
			background-image: url(../public/resources/target_icon.png);
			background-size: cover;
			background-color: transparent;
			background-blend-mode: multiply;
			border:none;

			position: absolute;
			width: 35px;
			height: 35px;
			left: 15px;
			top: 90px;
		}

		#single {
			background-image: url(../public/resources/left.png);
			background-size: cover;
			background-color: transparent;
			background-blend-mode: multiply;
			border:none;

			position: absolute;
			width: 32px;
			height: 32px;
			left: 15px;
			top: 160px;
		}

		#double {
			background-image: url(../public/resources/double_icon.png);
			background-size: cover;
			background-color: transparent;
			background-blend-mode: multiply;
			border:none;

			position: absolute;
			width: 35px;
			height: 35px;
			left: 15px;
			top: 230px;
		}

		#user {
			background-image: url(../public/resources/user.png);
			background-size: cover;
			background-color: transparent;
			background-blend-mode: multiply;
			border:none;

			position: absolute;
			width: 33px;
			height: 33px;
			left: 13.5px;
			bottom: 20px;
		}

		ul {
			list-style-type: none;
		}

		ul li {
			opacity: 0.7;
			transition: 150ms;
		}

		ul li:hover{
			opacity: 1;
			transition: 150ms;
		}

		ul li button{
			cursor: pointer;
		}

		@media only screen and (max-width:900px) {

			.nav-bar {
				display:none;
			}

			.navigation {
				display: block;
				background-color: rgba(236, 223, 207, 0.0);
				height: 8vh;
				padding: none;
				margin: none;
				width: 30%;
				top: 0;
				left: 0;
				position:fixed;
			}

			#menu {
				position: fixed;
				width: 30%;
				height: 100%;
				box-shadow: 0 0 2px #85888C;
				top: 0;
				left: 0;
				margin: 0;
				padding: 0;
				background-color: white;
			}

			.menuClosed{
				-webkit-font-smoothing: antialiased;
				transform: translate(-100%, 0);
				transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
			}

			.menuOpen{
				-webkit-font-smoothing: antialiased;
				transform-origin: 0 0;
				transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
			}

			#homeMenu {
				background-image: url(../public/resources/home_icon.png);
				background-size: cover;
				background-color: transparent;
				border:none;
				cursor: pointer;
				position: absolute;
				width: 60px;
				height: 60px;
				top: 70px;
				left: 0;
				right: 0;
				margin: auto;
			}

			#singleMenu {
				background-image: url(../public/resources/left.png);
				background-size: cover;
				background-color: transparent;
				border:none;
				cursor: pointer;
				position: absolute;
				width: 60px;
				height: 60px;
				top: 180px;
				left: 0;
				right: 0;
				margin: auto;
			}

			#doubleMenu {
				background-image: url(../public/resources/double_icon.png);
				background-size: cover;
				background-color: transparent;
				border:none;
				cursor: pointer;
				position: absolute;
				width: 60px;
				height: 60px;
				top: 290px;
				left: 0;
				right: 0;
				margin: auto;
			}

			#userMenu {
				background-image: url(../public/resources/user.png);
				background-size: cover;
				background-color: transparent;
				border:none;
				cursor: pointer;
				position: absolute;
				width: 65px;
				height: 65px;
				top: calc(100% - 115px);
				left: 0;
				right: 0;
				padding: 0;
				margin: 0 auto;
			}


			  #menuToggle input:checked ~ ul
			  {
				transform: none;
			  }

		}

		@media only screen and (max-height: 1200px){
			#homeMenu {
				width: 40px;
				height: 40px;
			}

			#singleMenu {
				width: 40px;
				height: 40px;
				top: 150px;
			}

			#doubleMenu {
				width: 40px;
				height: 40px;
				top: 230px;
			}

			#userMenu {
				position: absolute;
				width: 45px;
				height: 45px;
				top: calc(100% - 85px);
			}
		}

		@media only screen and (max-height: 800px){
			#homeMenu {
				width: 35px;
				height: 35px;
			}

			#singleMenu {
				width: 35px;
				height: 35px;
				top: 130px;
			}

			#doubleMenu {
				width: 35px;
				height: 35px;
				top: 190px;
			}

			#userMenu {
				position: absolute;
				width: 40px;
				height: 40px;
				top: calc(100% - 65px);
			}
		}

	</style>

	<nav class="nav-bar">
		<ul>
			<li><button id="home"></button></li>
			<li><button id="target"></button></li>
			<li><button id="single"></button></li>
			<li><button id="double"></button></li>
			<li><button id="user"></button></li>
		</ul>
	</nav>
	<nav class="navigation">
		<div id="menu" class="menuClosed">
			<button id="homeMenu"></button>
			<button id="singleMenu"></button>
			<button id="doubleMenu"></button>
			<button id="userMenu"></button>
		</div>
	</nav>
`;

export class NavBar extends HTMLElement {
	constructor () {
		super ();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));


		this.home = this.shadowRoot.querySelectorAll('button')[0];
		this.target = this.shadowRoot.querySelectorAll('button')[1];
		this.single = this.shadowRoot.querySelectorAll('button')[2];
		this.double = this.shadowRoot.querySelectorAll('button')[3];
		this.user = this.shadowRoot.querySelectorAll('button')[4];
		this.menu = this.shadowRoot.querySelector('#menu');
		this.homeMenu = this.shadowRoot.querySelector('#homeMenu');
		this.singleMenu = this.shadowRoot.querySelector('#singleMenu');
		this.doubleMenu = this.shadowRoot.querySelector('#doubleMenu');
		this.userMenu = this.shadowRoot.querySelector('#userMenu');
	}

	connectedCallback() {
		this.home.addEventListener('click', () => {
			this.goHome();
		});
		this.target.addEventListener('click', () => {
			this.toggleTracker();
		});
		this.single.addEventListener('click', () => {
			this.goBack();
		});
		this.double.addEventListener('click', () => {
			this.goFarBack();
		});
		this.user.addEventListener('click', () => {
			alert("hello");
		});

		this.homeMenu.addEventListener('click', () => {
			this.goHome();
			this.toggleMenu();
			header.input.checked = false;
		});
		this.singleMenu.addEventListener('click', () => {
			this.goBack();
			this.toggleMenu();
			header.input.checked = false;
		});
		this.doubleMenu.addEventListener('click', () => {
			this.goFarBack();
			this.toggleMenu();
			header.input.checked = false;
		});
		this.userMenu.addEventListener('click', () => {
			alert("hello");
			this.toggleMenu();
			header.input.checked = false;
		});
	}

	goHome() {
		router.navigate("/");
	}

	goBack() {
		let parent = (document.location.pathname.startsWith("/dailyLog")) ? "monthlyLog" : "futureLog";
		router.navigate(`/${parent}/${currentObject.parent}`);
	}

	toggleTracker() {
		const trackerMenu = document.querySelector("tracker-menu");
		trackerMenu.toggle();
	}

	toggleMenu() {
		if (this.menu.classList.contains("menuClosed")){
			this.menu.classList.remove("menuClosed");
			this.menu.classList.add("menuOpen");
		} else {
			this.menu.classList.remove("menuOpen");
			this.menu.classList.add("menuClosed");
		}
	}

}

customElements.define('nav-bar', NavBar);