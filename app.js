//// YEAR AND MONTH
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
const yearAndMonth = document.querySelector(".yearAndMonth");
let previousClicked = null;

// DEFAULT SETTING
function setCalendar(yy, mm) {
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

//// COLOR // DISCOLOR
function coloring() {
  previousClicked.classList.add("clickedDay");
}
function disColor() {
  if (previousClicked) {
    previousClicked.classList.remove("clickedDay");
  }
}

//// DAY
function setDays() {
  //입력된 날짜 초기화
  document.querySelectorAll(".dayBlank").forEach((blank) => {
    blank.innerText = "";
  });

  // 당월 첫째날 찾기
  let firstDay = new Date(year, month - 1, 1).getDay();

  // 입력하기
  let i = 0;
  while (i < findAllDays()) {
    document.querySelectorAll(".dayBlank")[firstDay + i].innerText = i + 1;
    i++;
  }

  semiDate();
}

// 당월 총 일수 찾기
function findAllDays() {
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
  return numOfDays;
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
  disColor();
  colorFirstDay();
  listDating();
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
  disColor();
  colorFirstDay();
  listDating();
}

function semiDate() {
  const leftDate = document.querySelector(".leftName");
  const rightDate = document.querySelector(".rightName");
  if (month === 1) {
    leftDate.innerText = "12월";
    rightDate.innerText = month + 1 + "월";
  } else if (month === 12) {
    leftDate.innerText = month - 1 + "월";
    rightDate.innerText = "1월";
  } else {
    leftDate.innerText = month - 1 + "월";
    rightDate.innerText = month + 1 + "월";
  }
}

//// TODOLIST
const todolist = document.querySelector(".todolist");
const allBlanks = document.querySelectorAll(".dayBlank");
const btnExit = document.querySelector(".btnFooter");
const listDate = document.querySelector(".listDate");
let listDateText;

allBlanks.forEach((blank) => {
  blank.addEventListener("click", (event) => {
    openTodolist();
    disColor();
    if (event.target.innerText !== "") {
      previousClicked = event.target;
      coloring();
      //here
      listDating();
    }
  });
});
btnExit.addEventListener("click", closeTodolist);

function openTodolist() {
  if (todolist.style.display === "block") {
  } else {
    todolist.style.display = "block";
  }
}

function closeTodolist() {
  todolist.style.display = "none";
  if (previousClicked) {
    previousClicked.classList.remove("clickedDay");
  }
  previousClicked = null;
}

const btnListLeft = document.querySelector(".btnListLeft");
const btnListRight = document.querySelector(".btnListRight");

function listLeft() {
  let currentOrder = Number(previousClicked.getAttribute("order"));
  let nextOrder = document.querySelector(`[order="${currentOrder - 1}"]`);
  if (previousClicked.innerText > 1) {
    disColor();
    previousClicked = nextOrder;
    coloring();
  } else {
    if (month === 1) {
      year--;
      month = 12;
    } else {
      month--;
    }
    setCalendar(year, month);
    setDays();
    colorToday();
    colorLastDay();
  }
  listDating();
}
function listRight() {
  let currentOrder = Number(previousClicked.getAttribute("order"));
  let nextOrder = document.querySelector(`[order="${currentOrder + 1}"]`);
  if (previousClicked.innerText < findAllDays()) {
    disColor();
    previousClicked = nextOrder;
    coloring();
  } else {
    if (month === 12) {
      year++;
      month = 1;
    } else {
      month++;
      //here
    }
    setCalendar(year, month);
    setDays();
    colorToday();
    colorFirstDay();
  }
  listDating();
}
function listDating() {
  listDate.innerText = year + "년" + month + "월" + previousClicked.innerText + "일";
}
btnListLeft.addEventListener("click", listLeft);
btnListRight.addEventListener("click", listRight);

function colorFirstDay() {
  disColor();
  const firstLine = document.querySelector(".firstLine").querySelectorAll(".dayBlank");
  const day = Array.from(firstLine).find((blank) => blank.innerText === "1");
  previousClicked = day;
  coloring();
}

function colorLastDay() {
  disColor();
  const fifthLine = document.querySelector(".fifthLine").querySelectorAll(".dayBlank");
  const day = Array.from(fifthLine).find((blank) => blank.innerText === findAllDays().toString());
  if (day) {
    previousClicked = day;
  } else {
    const sixthLine = document.querySelector(".sixthLine").querySelectorAll(".dayBlank");
    const day2 = Array.from(sixthLine).find((blank) => blank.innerText === findAllDays().toString());
    previousClicked = day2;
  }
  coloring();
}
