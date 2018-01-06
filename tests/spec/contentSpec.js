
describe("Course Event Title Functions", function() {
  it("should retrieve a course department/number", function() {
    expect(GetCourseNumber("CMPSC 165A - ARTIF INTELLIGENCE")).toEqual("CMPSC 165A");
    expect(GetCourseNumber("CMPSC 170 - OPERATING SYSTEMS")).toEqual("CMPSC 170");
  });
  it("should retrieve the title of a course", function() {
    expect(GetCourseName("CMPSC 165A - ARTIF INTELLIGENCE")).toEqual("ARTIF INTELLIGENCE");
    expect(GetCourseName("CMPSC 170 - OPERATING SYSTEMS")).toEqual("OPERATING SYSTEMS");
  });
});

describe("Course Event Time Functions", function() {
  it("should retrieve the recurrence of a course", function() {
    expect(GetRecur("T R", "winter2018"))
      .toEqual("RRULE:FREQ=WEEKLY;UNTIL=20180316T230000Z;BYDAY=TU,TH");
  });
  it("should convert a course start time to api format", function() {
    expect(GetClassStart("9:30 AM-10:45 AM", ["T"], "winter2018"))
      .toEqual("2018-01-16T09:30:00-07:00");
  });
  it("should convert a course end time to api format", function() {
    expect(GetClassEnd("9:30 AM-10:45 AM", ["T"], "winter2018"))
      .toEqual("2018-01-16T10:45:00-07:00");
  });
});

describe("Exam Event Time Functions", function() {
  it("should convert an exam start time to api format", function() {
    expect(GetExamStart("Friday, January 12, 2018 12:00 PM - 3:00 PM"))
      .toEqual("2018-01-12T12:00:00-07:00");
  });
  it("should convert an exam end time to api format", function() {
    expect(GetExamEnd("Friday, January 12, 2018 12:00 PM - 3:00 PM"))
      .toEqual("2018-01-12T15:00:00-07:00");
  });
});


describe("MilitaryTime function", function() {
  it("should convert a 12 hour time to 24 hour", function () {
    expect(MilitaryTime(["8:00", "AM"])).toEqual("08:00");
    expect(MilitaryTime(["12:30", "PM"])).toEqual("12:30");
    expect(MilitaryTime(["3:30", "PM"])).toEqual("15:30");
    expect(MilitaryTime(["12:45", "AM"])).toEqual("00:45");
  });
});
