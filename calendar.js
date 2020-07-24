const DATE2020 = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAYS = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const SEASONS = {
    3: 'Spring',
    4: 'Spring',
    5: 'Spring',
    6: 'Summer',
    7: 'Summer',
    8: 'Summer',
    9: 'Autumn',
    10: 'Autumn',
    11: 'Autumn',
    12: 'Winter',
    1: 'Winter',
    2: 'Winter'
};

const log = console.log;

let nextBtn = document.querySelector('#next');
let prevBtn = document.querySelector('#prev');

let calHead = document.querySelector('#cal-head');
let calTable = document.querySelector('#cal-table');
let dayInfo = document.querySelector('#day-info');

var curMonth = 0;
var curDay = 0;
var curYear = 0;

function init() {
    let today = new Date();
    curMonth = today.getMonth() + 1;
    curDay = today.getDate();
    curYear = today.getFullYear();

    document.querySelector('#month').innerHTML = MONTHS[curMonth];

    // document.querySelector('#season-text').innerHTML = SEASONS[month];
    // document.querySelector('#day-text').innerHTML = `${today.getFullYear()}`;


    getCalender(curMonth);

    changeDay(today.getDate(), today.getDate());
    log("INIT " + curMonth);
    nextBtn.addEventListener("click", () => nextCal(curMonth));
    prevBtn.addEventListener("click", () => prevCal(curMonth));
    setInterval(getClock,1000);
}

function getClock() {
    const secondHand = document.querySelector(".sec-hand");
    const minHand = document.querySelector(".min-hand");
    const hourHand = document.querySelector(".hour-hand");


    const date = new Date();
    const sec = date.getSeconds();
    const min = date.getMinutes();
    const hour = date.getHours();
    // 각도 구하기. transform이기 때문에 +90 (왜 height로 안한건지는 모르겠음 transform위치 맞추기 어려워서 그런듯.)
    secondHand.style.transform = `rotate(${(sec/60)*360+90}deg)`;
    minHand.style.transform = `rotate(${(min/60)*360+90}deg)`;
    hourHand.style.transform = `rotate(${(hour/12)*360+90}deg)`;
}

function getDateInfo(day) {
    let date = new Date(`${curYear}-${curMonth}-${curDay}`);
    document.querySelector('#month').innerHTML = MONTHS[curMonth];
    document.querySelector('#season-text').innerHTML = SEASONS[curMonth];
    document.querySelector('#year-text').innerHTML = curYear;
    document.querySelector('#month-day-text').innerHTML = `${curMonth} .${day},`;
    document.querySelector('#week-text').innerHTML = `${DAYS[date.getDay() + 1]},`;
}

// 객체를 만들어도 되겠다.
function nextCal(month) {
    let curCal = document.getElementById(`m${month}`);
    curCal.parentElement.removeChild(curCal);
    getCalender(++curMonth > 12 ? curMonth -= 12 : curMonth);
    changeDay(1);
}

function prevCal(month) {
    let curCal = document.getElementById(`m${month}`);
    curCal.parentElement.removeChild(curCal);
    getCalender(--curMonth < 1 ? curMonth += 12 : curMonth);
    changeDay(1);
}

function getToday() {
    let today = new Date();
    getCalender(today.getMonth + 1);
    changeDay(today.getDate());
}

function changeDay(nDay) {
    // log(curDay+" "+nDay);
    let preDay = document.getElementById(`${curDay}`);
    preDay.style.backgroundColor = preDay.parentNode.style.color;
    let nextDay = document.getElementById(`${nDay}`);
    nextDay.style.backgroundColor = "#77878C";
    curDay = nDay;
    getDateInfo(curDay);
}


function getCalender(month) {

    let monthDays = DATE2020[month]; // 월별로 몇일이 있는지
    let firstDayWeek = new Date(`2020-${month}-1`).getDay(); // 월마다 첫 날이 무슨요일인지 숫자
    let rows = Math.ceil((monthDays + firstDayWeek) / 7); // 월마다 row가 몇개여야 하는지
    let calBody = document.createElement('tbody');
    calBody.style.color = "white";
    calBody.style.fontWeight = "600"
    calBody.id = `m${month}`;

    let firstRowTr = document.createElement('tr');
    for (let firstRow = 1; firstRow <= 7; firstRow++) {
        let firstRowTd = document.createElement('td');
        if (firstRow <= firstDayWeek) {
            firstRowTd.innerHTML = "";
            firstRowTd.onclick = () => prevCal(curMonth);
        }
        else {
            firstRowTd.innerHTML = `${firstRow - firstDayWeek}`;
            firstRowTd.id = `${firstRow - firstDayWeek}`;
            firstRowTd.onclick = () => changeDay(`${firstRow - firstDayWeek}`);
        }
        // firstRowTd.innerHTML = firstRow <= firstDayWeek ? "" : `${firstRow - firstDayWeek}`;
        firstRowTr.appendChild(firstRowTd);
    }
    calBody.appendChild(firstRowTr);

    for (let row = 1; row < rows; row++) {
        let rowTr = document.createElement('tr');

        for (let col = 1; col <= 7; col++) {
            let day = ((7 - firstDayWeek) + (7 * (row - 1)) + col);
            let rowTd = document.createElement('td');

            if (day > monthDays) {
                rowTd.innerHTML = "";
                rowTd.onclick = () => nextCal(curMonth);
            }
            else {
                rowTd.innerHTML = `${day}`;
                rowTd.id = `${day}`;
                rowTd.onclick = () => changeDay(`${day}`);
            }

            rowTr.appendChild(rowTd);
        }
        calBody.appendChild(rowTr);
    }
    calBody.style.minWidth = calHead.offsetWidth;
    calTable.appendChild(calBody);


    // document.querySelector('.clock').style.height = 
    // `${document.querySelector('#info').offsetHeight- 
    // document.querySelector('#day').offsetHeight
    // - document.querySelector('#time').offsetHeight}px`;
    // document.getElementById('time').style.height = calHead.offsetHeight+calTable.offsetHeight - document.getElementById("day").offsetHeight;
    // log(calBody.offsetHeight);
    let timInfHei = document.querySelector('#time').offsetHeight;
    let dayInfHei = document.querySelector('#day').offsetHeight;

    // document.querySelector('#info-section').style.height = 
    // `${calSecHei};`
    let tHeight = calHead.offsetHeight + calBody.offsetHeight;
    document.querySelector('.clock').style.height = `${tHeight - timInfHei - dayInfHei - 20}px`;
    document.querySelector('.clock').style.width = `${tHeight - timInfHei - dayInfHei - 20}px`;

    // log(calHead.offsetHeight+calBody.offsetHeight);
    // log(calSecHei);
    // log(document.querySelector('.clock').offsetHeight);
    // log(infSecHei);
    // log(timInfHei);
    // log(dayInfHei);
}

init();

