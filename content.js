function getPwdInputs() {
  var ary = [];
  var inputs = document.getElementsByTagName("input");
  for (var i=0; i<inputs.length; i++) {
    if (inputs[i].type.toLowerCase() === "password") {
      ary.push(inputs[i]);
    }
  }
  return ary;
}

var login = false;

function getlogout(){
	var flag=0;
	var include_arr = ["LOGOUT", "LOG OUT", "log out", "logout", "로그아웃", "SIGN OUT","sign out","Log Out","Logout"];
	include_arr.forEach(function(word){
		if(document.body.innerHTML.includes(word)) {flag=1;}
		//else if(document.body.innerText.includes(word)) {flag=1;}
	});
	return flag;
};	
if( getlogout()){     //getPwdInputs()[0])
	login = true
}
function getTime(){
	var d = new Date();
	return d.getTime()
}

function title(){
	return document.title;
}
function host(){
	return window.location.host;
}
whale.runtime.sendMessage(
	{status: login, date: getTime(), title: title(), host: host()}
);

