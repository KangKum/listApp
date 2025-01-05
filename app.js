//// YEAR AND MONTH
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;

// DEFAULT SETTING
function setCalendar(yy, mm) {
  const yearAndMonth = document.querySelector(".yearAndMonth");
  yearAndMonth.innerText = yy + "년 " + mm + "월";
}
setCalendar(year, month);
colorToday();
setDays();

//// COLOR TODAY
function colorToday() {
  const today = new Date();
  if (year === today.getFullYear() && month === today.getMonth() + 1) {
    document.querySelectorAll(".dayBlank")[new Date(year, month - 1, 1).getDay() + today.getDate() - 1].classList.add("today");
  } else {
    document.querySelectorAll(".dayBlank").forEach((blank) => {
      blank.classList.remove("today");
    });
  }
}

//// DAY
function setDays() {
  //입력된 날짜 초기화
  document.querySelectorAll(".dayBlank").forEach((blank) => {
    blank.innerText = "";
  });

  //당월 일수 찾기
  let numOfDays;
  if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
    numOfDays = 31;
  } else if (month === 4 || month === 6 || month === 9 || month === 11) {
    numOfDays = 30;
  } else {
    if (year % 4 === 0) {
      numOfDays = 29;
    } else {
      numOfDays = 28;
    }
  }

  // 당월 첫째날 찾기
  let firstDay = new Date(year, month - 1, 1).getDay();

  // 입력하기
  let i = 0;
  while (i < numOfDays) {
    document.querySelectorAll(".dayBlank")[firstDay + i].innerText = i + 1;
    i++;
  }
}

//// CHANGE MONTH
const btnRight = document.querySelector(".btnRight");
const btnLeft = document.querySelector(".btnLeft");
btnRight.addEventListener("click", nextMonth);
btnLeft.addEventListener("click", previousMonth);
function nextMonth() {
  if (month < 12) {
    month++;
  } else {
    month = 1;
    year++;
  }
  setCalendar(year, month);
  setDays();
  colorToday();
}
function previousMonth() {
  if (month > 1) {
    month--;
  } else {
    month = 12;
    year--;
  }
  setCalendar(year, month);
  setDays();
  colorToday();
}
