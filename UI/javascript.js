(function() {
	"use strict";
	window.onload = function() {
		var topBar = document.getElementById("top-bar");
		var sideBar = document.getElementById("side-bar");
		var pin = document.getElementById("pin");
		var thumbsUp = document.getElementsByClassName("fa-thumbs-up")[0];
		var thumbsDown = document.getElementsByClassName("fa-thumbs-down")[0];
		var voteCounter = document.getElementById("counter");
		pin.onclick = pinSidebar;

		thumbsUp.onclick = vote;
		thumbsDown.onclick = vote;
		function vote() {
			// TODO: add voting events
		}

		console.log(sideBar.offsetWidth);

		function pinSidebar() {
			if (pin.checked) {
				topBar.style.width = window.innerWidth - sideBar.offsetWidth + "px";
				console.log(sideBar.offsetWidth);
			} else {
				topBar.style.width = "";
			}
		}

		function getCursorPosition(e){
			if (e.pageY < 75) {
				if (!pin.checked && document.getElementsByClassName("side-bar-hover").length == 0) {
					topBar.classList.add("top-bar-hover");
				} else if (pin.checked && e.pageX < window.innerWidth - sideBar.offsetWidth) {
					topBar.classList.add("top-bar-hover");
				}
			} else {
				topBar.classList.remove("top-bar-hover");
			}
			if (e.pageX > window.innerWidth - 200) {
				sideBar.classList.add("side-bar-hover");
			} else if (e.pageX < window.innerWidth - sideBar.offsetWidth && !pin.checked) {
				sideBar.classList.remove("side-bar-hover");
			}
		}

		document.addEventListener('mousemove', getCursorPosition, false);
	};
}) ();