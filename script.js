
function rowDom(index, obj){//tag,title,url,count,lastvisit){
	stateImg = ["GreenO.png","YelloO.png","RedO.png"];
	var rowDiv=document.getElementById("row_"+index.toString());
	var td_1 = rowDiv.appendChild(document.createElement('td'));
	var t_img = td_1.appendChild(document.createElement('img'));
	t_img.src = stateImg[obj.state]; t_img.height=12;
	var td_2 = rowDiv.appendChild(document.createElement('td'));
	var t_count = td_2.appendChild(document.createElement('p'));
	t_count.id = "count_c";
	t_count.appendChild(document.createTextNode(obj.count.toString()+"회"));
	

	var td_3 = rowDiv.appendChild(document.createElement('td'));
 	var full_url = document.createElement('abbr');
 	full_url.title= obj.url; full_url.style="text-decoration: none;";
	var t_abbr = td_3.appendChild(full_url);
	var t_url = t_abbr.appendChild(document.createElement('p'));
	t_url.appendChild(document.createTextNode(obj.title.slice(0,10)));

	
	var td_4 = rowDiv.appendChild(document.createElement('td'));
	var t_time = td_4.appendChild(document.createElement('p'));
	t_time.id = "date_c";
	date = new Date(obj.time);
	t_time.appendChild(document.createTextNode(date.toLocaleDateString()));
	var td_5 =  rowDiv.appendChild(document.createElement('td'));
	var t_del = td_5.appendChild(document.createElement('a'));
	t_del.href = obj.url;t_del.target="_blank";
	var t_arr = t_del.appendChild(document.createElement('img'));
	t_arr.src="arrow.png"; t_arr.height=27;

	///////////추가
	var td_6 =  rowDiv.appendChild(document.createElement('td'));
	var t_button = td_6.appendChild(document.createElement('button'));
	t_button.id = "delete_"+index.toString();
	t_button.appendChild(document.createTextNode("X"));
	t_button.onclick = delete_node(index, obj.host);
	//////////////

}
////////////추가
function delete_node(index, host){
	document.getElementById("delete_"+index.toString()).addEventListener("click", function() {
		
		whale.storage.sync.get("loginList",function(result){
			node = L.find(x=>x.host==host);
			node.state = -1;
			whale.storage.sync.set({"loginList":L});
		});
		whale.storage.sync.set({"loginList":L});
		location.reload(true);
	})
}
/////////////
function ErrorDom(index,obj){
	var rowDiv=document.getElementById("row_1");
	var td_1 = rowDiv.appendChild(document.createElement('td'));
	var t_error = td_1.appendChild(document.createElement('p'));
	t_error.appendChild(document.createTextNode(index));
	var td_2 = rowDiv.appendChild(document.createElement('td'));
	td_2.colSpan=4;
	var t_msg = td_2.appendChild(document.createElement('p'));
	t_msg.appendChild(document.createTextNode(obj.msg));
}

function currentDom(obj){
	stateImg = ["GreenO.png","YelloO.png","RedO.png"];
	var rowDiv=document.getElementById("current");
	var td_1 = rowDiv.appendChild(document.createElement('td'));
	td_1.width = "70px";
	var t_cur = td_1.appendChild(document.createElement('p'));
	t_cur.appendChild(document.createTextNode("최근 사이트"));
	var td_2 = rowDiv.appendChild(document.createElement('td'));
	td_2.width=100;
	var t_url = td_2.appendChild(document.createElement('p'));
	t_url.appendChild(document.createTextNode(obj.title.slice(0,10)));
	var td_3 = rowDiv.appendChild(document.createElement('td'));
	td_3.width=50;
	var t_count = td_3.appendChild(document.createElement('p'));
	t_count.appendChild(document.createTextNode(obj.count.toString()+"회"));
	var td_4 = rowDiv.appendChild(document.createElement('td'));
	td_4.width = 30;
	var t_img = td_4.appendChild(document.createElement('img'));
	///////////추가
	if(obj.state==-1){
		t_img.src = "deleteO.png"; t_img.height=13
	}
	else{
		t_img.src = stateImg[obj.state]; t_img.height=12;
	}
	////////
	
	var td_5 =  rowDiv.appendChild(document.createElement('td'));
	td_5.width=60;
	var t_go = td_5.appendChild(document.createElement('a'));
	t_go.href = obj.url;t_go.target="_blank";
	t_go.appendChild(document.createTextNode('이동'));

}
var danger_count=0;
var active_count=0;
var aver_count=0;  //추가
var current = new Date();


