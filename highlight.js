var basicKeywords = "주민번호, 주민등록번호, 번호, 휴대폰, 휴대폰번호, 연락처, 전화, 이메일, 쿠키";
var basicBackground = "rgb(255, 255, 153)";
var time = ", 1개월, 2개월, 3개월, 4개월, 5개월, 6개월, 7개월, 8개월, 9개월, 10개월, 11개월, 1년, 2년, 3년, 4년, 5년, 6년, 7년, 8년, 9년, 10년, 무기한";
var moreKeywords = "위치, 위치정보, 광고, 맞춤광고, 맞춤 광고, 마케팅, 탈퇴, 이용 기록, 제3자"+time;
var moreBackground = "rgb(150,237,255)"

function keywordsHighlighter(node, options, enable) {
	// Based on "highlight: JavaScript text higlighting jQuery plugin" by Johann Burkard.
	// http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
	// MIT license.

	function highlight(node, pos, keyword, options) {
		var span = document.createElement("span");
		span.className = "highlighted";
		//span.style.color = options.foreground;
		span.style.backgroundColor = options.background;

		var highlighted = node.splitText(pos);
		highlighted.splitText(keyword.length);
		var highlightedClone = highlighted.cloneNode(true);

		span.appendChild(highlightedClone);
		highlighted.parentNode.replaceChild(span, highlighted);
	}

	function addHighlights(node, keywords, options) {
		var skip = 0;

		var i;
		if (3 == node.nodeType) {
			for (i = 0; i < keywords.length; i++) {
				var keyword = keywords[i].toLowerCase();
				var pos = node.data.toLowerCase().indexOf(keyword);
				if (0 <= pos) {
					highlight(node, pos, keyword, options);
					skip = 1;
				}
			}
		}
		else if (1 == node.nodeType && !/(script|style|textarea)/i.test(node.tagName) && node.childNodes) {
			for (i = 0; i < node.childNodes.length; i++) {
				i += addHighlights(node.childNodes[i], keywords, options);
			}
		}	

		return skip;
	}

	if(enable) {
		var keywords = options.keywords.split(",");
		delete options.keywords;
		addHighlights(node, keywords, options);
	}

}
function removeHighlights(node) {
	var span;
	while (span = node.querySelector("span.highlighted")) {
		span.outerHTML = span.innerHTML;
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	
var TermPageWords = ["약관", "동의", "회원", "개인정보","규정"];
var sameWords = 0;
var moreSameWords = 0;
var iframeIdxs = new Array();
var iframes = document.getElementsByTagName('iframe');
var Idx = 0;

//초기화
for(var i=0;i<iframes.length;i++)
{
	iframeIdxs[i] = -1;
}

//samWords 확인
TermPageWords.forEach(function(word)
{
	if(document.body.innerText.includes(word)){sameWords++;}
});

for(var i=0;i<iframes.length;i++)
{
	TermPageWords.forEach(function(word)
	{	
		if(iframes[i].contentWindow.document.body.innerText.includes(word)) 
		{	
			sameWords++;
			iframeIdxs[Idx] = i;
			Idx++;
		}
	});
}

//MoreSameWords확인
var MoreTermWords = ["개인정보처리방침", "개인정보취급방침", "탈퇴", "목적", "정의", "개정", "법령", "거래", "서비스", "권리", "철회",  "자격", "제삼자", "이하", "규정"];
MoreTermWords.forEach(function(word)
{
	if(document.body.innerText.includes(word)){moreSameWords++;}
});


for(var i=0;i<iframes.length;i++)
{
	if(iframeIdxs[i]==-1)
	{
		continue;
	}
	MoreTermWords.forEach(function(word)
	{	
		if(iframes[i].contentWindow.document.body.innerText.includes(word)) 
		{	
			moreSameWords++;
		}
	});
	if(moreSameWords>7)
		break;
}

	if(sameWords >= 3 && moreSameWords > 5){
	if ("returnOptions" == request.message) {
		
			//remove
			if(request.remove)
			{
				removeHighlights(document.body);
				if(Idx>0)
				{
					for(var i=0;i<iframes.length;i++)
					{
						if(iframeIdxs[i]==-1)
							break;
						removeHighlights(iframes[i].contentWindow.document.body);
					}
				}
			}
			if(request.keywords){
				keywordsHighlighter(
					document.body,
					{
						"keywords": request.keywords,
						"background": request.background
					},
					true
				);
			}
			keywordsHighlighter(
				document.body,
				{
					"keywords": basicKeywords,
					"background": basicBackground
				},
				true
			); 
			keywordsHighlighter(
				document.body,
				{
					"keywords": moreKeywords,
					"background": moreBackground
				},
				true
			); 


			if(Idx>0)
			{
				for(var i=0;i<iframes.length;i++)
				{
					if(iframeIdxs[i]==-1)
						break;
					if(request.keywords){
						keywordsHighlighter(
							iframes[i].contentWindow.document.body,
							{
								"keywords": request.keywords,
								"background": request.background
							},
							true
						);
					}
					
					keywordsHighlighter(
						iframes[i].contentWindow.document.body,
						{
							"keywords": basicKeywords,
							"background": basicBackground
						},
						true
					); 
					keywordsHighlighter(
						iframes[i].contentWindow.document.body,
						{
							"keywords": moreKeywords,
							"background": moreBackground
						},
						true
					); 
				}				
			}

			
	
	}
	else if("disableOptions" == request.message){
		
			//remove
			
			removeHighlights(document.body);
			if(Idx>0)
			{
				for(var i=0;i<iframes.length;i++)
				{
					if(iframeIdxs[i]==-1)
						break;
					removeHighlights(iframes[i].contentWindow.document.body);
				}
			}
		}
	}
});

chrome.runtime.sendMessage({
	"message": "getOptions",
	"remove": false
});


