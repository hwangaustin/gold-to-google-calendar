/*
 *  @file   content.js
 *  @author Austin Hwang
 *  @date   November 3, 2017
 */

function Event(title, start, end, color) {
  this.title = title; 
  this.start = start;
  this.end = end;
  this.color = color;  
}

function CourseEvent(title, start, end, color, location, recur) {
  Event.call(this, title, start, end, color);
  this.location = location;
  this,recur = recur;
}

function ExamEvent(title, start, end, color) {
  Event.call(this, title, start, end, color);
}

var total_course_count;
var exam_events = [];
var course_events = [];


/*
 *
 */
function currentQuarter(quarter_list) {
  //var quarter_list = document.getElementById('pageContent_quarterDropdown');
  for(var i = 0; i < 4; i++) {
    if (quarter_list[i].selected == 'true')
    {
      return quarter_list[i].text; // ie. "Winter 2018"
    }
  }
}

/*
 *
 */
function totalCourseCount() {
  var course_list = document.getElementById('pageContent_CourseList');
  course_count = course_list.children[0].childElementCount - 1;
  return course_count;
}


/*
 *	Called when the 'Add Courses' button is clicked
 */
function addCoursesClickHandler() {
	for(var i = 0; i < course_events.length; i++) {
		chrome.runtime.sendMessage(
			{greeting: "add_exams_click", 
			 event: course_events[i],
			 count: course_events.length,
			 curr: i
			}, 
			function(response) {
				console.log("exam" + i + ' message sent\n');
			}
		);
	}
}

/*
 *	Create 'add_courses' button in GOLD's schedule page
 */
function createAddCourseBtn() {
	var courseTable = document.getElementById('pageContent_ScheduleGrid');
	var courses_div = document.createElement('div');
	courses_div.className = 'classes';

	var c_button = document.createElement('button');
	c_button.type = 'button';
	c_button.id = 'course_btn';
	c_button.innerText = 'Add Courses to Google Calendar';
	c_button.addEventListener('click', addCoursesClickHandler);

	courses_div.appendChild(c_button);
	courseTable.appendChild(courses_div);

}


/*
 *	Called when the 'Add Exams' button is clicked
 */
function addExamsClickHandler() {
	for(var i = 0; i < exam_events.length; i++) {
		chrome.runtime.sendMessage(
			{ greeting: "add_exams_click", 
			  event: exam_events[i], 
			  count: exam_events.length,
			  curr: i
			}, 
			function(response) {
				console.log("exam" + i + ' message sent\n');
			}
		);
	}
}

/*
 *	Create 'add_exams' button in GOLD's schedule page
 */
function createAddExamBtn() {
	var examTable = document.getElementById('pageContent_FinalsGrid');
	var exams_div = document.createElement('div');
	exams_div.className = 'exams';

	var e_button = document.createElement('button');
	e_button.id = 'exam_btn';
	e_button.type = 'button';
	e_button.innerText = 'Add Exams to Google Calendar';
	e_button.addEventListener('click', addExamsClickHandler);

	exams_div.appendChild(e_button);
	examTable.appendChild(exams_div);
}

function getCourseData() {

	var lectureDays = [];
	var lectureTimes = [];
	var lectureStartTimes = [];
	var lectureEndTimes = [];
	var lectureLocations = [];
	
	var sectionDays = [];
	var sectionTimes = [];
	var sectionStartTimes = [];
	var sectionEndTimes = [];
	var sectionLocations = [];

	for(var i = 0; i < 3; i++) {
		var courseMeetingTimes_ = document.getElementById("pageContent_CourseList_MeetingTimesList_" + i);
		console.log(courseMeetingTimes_);
		var cells = courseMeetingTimes_.getElementsByClassName("clcellprimary");
		console.log('cellsLenth:' + cells.length);
		if(cells.length == 0) {
			var cells = courseMeetingTimes_.getElementsByClassName("clcellprimaryalt");
		}
		
		lectureDays.push(cells[0].innerText);
		lectureTimes.push(cells[1].innerText);
		lectureLocations.push(cells[2].innerText);
		
		sectionDays.push(cells[3].innerText);
		sectionTimes.push(cells[4].innerText);
		sectionLocations.push(cells[5].innerText);
	}	

	for(var i = 0; i < 3; i++) {
		console.log('lectureDays: ' + lectureDays[i]);
		console.log('lectureTimes: ' + lectureTimes[i]);
		console.log('lectureLocations: ' + lectureLocations);
		console.log('sectionDays: ' + sectionDays);
		console.log('sectionTimes: ' + sectionTimes);
		console.log('sectionLocations: ' + sectionLocations);
		console.log('\n\n');
	}
}

