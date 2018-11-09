//Checks whether Finesse page exists.
var finesseExists = false;
chrome.tabs.query({ title: "*Cisco Finesse*" }, function (tabs) {
	var qtyTabs = tabs.length;
	var i;
	for(i=0;i<qtyTabs;i++){
		if(finesseExists || tabs[i].title.toString().includes("Cisco Finesse")){
			chrome.tabs.sendMessage(tabs[0].id, { action: "updateStatus" });
			finesseExists = true;
		}
	}
});

//Gets the status from the Finesse page.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if(request.action == "currentStatus"){
		var currentStatus = document.getElementById("currentStatus");
		currentStatus.innerHTML = request.currentstatus;
		$(document).ready(function() {
			if(request.currentstatus.toString().includes("Not Ready")){
				$('#selectStatus').val('NOTREADY');
			}else{
				$('#selectStatus').val('READY');				
			}
		});
	}
	if(request.action == "currentUser"){
		var currentUser = document.getElementById("currentUser");
		currentUser.innerHTML = request.currentuser;
	}
	if(request.action == "readyCounter"){
		chrome.storage.local.get(['readyTime'], function(result) {
			var currentTime = document.getElementById("currentTime");
			if(currentTime){
				var timeFormatted = new Date(result.readyTime * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0]
				currentTime.innerHTML = "Ready time total: <br>" + timeFormatted;
			}
		});
	}
});

//Sends the selected status.
$(document).ready(function() {
	var selectStatus = document.getElementById("selectStatus");
	$('#selectStatus').on("change", function(){
		var currentStatus = document.getElementById("currentStatus");
		currentStatus.innerHTML = '<img src="loading.gif" alt="loading"></img>';
		var selectedStatus = selectStatus.value.toString();
		chrome.tabs.query({ title: "*Cisco Finesse*" }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { action: "selectStatus", selectedstatus: selectedStatus });
		});
	});
});

//Launches when the DOM is ready.
$(document).ready(function() {
	//If Finesse exists. See code above.
	if(!finesseExists){
		var html = 	'<h1>Cisco Finesse not found</h1>'
			html +=	'<a id="launchFinesse" href="https://usgsovoice009.srv.volvo.com">Launch Cisco Finesse</a>'
		$('#divHelper').html(html);
		$('#launchFinesse').click(function () {
			chrome.runtime.sendMessage({ action: "launchFinesse" });
		});
	}
	chrome.storage.local.get(['readyTime'], function(result) {
		var currentTime = document.getElementById("currentTime");
		if(currentTime){
			var timeFormatted = new Date(result.readyTime * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0]
			currentTime.innerHTML = "Ready time total: <br>" + timeFormatted;
		}
	});
});