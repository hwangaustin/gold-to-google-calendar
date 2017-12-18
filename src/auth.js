
var bg = {
  auth: ""
}

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
        'requireInteraction': true,
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
        'iconUrl': '../img/ucsb_logo.png',
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
    if (chrome.runtime.lastError)
    {
        showAuthNotification();
    }
    else
    {
        console.log("user is authorized (silent)\n");
        bg.auth = token;
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
    if (chrome.runtime.lastError)
    {
        showAuthNotification();
    }
    else
    {
        console.log("user is authorized (interactive)\n");
        bg.auth = token;
    }
}
