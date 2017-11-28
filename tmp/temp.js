var recurDayLUT = {
  'M': function() {return "MO"},
  'T': function() {return "TU"},
  'W': function() {return "WE"},
  'R': function() {return "TH"},
  'F': function() {return "FR"}
}
var firstDayLUT = {
  "Fall": {
    'M': function() {return "2017-10-02T"},
    'T': function() {return "2017-10-03T"},
    'W': function() {return "2017-10-04T"},
    'R': function() {return "2017-09-28T"},
    'F': function() {return "2017-09-29T"}
  }
  "Winter": {
    'M': function() {return "2018-01-08T"},
    'T': function() {return "2018-01-09T"},
    'W': function() {return "2018-01-10T"},
    'R': function() {return "2018-01-11T"},
    'F': function() {return "2018-01-12T"}
  }
  "Spring": {
    'M': function() {return "2018-04-02T"},
    'T': function() {return "2018-04-03T"},
    'W': function() {return "2018-04-04T"},
    'R': function() {return "2018-04-05T"},
    'F': function() {return "2018-04-06T"},
  }
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

function