//url origin
function toOrigin(url){
	tmp = new URL(url);
	return tmp.origin;
}


//install할 떄 loginList 초기화, load될 때 L 값 storage에서 받아옴
whale.runtime.onInstalled.addListener(function(details){
	whale.storage.sync.set({"loginList":[]});
	whale.storage.sync.set({"setting_last":15778458000, "setting_count":10});
})


//L에 loginList 받아오기
whale.storage.sync.get("loginList",function(result){
	whale.storage.sync.get("setting_last",function(lastset){
		whale.storage.sync.get("setting_count",function(countset){

			set_last = lastset.setting_last;
			set_count = countset.setting_count;

			L=result.loginList;
			if(L.length==0){
				ErrorDom('-',{msg:"로그인한 사이트를 찾을 수 없음"})	
			}
			else{
				a = new Date();
			    now = a.getTime();

			    for(i=0;i<L.length;i++){
				node = L[i];
				if(node.state!=-1){///////////추가
					if((node.time<now-set_last) &&(node.count<set_count)){
						node.state = 2;  //danger
						danger.push(node);
						danger_count+=1;
					}
					else if((node.time>now-2629743000) && (node.count>50)){
						node.state=0;; //good
						active_count+=1;
					}
					else {
						node.state=1;
						aver_count+=1;
						} //soso                 
					}		
				}
					
			    L.sort(function(a,b){
			    	return b.state-a.state;
			    })
			    
			    flag=0;
			    for(i=0;i<3;i++){
			    	if(L[i]&&(L[i].state!=-1)){
			    		rowDom(i+1,L[i]);
			    		flag=1;
			    	}
			    }
			    if(flag==0) ErrorDom('-',{msg:"표시할 목록이 없습니다."}); //추가
			}
			whale.storage.sync.get("current",function(currentset){
				node = currentset.current;
				a = new Date();
			    now = a.getTime();
			    if((node.time<now-set_last) &&(node.count<set_count)){
						node.state = 2;  //danger
						danger.push(node);
						danger_count+=1;
					}
					else if((node.time>now-2629743000) && (node.count>50)){
						node.state=0;; //good
						active_count+=1;
					}
					else {node.state=1;}
				currentDom(node);
			})
		    
			//graph 그리기

			var ctx = document.getElementById("myChart").getContext('2d');
			var myChart = new Chart(ctx, {
			    type: 'pie',
			    data: {
			        labels: ["탈퇴권유", "적정", "자주 이용"],
			        datasets: [{
			            label: '사이트 수',
			            data: [danger_count, aver_count, active_count],
			            backgroundColor: [
			            	'rgba(244, 43, 22, 0.3)',
			                'rgba(255, 217, 102, 0.3)',
			                'rgba(79, 216, 55, 0.3)'
			                
			            ],
			            borderColor: [
			                'rgba(255,99,132,1)',
			                'rgba(255, 206, 86, 1)',
			                'rgba(59, 181, 91, 1)'
			            ],
			            borderWidth: 1
			        }]
			    },
			    options: {
			        responsive: true
			    }
		});
});
	});
});


var current_page

//content script 판별하여 loginList 생성
whale.runtime.onMessage.addListener(
	function(request, sender) {



        if(request.status==true){
        	if(prev = L.find(x=>x.host==request.host)){
        		prev.time = request.date;	
        		whale.history.search({text: request.host, startTime: 1483196400000, maxResults: 500}, function(data) {
					visit=0;
					data.forEach(function(page){
						visit+=page.visitCount;
   					});
				prev.count = visit;//countL.push(visit);
				//console.log(L[L.indexOf(prev)]);
				whale.storage.sync.set({"loginList":L});
				whale.storage.sync.set({"current":prev});
    			});
        	}
        	else{

        		k=L.push({url: toOrigin(sender.url), time: request.date, title:request.title, host: request.host, state: 1});
        		if(prev = L.find(x=>x.host==request.host)){
        		prev.time = request.date;	
        		whale.history.search({text: request.host, startTime: 1483196400000, maxResults: 500}, function(data) {
					visit=0;
					data.forEach(function(page){
						visit+=page.visitCount;
   					});
				prev.count = visit;//countL.push(visit);
				whale.storage.sync.set({"loginList":L});
				whale.storage.sync.set({"current":prev});
    			});
        	}
        		
        	}
        	whale.storage.sync.set({"loginList":L});
        }
        
        }
        		
);




