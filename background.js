chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if ("getOptions" == request.message) {
		if ("undefined" != typeof localStorage) {
			chrome.tabs.query({
					"active": true,
					"currentWindow": true
				},
				function(tabs) {
					
						chrome.tabs.sendMessage(tabs[0].id, {
							"message": "returnOptions",
							"remove": request.remove,
							"keywords": localStorage.getItem("keywords"),
							"background": localStorage.getItem("background") || "#FBC0E4"
						});
				}
			);
		}
	}
	else if("disableOptions" == request.message){
		if ("undefined" != typeof localStorage) {
			chrome.tabs.query({
					"active": true,
					"currentWindow": true
				},
				function(tabs) {
					
						chrome.tabs.sendMessage(tabs[0].id, {
							"message": "disableOptions",
							"remove": request.remove,
							"keywords": localStorage.getItem("keywords"),
							"background": localStorage.getItem("background") || "#FBC0E4"
						});
				}
			);
		}
	}
});
