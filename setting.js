function loadOptions() {
	if ("undefined" != typeof localStorage) {
		document.getElementById("textareaKeywords").value = localStorage.getItem("keywords");
		document.getElementById("colorBackground").value = localStorage.getItem("background") || "#FBC0E4";
	}
}

function saveOptions() {
	if ("undefined" != typeof localStorage) {
		localStorage.setItem("keywords", document.getElementById("textareaKeywords").value);
		localStorage.setItem("background", document.getElementById("colorBackground").value);
	}
}
var last;
var count;
document.addEventListener("DOMContentLoaded", function() {
	
	loadOptions();

	document.getElementById("buttonSave").addEventListener("click", function() {
		saveOptions();
		history.back();
		//window.close();
		
		whale.runtime.sendMessage({
			"message": "getOptions",
			"remove": true
		});

	});
	
});
document.addEventListener("DOMContentLoaded", function() {

	document.getElementById("settingSave").addEventListener("click",function(){
			last = document.getElementById("setting_last").value;
			count = document.getElementById("setting_count").value;
			whale.storage.sync.set({
				setting_last: last,
				setting_count : count
			})
			history.back();
			})
})
function rowDom(index, obj){//tag,title,url,count,lastvisit){
	stateImg = ["GreenO.png","YelloO.png","RedO.png"];

	var Div=document.getElementById("rowBody");
	var rowDiv = Div.appendChild(document.createElement('tr'));
	var td_1 = rowDiv.appendChild(document.createElement('td'));
	var t_img = td_1.appendChild(document.createElement('img'));
	////////////추가
	if(obj.state==-1){
		t_img.src = "deleteO.png"; t_img.height=13
	}
	else{
		t_img.src = stateImg[obj.state]; t_img.height=12;
	}
	///////////
	var td_2 = rowDiv.appendChild(document.createElement('td'));
	var t_count = td_2.appendChild(document.createElement('p'));
	t_count.appendChild(document.createTextNode(obj.count.toString()+"회"));

	// var td_3 = rowDiv.appendChild(document.createElement('td'));
	// var t_url = td_3.appendChild(document.createElement('p'));
	// t_url.appendChild(document.createTextNode(obj.title.slice(0,10)));

	
	var td_3 = rowDiv.appendChild(document.createElement('td'));
 	var full_url = document.createElement('abbr');
 	full_url.title= obj.url; full_url.style="text-decoration: none;";
	var t_abbr = td_3.appendChild(full_url);
	var t_url = t_abbr.appendChild(document.createElement('p'));
	t_url.appendChild(document.createTextNode(obj.title.slice(0,13)));


	var td_4 = rowDiv.appendChild(document.createElement('td'));
	var t_time = td_4.appendChild(document.createElement('p'));
	date = new Date(obj.time);
	t_time.appendChild(document.createTextNode(date.toLocaleDateString()));
	var td_5 =  rowDiv.appendChild(document.createElement('td'));
	var t_del = td_5.appendChild(document.createElement('a'));
	t_del.href = obj.url;t_del.target="_blank";
	var t_arr = t_del.appendChild(document.createElement('img'));
	t_arr.src="arrow.png"; t_arr.height=27;
}
var active_count=0;
var danger_count=0;

whale.storage.sync.get("loginList",function(result){
	L=result.loginList;
	
	a = new Date();
    now = a.getTime();
    
    for(i=0;i<L.length;i++){
	node = L[i];
	if(node.state!=-1){
		if((node.time<now-last) &&(node.count<count)){
				node.state = 2;  //danger
				danger.push(node);
				danger_count+=1;
			}
			else if((node.time>now-2629743000) && (node.count>50)){
				node.state=0;; //good
				active_count+=1;
			}
			else {node.state=1;} //soso                 

		}
	}
    L.sort(function(a,b){
    	return b.state-a.state;
    })
    
    for(i=0;i<L.length;i++){
    	if(L[i] &&(L[i].state!=-1)){
    		rowDom(i+1,L[i]);
    	}
	  
	}
})
