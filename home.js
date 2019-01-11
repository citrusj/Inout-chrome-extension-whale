var enableHighlight = true;

document.addEventListener("DOMContentLoaded", function() {

	//document.getElementById("startHighlight").addEventListener("click", function() {
	document.querySelector('input[type="image"]').addEventListener("click", function() {

		if(!enableHighlight){
			enableHighlight = true;
			chrome.runtime.sendMessage({
			"message": "getOptions",
			"remove": true,	
		});
		}
		else{
			enableHighlight = false;
			chrome.runtime.sendMessage({
			"message": "disableOptions",
			"remove": true
		});
		}




	});

});


