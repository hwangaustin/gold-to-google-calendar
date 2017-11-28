/*
 *  @file   event.js
 *  @author Austin Hwang
 *  @date   November 3, 2017
 */

class Event {
  constructor(title, startDateTime, endDateTime) {
    this.title = title; 
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
  }
}

class CourseEvent extends Event {
  constructor(title, startDateTime, endDateTime, location, recur, colorId) {
    super(title, startDateTime, endDateTime);
    this.location = location;
    this.recur = recur;
    this.colorId = colorId;
  }
}

class ExamEvent extends Event {
  constructor(title, startDateTime, endDateTime, location, colorId) {
    super(title, startDateTime, endDateTime);
    this.location = location;
    this.colorId = colorId;
  }
}