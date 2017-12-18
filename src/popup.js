

function onLoad() {
  document.getElementById("courseBtn")
    .addEventListener("click", addCoursesClickHandler);
  document.getElementById("examBtn")
    .addEventListener("click", addExamsClickHandler);
  document.getElementById("bothBtn")
    .addEventListener("click", addBothClickHandler);
}

function addCoursesClickHandler() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "course-click"}, function(response) {
      console.log(response.farewell);
    });
  });
}

function addExamsClickHandler() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "exam-click"}, function(response) {
      console.log(response.farewell);
    });
  });
}

function addBothClickHandler() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "both-click"}, function(response) {
      console.log(response.farewell);
    });
  });
}

document.addEventListener("DOMContentLoaded", onLoad);
