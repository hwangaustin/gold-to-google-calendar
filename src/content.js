/*
 *  @file   content.js
 *  @author Austin Hwang
 *  @date   November 3, 2017
 */
 var recurDayLUT = {
   'M': "MO",
   'T': "TU",
   'W': "WE",
   'R': "TH",
   'F': "FR"
 }
 var firstDayLUT = {
   "Fall": {
     'M': "2017-10-02T",
     'T': "2017-10-03T",
     'W': "2017-10-04T",
     'R': "2017-09-28T",
     'F': "2017-09-29T",
     "END": "20171208T230000Z"
   },
   "Winter": {
     'M': "2018-01-08T",
     'T': "2018-01-09T",
     'W': "2018-01-10T",
     'R': "2018-01-11T",
     'F': "2018-01-12T",
     "END": "20180316T230000Z"
   },
   "Spring": {
     'M': "2018-04-02T",
     'T': "2018-04-03T",
     'W': "2018-04-04T",
     'R': "2018-04-05T",
     'F': "2018-04-06T",
     "END": "20180608T230000Z"
   }
 }

var examEvents = [];
var lectureEvents = [];
var sectionEvents = [];


var EXAM_TAB_INFO;
var COURSE_TAB_INFO;

var CURRENT_QUARTER;
var COURSE_COUNT;
var COURSE_TITLES = [];
var COURSE_DESCRIPTIONS = [];

var EXAM_EVENTS = [];
var LECTURE_EVENTS = [];
var SECTION_EVENTS = [];

var WINTER_2018_START_DATE = new Date();
var SPRING_2018_START_DATE = new Date();


var QUARTER_LIST = document.getElementById("pageContent_quarterDropDown");
var EXAM_TABLE = document.getElementById("pageContent_FinalsGrid");
var COURSE_TABLE = document.getElementById("pageContent_CourseList");

/*
 *  Returns the course count for the selected quarter
 *  @return {integer} - number of currrent courses
 */
function getCourseCount() {
  numCourses = COURSE_TABLE.children[0].childElementCount - 1;
  return numCourses;
}

/*
 *  Return an object conatining the current quarter and year
 *  @return {object} - current quarter info
 *    @value {integer} - current quarter: 1(Fall), 2(Winter), 3(Spring), 4(Summer)
 *    @value {integer}  - current year (ie. 2017)
 */
 function getCurrentQuarter() {
   var quarterList = document.getElementById("pageContent_quarterDropDown");
   for (var i = 0; i < 4; i++) {
     if (quarterList[i].attributes.length == 2)
     {
       var quarterInfo = quarterList[i].innerText.split(' ');
       var currQuarter = {
         quarter: quarterInfo[0],
         year: quarterInfo[1]
       }
       return currQuarter;
     }
   }
   return null;
 }


function setTitlesDescriptions() {

  for(var i = 0; i < COURSE_COUNT; i++) {
    var currInfo = document.getElementById("pageContent_CourseList_CourseHeadingLabel_" + i);
    if (currInfo == null) {
      currInfo = document.getElementById("pageContent_CourseList_CourseHeadingLabelAlternate_" + i);
    }
    var titleDescription = currInfo.innerText.split(" - ");
    COURSE_TITLES.push(titleDescription[0]);
    COURSE_DESCRIPTIONS.push(titleDescription[1]);
  }
  //console.log(COURSE_TITLES);
  //console.log(COURSE_DESCRIPTIONS);
}


/*
 *  @param {String} time - format: "##:##_AM"
 */
function militaryTime(time) {
  var newTime = "";
  var timeSplit = time.split(' ');
  switch (timeSplit[1])
  {
    case "AM":
      if (timeSplit[0] == "12:00")
      {
        newTime = "00:00"
      }
      else
      {
        newTime = timeSplit[0];
      }
      break;
    case "PM":
      if (timeSplit[0].charAt(0)=='1' && timeSplit[0].charAt(1)=='2')
      {
        newTime = timeSplit[0];
      }
      else
      {
        var hourMinutes = timeSplit[0].split(':');
        var hour = parseInt(hourMinutes[0]);
        hour += 12;
        newTime = hour + ":" + hourMinutes[1];
      }
      break;
  }
  return newTime;
}

/*
 *	Called when the 'Add Courses' button is clicked
 */
function addCoursesClickHandler() {
	for(var i = 0; i < lectureEvents.length; i++) {
		chrome.runtime.sendMessage(
			{
        greeting: "AddCoursesClick",
			  event: lectureEvents[i],
		    count: lectureEvents.length,
		    curr: i
			},
			function(response) {
				console.log("lecture" + i + ' message sent\n');
			});
  }
  for(var i = 0; i < sectionEvents.length; i++) {
    chrome.runtime.sendMessage(
      {
        greeting: "AddCoursesClick",
        event: sectionEvents[i],
        count: sectionEvents.length,
        curr: i
      },
      function(response) {
        console.log("section" + i + ' message sent\n');
      });
  }
  chrome.runtime.sendMessage({greeting: "done"});
}

