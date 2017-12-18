/*
var bg = {
  auth: ""
}
*/


function showPageAction(tabId, changeInfo, tab) {
	if(tab.url.indexOf("https://my.sa.ucsb.edu/gold/StudentSchedule.aspx") == 0){
		chrome.pageAction.show(tabId);
	}
};

chrome.tabs.onUpdated.addListener(showPageAction);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    if (request.greeting == "event-info")
    {
      console.log("course-event message accepted by bg");
      getAuthTokenSilent();
			$.ajax({
        method: "POST",
        contentType: "application/json",
        url: "https://www.googleapis.com/calendar/v3/calendars/primary/events" + "?access_token=" + encodeURIComponent(bg.auth),
        data: request.event,
        success: function(){
          if (request.size == request.count)
          {
            chrome.tabs.create({url: "https://calendar.google.com/calendar/r/week/" + request.tabInfo});
          }
        }
      });
      sendResponse({farewell: "event-info handled"})
    }
  }
);

chrome.notifications.onClicked.addListener(function() {
    notificationClicked('start-auth');
});

getAuthTokenSilent();
