(function() {
	"use strict";
	window.onload = function() {
		var topBar = document.getElementById("top-bar");
		var sideBar = document.getElementById("side-bar");
		var pin = document.getElementById("pin");
		var thumbsUp = document.getElementsByClassName("fa-thumbs-up")[0];
		var thumbsDown = document.getElementsByClassName("fa-thumbs-down")[0];
		var voteCounter = document.getElementById("counter");
		var tabs = [document.querySelector(".top-tab img"), document.querySelector(".side-tab img")];
		pin.onclick = pinSidebar;
		sideBar.style.right = "-" + sideBar.offsetWidth + "px";
		thumbsUp.onclick = vote;
		thumbsDown.onclick = vote;

		function vote() {
			// TODO: add voting events
		}

		function pinSidebar() {
			if (pin.checked) {
				topBar.style.width = window.innerWidth - sideBar.offsetWidth + "px";
				console.log(sideBar.offsetWidth);
			} else {
				topBar.style.width = "";
			}
		}

		function getCursorPosition(e){
			// Mouse moves. Now show tabs
			clearTimeout(mouseTimer);
			tabs.forEach(function(t) {
				t.style.opacity = 0.5;
			});

			// Hover for top bar
			if (e.pageY < 30) {
				if (!pin.checked && document.getElementsByClassName("side-bar-hover").length == 0) {
					topBar.classList.add("top-bar-hover");
				} else if (pin.checked && e.pageX < window.innerWidth - sideBar.offsetWidth) {
					topBar.classList.add("top-bar-hover");
				}
			} else if (e.pageY > topBar.offsetHeight + 30) {
				topBar.classList.remove("top-bar-hover");
			}

			// Hover for side bar
			if (e.pageX > window.innerWidth - 30 && document.getElementsByClassName("top-bar-hover").length == 0) {
				sideBar.classList.add("side-bar-hover");
			} else if (e.pageX < window.innerWidth - sideBar.offsetWidth - 30 && !pin.checked) {
				sideBar.classList.remove("side-bar-hover");
			}
			var mouseTimer = setTimeout(hideTabs, 2500);
		}

		function hideTabs() {
			if (document.getElementsByClassName("side-bar-hover").length == 0 && 
						document.getElementsByClassName("top-bar-hover").length == 0) {
				tabs.forEach(function(t) {
					t.style.opacity = 0;
				});
			}
		}

		document.addEventListener('mousemove', getCursorPosition, false);
	};
}) ();