/*
 *	Create 'add_courses' button in GOLD's schedule page
 */
function createAddCourseBtn() {
	var coursesDiv = document.createElement('div');
	coursesDiv.className = 'classes';

	var cButton = document.createElement('button');
	cButton.type = 'button';
	cButton.id = 'courseBtn';
	cButton.innerText = 'Add Courses to Google Calendar';
	cButton.addEventListener('click', addCoursesClickHandler);

	coursesDiv.appendChild(cButton);
	COURSE_TABLE.appendChild(coursesDiv);

}


/*
 *	Called when the 'Add Exams' button is clicked
 */
function addExamsClickHandler() {
	for(var i = 0; i < COURSE_COUNT; i++) {
		chrome.runtime.sendMessage(
			{
        greeting: "AddExamsClick",
			  event: examEvents[i],
			  count: COURSE_COUNT,
			  curr: i+1,
        tabInfo: EXAM_TAB_INFO
			},
			function(response) {
				console.log("exam" + i + ' message sent\n');
			});
	}
}

/*
 *	Create 'add_exams' button in GOLD's schedule page
 */
function createAddExamBtn() {
	//var examTable = document.getElementById('pageContent_FinalsGrid');
	var examsDiv = document.createElement("div");
	examsDiv.className = "exams";

	var eBtn = document.createElement('button');
	eBtn.id = "examBtn";
	eBtn.type = "button";
	eBtn.innerText = "Add Exams to Google Calendar";
	eBtn.addEventListener("click", addExamsClickHandler);

	examsDiv.appendChild(eBtn);
	EXAM_TABLE.appendChild(examsDiv);
}

/*
 *
 */
function loadCourseEvents() {
  //
  for(var i = 0; i < COURSE_COUNT; i++)
  {
    var courseTimesTable = document.getElementById("pageContent_CourseList_MeetingTimesList_" + i);
    var numCourseEvents = courseTimesTable.children[0].childElementCount;

    for(var j = 0; j < numCourseEvents; j++)
    {
      var courseData = courseTimesTable.children[0].children[j];
      var courseDataCells = courseData.getElementsByClassName("clcellprimary");
      if(courseDataCells.length == 0) {
        courseDataCells = courseData.getElementsByClassName("clcellprimaryalt");
      }

      var days = courseDataCells[0].innerText.replace(/\s/g, "");
      //console.log(days);
      //console.log(days.length);

      var recur = recurDayLUT[days.charAt(0)];

      for (var k = 1; k < days.length; k++) {
        recur += ',' + recurDayLUT[days.charAt(k)];
      }

      //console.log(recur);

      var timeRange = courseDataCells[1].innerText.split('-');

      var startTime = militaryTime(timeRange[0]);
      var splitStartTime = startTime.split(':');
      var startHour = parseInt(splitStartTime[0]);
      var startMinute = parseInt(splitStartTime[1]);

      var endTime = militaryTime(timeRange[1].trim());
      var splitEndTime = endTime.split(':');
      var endHour = parseInt(splitEndTime[0]);
      var endMinute = parseInt(splitEndTime[1]);

      var location = courseDataCells[2].innerText;
      //console.log(location);

      //console.log((firstDayLUT[CURRENT_QUARTER.quarter])['M']);

      var currStartDateTime = (firstDayLUT[CURRENT_QUARTER.quarter][days.charAt(0)]) + startTime + ":00-07:00";
      var currEndDateTime = firstDayLUT[CURRENT_QUARTER.quarter][days.charAt(0)] + endTime + ":00-07:00";

      var newTitle;// = "testTitle";
      var currCourseEvent;
      if (j == 0) {
        newTitle = "Lecture: " + COURSE_TITLES[i];
        currCourseEvent = new CourseEvent(newTitle, currStartDateTime, currEndDateTime, location, recur, 9);
        LECTURE_EVENTS.push(currCourseEvent);
      }
      else if (j > 0) {
        newTitle = "Section: " + COURSE_TITLES[i];
        currCourseEvent = new CourseEvent(newTitle, currStartDateTime, currEndDateTime, location, recur, 2);
        SECTION_EVENTS.push(currCourseEvent);
      }
    }
  }

  for (var i = 0; i < LECTURE_EVENTS.length; i++) {
    var lectureEvent = {
      summary: LECTURE_EVENTS[i].title,
      description: COURSE_DESCRIPTIONS[i],
      colorId: LECTURE_EVENTS[i].colorId,
      start: {
        dateTime: LECTURE_EVENTS[i].startDateTime,
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: LECTURE_EVENTS[i].endDateTime,
        timeZone: 'America/Los_Angeles'
      },
      recurrence: [
        "RRULE:FREQ=WEEKLY;UNTIL=" + firstDayLUT[CURRENT_QUARTER.quarter]["END"] + ";BYDAY=" + LECTURE_EVENTS[i].recur
      ]
    }
    var event_json_string1 = JSON.stringify(lectureEvent);
    lectureEvents.push(event_json_string1);
  }
  for (var i = 0; i < SECTION_EVENTS.length; i++) {
    var sectionEvent = {
      summary: SECTION_EVENTS[i].title,
      description: COURSE_DESCRIPTIONS[i],
      colorId: SECTION_EVENTS[i].colorId,
      start: {
        dateTime: SECTION_EVENTS[i].startDateTime,
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: SECTION_EVENTS[i].endDateTime,
        timeZone: 'America/Los_Angeles'
      },
      recurrence: [
        "RRULE:FREQ=WEEKLY;UNTIL=" + firstDayLUT[CURRENT_QUARTER.quarter]["END"] + ";BYDAY=" + SECTION_EVENTS[i].recur
      ]
    }
    var event_json_string2 = JSON.stringify(sectionEvent);
    sectionEvents.push(event_json_string2);
  }

  //console.log(lectureEvents);
  //console.log(sectionEvents);

}


