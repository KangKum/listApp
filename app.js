// Today Date
const today = new Date();
let thisYear = today.getFullYear(); //연도
let thisMonth = today.getMonth() + 1; //월
let thisDay = today.getDate(); //일
let day = today.getDay(); //요일
const week = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];

// FIND FIRST DAY
let firstDate;
let firstDay;
function calculateFirstday() {
  while (thisDay !== 1) {
    if (day >= 0) {
      day--;
    } else {
      day += 7;
    }
    thisDay--;
  }
  console.log("요일: " + week[day], "일: " + thisDay);
  firstDate = thisDay;
  firstDay = day;
}

calculateFirstday();

// SET CALENDAR
const calendar = document.querySelector(".calendar");
const firstLine = calendar.querySelector(".firstLine");
const secondLine = calendar.querySelector(".secondLine");
const thirdLine = calendar.querySelector(".thirdLine");
const fourthLine = calendar.querySelector(".fourthLine");
const fifthLine = calendar.querySelector(".fifthLine");
function setFirstDate() {
  if (day === 0) {
    firstLine.querySelector(".sun").innerText = thisDay;
  } else if (day === 1) {
    firstLine.querySelector(".mon").innerText = thisDay;
  } else if (day === 2) {
    firstLine.querySelector(".tue").innerText = thisDay;
  } else if (day === 3) {
    firstLine.querySelector(".wed").innerText = thisDay;
  } else if (day === 4) {
    firstLine.querySelector(".thu").innerText = thisDay;
  } else if (day === 5) {
    firstLine.querySelector(".fri").innerText = thisDay;
  } else if (day === 6) {
    firstLine.querySelector(".sat").innerText = thisDay;
  }
}

setFirstDate();

function setOtherDate() {}