function getExamData(examEvents) {
	var dataTables = document.getElementsByClassName('datatable');
	var tableCells1 = dataTables[0].getElementsByClassName('clcellprimary');
	var tableCells2 = dataTables[0].getElementsByClassName('clcellprimaryalt');
	// Final Exams Information
	var tableCells3 = dataTables[1].getElementsByClassName('clcellprimary');
	var length1 = tableCells1.length;
	var length2 = tableCells2.length;
	var length3 = tableCells3.length - 2;

	//var days = [];
	//var dates = [];
	
	//var months = [];
	var month;
	var day_nums = [];

	//var years = [];
	var year;
	var startTimes = [];
	var endTimes = [];
	var subjects = [];
	var descriptions = [];
	
	// split 2nd cell into: Day, Date, startTime, and endTime
	for(var i=1; i<length3; i+=2){
		if(tableCells3[i].innerText != 'Contact Professor for Final Exam Information' && tableCells3[i].innerText != 'Unknown Date'){
			var firstSplit = (tableCells3[i].innerText).split(', ');
			//var day = firstSplit[0]; 		// final day
			//var date = firstSplit[1];		// final date
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
			switch (endTimeSplit[1]) {
				case 'AM':
					switch (endTimeSplit[0]) {
						case '11:00':
							endTime = '11:00';
							break;
						default:
							// ...
					}
					break;
				case 'PM':
					switch (endTimeSplit[0]) {
						case '3:00':
						  endTime = '15:00';
						  break;
						case '7:00':
							endTime = '19:00';
							break;
						case '10:30':
							endTime = '22:30';
							break;
						default: 
							// ...
					}
					break;
				default:
					// ...
			}
			var thirdSplit = (secondSplit[0]).split(' ');
			var year_ = thirdSplit[0];		// final year
			var startTime = thirdSplit[1] + ' ' + thirdSplit[2];// final startTime
			
			switch (thirdSplit[2]) {
				case 'AM':
					switch (thirdSplit[1]) {
						case '7:00':
							startTime = '07:00';
							break;
						default:
							// ...
					}
					break;
				case 'PM':
					switch (thirdSplit[1]) {
						case '12:00':
						  	startTime = '12:00';
						  	break;
						case '4:00':
							startTime = '16:00';
							break;
						case '7:30':
							startTime = '19:30';
							break;
						default: 
							// ...
					}
					break;
				default:
					// ...
			}	
			
			//days.push(day);
			//dates.push(date);
			
			//months.push(month);
			month = month_;
			day_nums.push(day_num);

			//years.push(year);
			year = year_;
			startTimes.push(startTime);
			endTimes.push(endTime);
		}
		else if(tableCells3[i].innerText == 'Contact Professor for Final Exam Information' || tableCells3[i].innerText == 'Unknown Date'){
			//days.push("none");
			//dates.push("none");
			years.push("none");
			startTimes.push("none");
			endTimes.push("none");
		}
	}
	
	// for the subjects
	for(var i=0; i<length3; i+=2){
		if(tableCells3[i+1].innerText != 'Contact Professor for Final Exam Information' && tableCells3[i+1].innerText != 'Unknown Date'){
			subjects.push(tableCells3[i].innerText);
			descriptions.push(tableCells3[i].innerText + ": " + "FINAL EXAM");
		}
		else if(tableCells3[i+1].innerText == 'Contact Professor for Final Exam Information' || tableCells3[i+1].innerText == 'Unknown Date'){
			subjects.push("none");
			descriptions.push("none");
		}
	}
	console.log(subjects);
	console.log(descriptions);
	//console.log(days);
	//console.log(dates);
	
	console.log(month);
	console.log(day_nums);

	console.log(year);
	console.log(startTimes);
	console.log(endTimes);

	for(var i = 0; i < subjects.length; i += 1) {
		var event = {
			summary : subjects[i],
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
		console.log(examEvents[i]);
	}
	console.log('# of events: ' + examEvents.length);
}



createAddCourseBtn();
createAddExamBtn();
getExamData(exam_events);
getCourseData();