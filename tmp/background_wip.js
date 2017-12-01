
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    if(request.greeting == "course-click" || request.greeting == "exam-click")
    {
      // Update the auth-token
      getAuthTokenSilent();
      var options = {
      	'url': 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      	'token': auth_token,
      	'event': request.event
      };
      // HTTP POST request to insert event in google calendar
      post(options);
    }
    else if (request.greeting == "course-done" || request.greeting == "exam-done")
    {
      alert("Events have been added to your Google Calendar.");
      chrome.tabs.create({ url: "https://calendar.google.com/calendar/r" });
    }
  }
);
