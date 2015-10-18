(function() {
	"use strict";
	window.onload = function() {
		var topBar = document.getElementById("top-bar");
		function getCursorPosition(e){
        	if (e.pageY < 75) {
        		topBar.classList.add("top-bar-hover");
        	} else {
        		topBar.classList.remove("top-bar-hover");
        	}
        }
        document.addEventListener('mousemove', getCursorPosition, false);
	};
}) ();