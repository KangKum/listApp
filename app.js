import { getFirestore, collection, doc, addDoc, setDoc, getDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
const db = getFirestore();

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
    let circleContainer = document.createElement("div");
    circleContainer.classList.add("circleContainer");
    let currentBlank = document.querySelectorAll(".dayBlank")[firstDay + i];
    currentBlank.innerText = i + 1;
    currentBlank.appendChild(circleContainer);
    i++;
  }

  markCircles();
  semiDate();
}

// 당월 총 일수 찾기
function findAllDays() {
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
  return numOfDays;
}

// // MARK CIRCLES
// async function markCircles() {
//   //파이어 베이스에 있는 문서들 배열에 담기기
//   const querySnapshot = await getDocs(collection(db, "content"));
//   let documentIds = [];
//   querySnapshot.forEach((doc) => {
//     documentIds.push(doc.id);
//   });

//   //달력에 날짜들 배열에 담기
//   const daysForCompare = [];
//   for (let i = 1; i <= findAllDays(); i++) {
//     daysForCompare.push(`${year}년${month}월${i}일`);
//   }

//   //비교해서 중복값 찾아내기
//   const markedDays = documentIds.filter((value) => daysForCompare.includes(value));

//   const dayBlanks = document.querySelectorAll(".dayBlank");
//   //달력에 표시하기 (단, 있으면 ㄴㄴ)
//   for (let j = 0; j < dayBlanks.length; j++) {
//     for (let k = 0; k < markedDays.length; k++) {
//       if (dayBlanks[j].innerText === markedDays[k].match(/월(.*?)일/)[1]) {
//         let abc = await getDoc(doc(db, "content", markedDays[k]));
//         let numOfGreenCircles = abc.data().numOfSuccess;
//         let numOfBlackCircles = abc.data().numOfItems - numOfGreenCircles;
//         drawCircles(numOfGreenCircles, numOfBlackCircles, dayBlanks[j]);
//       }
//     }
//   }
// }

// MARK CIRCLES (CHAT GPT)
async function markCircles() {
  // 파이어베이스에서 문서 ID 배열 가져오기
  const querySnapshot = await getDocs(collection(db, "content"));
  const documentIds = querySnapshot.docs.map((doc) => doc.id);

  // 달력 날짜 배열 생성
  const daysForCompare = Array.from({ length: findAllDays() }, (_, i) => `${year}년${month}월${i + 1}일`);

  // 중복값 필터링
  const markedDays = new Set(documentIds.filter((value) => daysForCompare.includes(value)));

  // DOM 요소 캐싱
  const dayBlanks = Array.from(document.querySelectorAll(".dayBlank"));

  // 파이어베이스 데이터 한 번에 가져오기
  const markedDayData = await Promise.all(
    Array.from(markedDays).map(async (day) => {
      const docSnapshot = await getDoc(doc(db, "content", day));
      return { id: day, data: docSnapshot.data() };
    })
  );

  // 달력 표시 (단, 있으면 X)
  dayBlanks.forEach((dayBlank) => {
    const dayText = dayBlank.innerText;
    const matchedDay = markedDayData.find(({ id }) => id.includes(`${month}월${dayText}일`));
    if (matchedDay) {
      const { numOfSuccess, numOfItems } = matchedDay.data;
      const numOfGreenCircles = numOfSuccess;
      const numOfBlackCircles = numOfItems - numOfGreenCircles;
      drawCircles(numOfGreenCircles, numOfBlackCircles, dayBlank);
    }
  });
}

