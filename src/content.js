
/*
var content = {

}
console.log(content);
*/

/* edit****
 *  Return an object conatining the current quarter and year
 *  @return {object} - current quarter info
 *    @value {string} - quarter: Fall, Winter, Spring, Summer
 *    @value {string} - year: (ie. 2017)
 */
function GetCurrentQuarter() {
	var quarterDropDown = document.getElementById("ctl00_pageContent_quarterDropDown");
	for (var i = 0; i < quarterDropDown.length; i++) {
		if (quarterDropDown[i].selected)
		{
			var quarter = quarterDropDown[i].innerText.replace(" ", "");
			quarter = quarter.toLowerCase();
			return quarter;
		}
	}
}
console.log(GetCurrentQuarter());


function GetCourseNumber(title) {
	var courseTitle = title.split(" - ");
	return courseTitle[0];
}

function GetCourseName(title) {
	var courseTitle = title.split(" - ");
	return courseTitle[1];
}

function GetRecur(days, quarter) {
	var recurDays = days.split(" ");
	for (var i = 0; i < recurDays.length; i++) {
		recurDays[i] = recurDayLUT[recurDays[i]];
	}
	var recur = "RRULE:FREQ=WEEKLY;UNTIL=" + quarterLUT[quarter]["END"] + ";BYDAY=" + recurDays.join(",");
	//var recur = quarterLUT[quarter]["END"];
	return recur;
}

/*
 *	@param {array} time
 *		@value {string} time[0]: "9:30"
 *		@value {string} time[1]: "AM"
 */
function MilitaryTime(time) {
	var hourMin = time[0].split(":");
	hourMin[0] = parseInt(hourMin[0]);
	if (hourMin[0] != 12 && time[1] == "PM") {
		hourMin[0] += 12;
	}
	else if (hourMin[0] == 12 && time[1] == "AM") {
		hourMin[0] = 0;
	}
	hourMin[0] = hourMin[0].toString();
	hourMin[0] = hourMin[0].padStart(2, "0");
	return hourMin[0] + ":" + hourMin[1];
}

function GetClassStart(times, recur, quarter) {
	var firstDay = recur[0];
	if (quarter == "winter2018" && recur[0] == "M") {
		firstDay = recur[1];
	}
	var startTime = times.split("-");
	startTime = startTime[0].split(" ");
	startTime = MilitaryTime(startTime);
	var startDateTime = quarterLUT[quarter][firstDay] + startTime + ":00-07:00";
	return startDateTime;
}

function GetClassEnd(times, recur, quarter) {
	var firstDay = recur[0];
	if (quarter == "winter2018" && recur[0] == "M") {
		firstDay = recur[1];
	}
	var endTime = times.split("-");
	endTime = endTime[1].split(" ");
	endTime = MilitaryTime(endTime);
	var endDateTime = quarterLUT[quarter][firstDay] + endTime + ":00-07:00";
	return endDateTime;
}

// "Monday, March 19, 2018 12:00 PM - 3:00 PM"
function GetExamStart(date) {
	var start = date.replace(/,/g, "");
	start = start.replace("- ", "");
	start = start.split(" "); // ["Monday", "March", "19", "2018", "12:00", "PM", "3:00", "PM"]
	var startTime = [start[4], start[5]];
	startTime = MilitaryTime(startTime);
	var startDateTime = start[3] + "-" + monthLUT[start[1]] + "-" + start[2] + "T" + startTime + ":00-07:00";
	return startDateTime;
}

function GetExamEnd(date) {
	var end = date.replace(/,/g, "");
	end = end.replace("- ", "");
	end = end.split(" "); // ["Monday", "March", "19", "2018", "12:00", "PM", "3:00", "PM"]
	var endTime = [end[6], end[7]];
	endTime = MilitaryTime(endTime);
	var endDateTime = end[3] + "-" + monthLUT[end[1]] + "-" + end[2] + "T" + endTime + ":00-07:00";
	return endDateTime;
}

function LectureEvent(title, location, recur, times, quarter) {
	//this.id = "goldcourseevent" + quarter;
	this.summary = GetCourseNumber(title) + " - Lecture";
	this.colorId = "9"; // 1 - 11
	this.location = location;
	this.recurrence = [GetRecur(recur, quarter)];
	this.start = {
		dateTime: GetClassStart(times, recur.split(" "), quarter),
		timeZone: "America/Los_Angeles"
	};
	this.end = {
		dateTime: GetClassEnd(times, recur.split(" "), quarter),
		timeZone: "America/Los_Angeles"
	};
}