function getExamData() {
	var dataTables = document.getElementsByClassName('datatable');
	var tableCells3 = dataTables[1].getElementsByClassName('clcellprimary');
	var length3 = tableCells3.length - 2;

	var month;
	var day_nums = [];

	var year;
	var startTimes = [];
	var endTimes = [];
	var titles = [];
	var descriptions = [];

	// split 2nd cell into: Day, Date, startTime, and endTime
	for(var i=1; i<length3; i+=2){
		if(tableCells3[i].innerText != 'Contact Professor for Final Exam Information' && tableCells3[i].innerText != 'Unknown Date'){
			var firstSplit = (tableCells3[i].innerText).split(', ');
		var split = String(firstSplit[1]).split(' ');
			var month_ = split[0];

			switch (month_) {
				case 'December':
					month_ = '12';
					break;
				case 'March':
					month_ = '03';
					break;
				case 'June':
					month_ = '06';
					break;
				default:
					// ...
			}

			var day_num = split[1];
			var secondSplit = String(firstSplit[2]).split(' - ');
			var endTime = secondSplit[1];	// final endTime
			var endTimeSplit = endTime.split(' ');

      var finalEndTime = militaryTime(endTime);

			var thirdSplit = (secondSplit[0]).split(' ');
			var year_ = thirdSplit[0];		// final year
			var startTime = thirdSplit[1] + ' ' + thirdSplit[2];// final startTime
			var finalStartTime = militaryTime(startTime);

			month = month_;
			day_nums.push(day_num);

			year = year_;
			startTimes.push(finalStartTime);
			endTimes.push(finalEndTime);
		}
		else if(tableCells3[i].innerText == 'Contact Professor for Final Exam Information' || tableCells3[i].innerText == 'Unknown Date'){
			startTimes.push("none");
			endTimes.push("none");
		}
	}

	// for the titles
	for(var i=0; i<length3; i+=2){
		if(tableCells3[i+1].innerText != 'Contact Professor for Final Exam Information' && tableCells3[i+1].innerText != 'Unknown Date'){
      var courseNumTitleSplit = tableCells3[i].innerText.split(" - ");
      titles.push("Final Exam: " + courseNumTitleSplit[0]);
      descriptions.push(courseNumTitleSplit[1]);
		}
		else if(tableCells3[i+1].innerText == 'Contact Professor for Final Exam Information' || tableCells3[i+1].innerText == 'Unknown Date'){
			titles.push("none");
			descriptions.push("none");
		}
	}

  EXAM_TAB_INFO = {
    year: year,
    month: month,
    day: day_nums[0]
  };

	for(var i = 0; i < COURSE_COUNT; i += 1) {
		var event = {
			summary : titles[i],
			description : descriptions[i],
			start: {
				dateTime: year + '-' + month + '-' + day_nums[i] + 'T' + startTimes[i] + ':00-07:00',
				timeZone: 'America/Los_Angeles'
			},
			end: {
				dateTime: year + '-' + month + '-' + day_nums[i] + 'T' + endTimes[i] + ':00-07:00',
				timeZone: 'America/Los_Angeles'
			},
			colorId: "11"
		}
		var event_json_string = JSON.stringify(event);
		examEvents.push(event_json_string);
		//console.log(examEvents[i]);
	}
	//console.log('# of events: ' + examEvents.length);
}




// set the current quarter
CURRENT_QUARTER = getCurrentQuarter();
//console.log(CURRENT_QUARTER);

// set course count
COURSE_COUNT = getCourseCount();



createAddCourseBtn();
createAddExamBtn();
getExamData();
setTitlesDescriptions();
loadCourseEvents();