function drawCircles(green, black, blank) {
  blank.querySelector(".circleContainer").innerHTML = "";
  for (let i = 0; i < green; i++) {
    let greenCircle = document.createElement("div");
    greenCircle.classList.add("greenCircle");
    blank.querySelector(".circleContainer").appendChild(greenCircle);
  }
  for (let j = 0; j < black; j++) {
    let blackCircle = document.createElement("div");
    blackCircle.classList.add("blackCircle");
    blank.querySelector(".circleContainer").appendChild(blackCircle);
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
  disColor();
  if (document.querySelector(".todolist").style.display === "block") {
    colorFirstDay();
  }
  listDating();
  clearContent();
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
  if (document.querySelector(".todolist").style.display === "block") {
    colorFirstDay();
  }
  listDating();
  clearContent();
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
      listDating();
      clearContent();
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
  clearContent();
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
  clearContent();
}
function listDating() {
  if (document.querySelector(".todolist").style.display === "block") {
    listDate.innerText = year + "년" + month + "월" + previousClicked.innerText + "일";
  }
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

// ADD CONTENT
const btnAddContent = document.querySelector(".btnAddContent");
btnAddContent.addEventListener("click", addContent);

function addContent() {
  const newItem = document.createElement("div");
  newItem.classList.add("item");
  const newContent = document.createElement("div");
  newContent.classList.add("content");
  contentInputable(newContent);
  newContent.addEventListener("blur", saveData);
  newContent.addEventListener("blur", markCircles);

  const newBtnCompleted = document.createElement("button");
  newBtnCompleted.classList.add("btnCompleted");
  newBtnCompleted.innerText = "V";
  newBtnCompleted.addEventListener("click", (btn) => {
    if (btn.target.parentNode.querySelector(".content").classList.contains("success")) {
      btn.target.parentNode.querySelector(".content").classList.remove("success");
    } else {
      btn.target.parentNode.querySelector(".content").classList.add("success");
    }
    saveData();
    markCircles();
  });

  const newBtnDelete = document.createElement("button");
  newBtnDelete.classList.add("btnDelete");
  newBtnDelete.innerText = "X";
  newBtnDelete.addEventListener("click", (btn) => {
    btn.target.parentNode.remove();
    deleteData();
    saveData();
    markCircles();
  });

  newItem.appendChild(newContent);
  newItem.appendChild(newBtnCompleted);
  newItem.appendChild(newBtnDelete);

  btnAddContent.parentNode.insertBefore(newItem, btnAddContent);
}

// CONTENT INPUTABLE
function contentInputable(div) {
  div.setAttribute("contenteditable", "true");
}
// CLEAR CONTENT
function clearContent() {
  let allItems = document.querySelectorAll(".item");
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].remove();
  }
  getData();
}

async function saveData() {
  let saveDate = document.querySelector(".todolist .listDate").innerText;
  let itemData = document.querySelectorAll(".item .content");
  let tempArray = [];
  let numOfSuccess = 0;
  for (let i = 0; i < itemData.length; i++) {
    let tempObj = {};
    tempObj.text = itemData[i].innerText;
    if (itemData[i].classList[1]) {
      tempObj.success = itemData[i].classList[1];
      numOfSuccess++;
    }
    tempArray.push(tempObj);
  }
  await setDoc(doc(db, "content", saveDate), {
    numOfItems: itemData.length,
    item: tempArray,
    numOfSuccess: numOfSuccess,
  });
}

async function getData() {
  if (document.querySelector(".todolist").style.display === "block") {
    let saveDate = document.querySelector(".todolist .listDate").innerText;
    const fireData = await getDoc(doc(db, "content", saveDate));
    if (fireData.data()) {
      for (let i = 0; i < fireData.data().numOfItems; i++) {
        addContent();
      }
      let allItemContents = document.querySelectorAll(".item .content");
      for (let i = 0; i < allItemContents.length; i++) {
        allItemContents[i].innerText = fireData.data().item[i].text;
        if (fireData.data().item[i].success) {
          allItemContents[i].classList.add(fireData.data().item[i].success);
        }
      }
    }
  }
}

async function deleteData() {
  let saveDate = document.querySelector(".todolist .listDate").innerText;
  await deleteDoc(doc(db, "content", saveDate));
}
