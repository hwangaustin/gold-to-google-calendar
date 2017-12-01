
// Global Variables
var examEvents = [];
var lectureEvents = [];
var sectionEvents = [];


/*
 *	Called when the 'Add Courses' button is clicked
 */
function addCoursesClickHandler() {
	for(var i = 0; i < lectureEvents.length; i++) {
		chrome.runtime.sendMessage(
			{
        greeting: "course-click",
			  event: lectureEvents[i]
			},
			function(response) {
				console.log("lecture" + i + ' message sent\n');
			});
  }
  for(var i = 0; i < sectionEvents.length; i++) {
    chrome.runtime.sendMessage(
      {
        greeting: "course-click",
        event: sectionEvents[i]
      },
      function(response) {
        console.log("section" + i + ' message sent\n');
      });
  }
  chrome.runtime.sendMessage({greeting: "course-done"});
}

/*
 *	Create 'add_courses' button in GOLD's schedule page
 */
function createAddCourseBtn() {
  var courseTable = document.getElementById("pageContent_CourseList");
  var coursesDiv = document.createElement('div');
	coursesDiv.className = 'classes';

	var cButton = document.createElement('button');
	cButton.type = 'button';
	cButton.id = 'courseBtn';
	cButton.innerText = 'Add Courses to Google Calendar';
	cButton.addEventListener('click', addCoursesClickHandler);

	coursesDiv.appendChild(cButton);
	courseTable.appendChild(coursesDiv);
}


/*
 *	Called when the 'Add Exams' button is clicked
 */
function addExamsClickHandler() {
	for(var i = 0; i < examEvents.length; i++) {
		chrome.runtime.sendMessage(
			{
        greeting: "exam-click",
			  event: examEvents[i]
			},
			function(response) {
				console.log("exam" + i + " message sent");
			});
	}
  chrome.runtime.sendMessage({greeting: "exam-done"});
}

/*
 *	Create 'add_exams' button in GOLD's schedule page
 */
function createAddExamBtn() {
	var examTable = document.getElementById('pageContent_FinalsGrid');
	var examsDiv = document.createElement("div");
	examsDiv.className = "exams";

	var eBtn = document.createElement('button');
	eBtn.id = "examBtn";
	eBtn.type = "button";
	eBtn.innerText = "Add Exams to Google Calendar";
	eBtn.addEventListener("click", addExamsClickHandler);

	examsDiv.appendChild(eBtn);
	examTable.appendChild(examsDiv);
}

/*
 *  Returns the course count for the selected quarter
 *  @return {integer} - number of currrent courses
 */
function getCourseCount() {
  var courseTables = document.getElementById("pageContent_CourseList");
  var count = courseTables.children[0].children.length - 1;
  return count;
}

/*
 *  Return an object conatining the current quarter and year
 *  @return {object} - current quarter info
 *    @value {string} - current quarter: Fall, Winter, Spring, Summer
 *    @value {string}  - current year (ie. 2017)
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

/*
 *  Return an object conatining course titles and descriptions
 *  @return {object} - titleInfo
 *    @array {string} titles - course department and number
 *    @array {string} descrs - full course name
 */
function getCourseTitleInfo() {
  var titles = [];
  var descrs = [];
  for(var i = 0; i < count; i++) {
    var courseHeading = document.getElementById("pageContent_CourseList_CourseHeadingLabel_" + i);
    if (courseHeading == null)
    {
      courseHeading = document.getElementById("pageContent_CourseList_CourseHeadingLabelAlternate_" + i);
    }
    courseHeading.split(" - ");
    titles.push(courseHeading[0]);
    descrs.push(courseHeading[1]);
  }
  var titleInfo = {
    titles: titles,
    descrs: descrs
  }
  return titleInfo;
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


function getCourseEvents() {

}

function getExamEvents() {

}

function getAllEvents() {
  var currQuarter = getCurrentQuarter();
  var courseCount = getCourseCount();
  var allTitleInfo = getCourseTitleInfo();

  //var examLocations; //lectureLocation(same)

  //getCourseEvents(...);

  //getExamEvents(...);
}


getAllEvents();
