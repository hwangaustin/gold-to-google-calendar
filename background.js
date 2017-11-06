/*
 *  @file   background.js
 *  @author Austin Hwang
 *  @date   November 3, 2017
 */


var auth_token;

/**
 * Create a basic Desktop notification.
 *
 * @param {object} options
 *   @value {string} iconUrl - Image URL to display in notification.
 *   @value {string} title - Notification header.
 *   @value {string} message - Notification message.
 */
function createBasicNotification(options) {
    console.log('createBasicNotification() ... \n');
    var notificationOptions = {
        'type': 'basic',
        'iconUrl': options.iconUrl,
        'title': options.title,
        'message': options.message,
        'isClickable': true,
        //'requireInteraction': true,
    };
    chrome.notifications.create(options.id, notificationOptions, function(notificationId) {});
}

/**
 * Show a notification that prompts the user to authenticate their Google account.
 */
function showAuthNotification() {
  console.log('showAuthNotification() ... \n');
  var options = {
        'id': 'start-auth',
        'iconUrl': 'ucsb_logo.png',
        'title': 'Gold to Google Calendar',
        'message': 'Click here to authorize access to Google Calendar',
  };
  createBasicNotification(options);
}


/**
 * Triggered anytime user clicks on a desktop notification.
 */
function notificationClicked(notificationId){
    console.log('notificationClicked() ... \n');
    // User clicked on notification to start auth flow.
    if (notificationId === 'start-auth') {
        getAuthTokenInteractive();
    }
    clearNotification(notificationId);
}

/**
 * Clear a desktop notification.
 *
 * @param {string} notificationId - Id of notification to clear.
 */
function clearNotification(notificationId) {
    chrome.notifications.clear(notificationId, function(wasCleared) {});
}


/**
 * Get users access_token.
 *
 * @param {object} options
 *   @value {boolean} interactive - If user is not authorized ext, should auth UI be displayed.
 *   @value {function} callback - Async function to receive getAuthToken result.
 */
function getAuthToken(options) {
    chrome.identity.getAuthToken({ 'interactive': options.interactive }, options.callback);
}

/**
 * Get users access_token in background with now UI prompts.
 */
function getAuthTokenSilent() {
    getAuthToken({
        'interactive': false,
        'callback': getAuthTokenSilentCallback,
    });
}

/**
 * Get users access_token or show authorize UI if access has not been granted.
 */
function getAuthTokenInteractive() {
    getAuthToken({
        'interactive': true,
        'callback': getAuthTokenInteractiveCallback,
    });
}

/**
 * If user is authorized, ...
 *
 * @param {string} token - Users access_token.
 */
function getAuthTokenSilentCallback(token) {
    // Catch chrome error if user is not authorized.
    if (chrome.runtime.lastError) {
        showAuthNotification();
    } else {
        console.log("user is authorized (silent)\n");
        /*
        var options = {
          'url': 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          'token': token
        };
        post(options);
        */
        auth_token = token;
    }
}

/**
 * User finished authorizing, start getting Gmail count.
 *
 * @param {string} token - Current users access_token.
 */
function getAuthTokenInteractiveCallback(token) {
    console.log('getAuthTokenInteractiveCallback() ...');
    // Catch chrome error if user is not authorized.
    if (chrome.runtime.lastError) {
        showAuthNotification();
    } else {
        console.log("user is authorized (interactive)\n");
        /*
        var options = {
          'url': 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          'token': token
        };
        post(options);
        */
    }
}

/**
 * Make an authenticated HTTP POST request.
 *
 * @param {object} options
 *   @value {string} url - URL to make the request to. Must be whitelisted in manifest.json
 *   @value {string} token - Google access_token to authenticate request with.
 *   @value {object?} event - Event to be inserted
 */
function post(options) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", options.url + "?access_token=" + encodeURIComponent(options.token), true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    /*
    var params = 
    {
      summary: "Test Event",
      description: "...",
      start: {
        dateTime: "2017-11-04T09:00:00-07:00",
        timeZone: "America/Los_Angeles"
      },
      end: {
        dateTime: "2017-11-04T17:00:00-07:00",
        timeZone: "America/Los_Angeles"
      }
    };
    var paramsJsonString = JSON.stringify(params);
    console.log("paramsJsonString = " + paramsJsonString);
    */

    xhr.onload = function() {

    };
    xhr.onerror = function() {
      console.log("There was an error!");
    };
    xhr.send(options.event);
}

// add a check to see which notification was clicked ...
chrome.notifications.onClicked.addListener(function() {
    notificationClicked('start-auth');
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if(request.greeting == "add_exams_click")
        {
            console.log("add exams button click received\n");
            getAuthTokenSilent();
            var options = {
            	'url': 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            	'token': auth_token,
            	'event': request.event
            };
            post(options);
            if(request.curr == request.count - 1) {
                alert(request.count + ' exams have been added to your Google Calendar.');
                chrome.tabs.create({ url: "https://calendar.google.com/calendar/r" }); // use event data to open to the week of the exams
            }
        }
        else if(request.greeting == "add_courses_click")
        {
            console.log("add coourses button click received\n");
            getAuthTokenSilent();
            var options = {
                'url': 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                'token': auth_token,
                'event': request.event
            }
            post(options);
            if(request.curr == request.count - 1) {
                alert(request.count + ' courses have been added to your Google Calendar.');
                chrome.tabs.create({ url: "https://calendar.google.com/calendar/r" });
            }
        }
});

getAuthTokenSilent();