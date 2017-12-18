

describe("get the recurrence", function() {
  it("return recurrence in api format", function() {
    expect(GetRecur("T R", {quarter: "Winter", year: "2018"}))
      .toEqual("RRULE:FREQ=WEEKLY;UNTIL=20180316T230000Z;BYDAY=TU,TH");
  })
});


describe("MilitaryTime function", function() {
  it("should convert a 12 hour time to 24 hour", function () {
    expect(MilitaryTime(["8:00", "AM"])).toEqual("08:00");
    expect(MilitaryTime(["12:30", "PM"])).toEqual("12:30");
    expect(MilitaryTime(["3:30", "PM"])).toEqual("15:30");
    expect(MilitaryTime(["12:45", "AM"])).toEqual("00:45");
  })
});

describe("event start time conversion", function() {
  it("should convert start time to api format", function() {
    expect(GetClassStart("9:30 AM-10:45 AM", "T", {quarter: "Winter", year: "2018"}))
      .toEqual("9:30 AM");
  })
});
