const moment = require("moment");

function formatOutput(date, count) {
  const dateObj = new Date(date);
  dateObj.setMinutes(0);
  dateObj.setSeconds(0);
  return dateObj.toUTCString() + " bucket -> " + count + "\n";
}

function parseDate(dateString) {
  const data = dateString.split(".");
  var momentDate = moment(data[0] + "+" + data[1].split("+")[1], 'YYYY-MM-DD HH:mm:ssZ');
  var jsDate = momentDate.toDate();
  return jsDate;
}

function isInSameBucket(current, prev) {
  return current.getYear() == prev.getYear() 
    && current.getMonth() == prev.getMonth() 
    && current.getDay() === prev.getDay()
    && current.getHours() === prev.getHours();
}

function aggregateIntoBuckets(allDates) {

  if(allDates.length === 0) {
    return "No results matching query parameters";
  }

  var output = "";
  var currentCount = 1;

  // deal with edge case - only one date
  if(allDates.length === 1) {
    output += formatOutput(allDates[0], currentCount);
  }

  // sort ascending
  allDates.sort();

  // compare to previous to see if in same or different bucket
  for(var i = 1; i < allDates.length; i++) {
    const current = new Date(allDates[i]);
    const prev = new Date(allDates[i - 1]);

    if(isInSameBucket(current, prev)) {
        currentCount++;
    } else {
      output += formatOutput(prev, currentCount);
      currentCount = 1;
    }

    // handle output for final bucket
    if(i === allDates.length - 1) {
      output += formatOutput(current, currentCount);
    }
  }

  return output;
}

exports.aggregateIntoBuckets = aggregateIntoBuckets;
exports.parseDate = parseDate;
exports.isInSameBucket = isInSameBucket;