function SectionEvent(title, location, recur, times, quarter) {
	//this.id = "goldcourseevent" + quarter;
	this.summary = GetCourseNumber(title) + " - Section";
	this.colorId = "10"; // 1 - 11
	this.location = location;
	this.recurrence = [GetRecur(recur, quarter)];
	this.start = {
		dateTime: GetClassStart(times, recur.split(" "), quarter),
		timeZone: "America/Los_Angeles"
	};
	this.end = {
		dateTime: GetClassEnd(times, recur.split(" "), quarter),
		timeZone: "America/Los_Angeles"
	};
}

function ExamEvent(title, date, quarter) {
	//this.id = "goldfinalevent" + quarter;
	this.summary = GetCourseNumber(title) + " - Final Exam";
	this.colorId = "11";
	this.start = {
		dateTime: GetExamStart(date),
		timeZone: "America/Los_Angeles"
	};
	this.end = {
		dateTime: GetExamEnd(date),
		timeZone: "America/Los_Angeles"
	};
}

function GetCourseEvents() {
	var courseEvents = [];
	var currentQuarter = GetCurrentQuarter();
	var courseDivs = document.getElementsByClassName("scheduleItem");
	for (var i = 0; i < courseDivs.length - 1; i++)
	{
		var title = courseDivs[i].children[0].children[0].children[0].innerText; // "CMPSC 165A - ARTIF INTELLIGENCE"
		var infoDivs = courseDivs[i].getElementsByClassName("row session");
		var lectureLocation = infoDivs[0].children[4].children["0"].innerText; // "Location↵Psychology Building, Room 1924"
		var lectureRecur = infoDivs[0].children[1].innerText; // "Days↵T R"
		console.log(lectureRecur);
		var lectureTimes = infoDivs[0].children[3].innerText; // "Time↵12:30 PM-1:45 PM"
		var lecture = new LectureEvent(title, lectureLocation, lectureRecur, lectureTimes, currentQuarter);
		courseEvents.push(lecture);

		if (infoDivs.length > 1)
		{
			var sectionLocation = infoDivs[1].children[4].children[0].innerText; // "Buchanan Hall, Room 1920"
			var sectionRecur = infoDivs[1].children[1].innerText; // "T R"
			var sectionTimes = infoDivs[1].children[3].innerText; // "9:30 AM-10:45 AM"
			var section = new SectionEvent(title, sectionLocation, sectionRecur, sectionTimes, currentQuarter);
			courseEvents.push(section);
		}
	}
	return courseEvents;
}

function GetExamEvents() {
	var examEvents = [];
	var currentQuarter = GetCurrentQuarter();
	var examDivs = document.getElementsByClassName("row finalBlock");
	for (var i = 0; i < examDivs.length - 1; i++)
	{
		var title = examDivs[i].children[0].innerText; // "CMPSC 165A - ARTIF INTELLIGENCE"
		var date = examDivs[i].children[1].innerText; // "Monday, March 19, 2018 12:00 PM - 3:00 PM"
		if (date != "Contact Professor for Final Exam Information")
		{
			var exam = new ExamEvent(title, date, currentQuarter);
			examEvents.push(exam);
		}
	}
	return examEvents;
}

function SendEventsToBg(events, tab) {
	for (var i = 0; i < events.length; i++) {
		chrome.runtime.sendMessage(
			{
				greeting: "event-info",
				size: events.length,
				count: i + 1,
				event: JSON.stringify(events[i]),
				tabInfo: tab[0] + "/" + tab[1] + "/" + tab[2]
			},
			function(response) {
				console.log(response);
			}
		);
	}
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    if (request.greeting == "course-click")
    {
      console.log("course-click message accepted by content");
			// Get Course (Lecture and Section) info
			var courseEvents = GetCourseEvents();
			// Get calendar tab info
			var tab = quarterLUT[GetCurrentQuarter()]["courses"];
			// Send Course events to bg page
			SendEventsToBg(courseEvents, tab);
      sendResponse({farewell: "course-click handled"});
    }
    else if (request.greeting == "exam-click")
    {
      console.log("exam-click message accepted by content");
			// Get Exam info
			var examEvents = GetExamEvents();
			// Get calendar tab info
			var tab = quarterLUT[GetCurrentQuarter()]["final"];
			// Send Exam events to bg page
			SendEventsToBg(examEvents, tab);
      sendResponse({farewell: "exam-click handled"});
    }
    else if (request.greeting == "both-click")
    {
      console.log("both-click message accepted by content");
			// Get Lecture, Section, and Exam info
			var courseEvents = GetCourseEvents();
			var examEvents = GetExamEvents();
			// Get calendar tab info
			var tab = quarterLUT[GetCurrentQuarter()]["courses"];
			// Send Lecture, Section, and Exam events to bg page
			SendEventsToBg(courseEvents.concat(examEvents), tab);
			sendResponse({farewell: "both-click handled"});
    }
  }
);
