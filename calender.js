const { House } = require("./models/house"); // Update the path accordingly
const mongoose = require("mongoose");

function getCalendar(mm, house, res) {
  const date = new Date();
  const yy = date.getFullYear();
  let d = 1;
  let m = 1;
  let y = 1;
  let dy = 1;

  const day = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const month = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

  const ar = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  while (true) {
    if (d === 1 && m === mm && y === yy) {
      break;
    }

    if ((y % 4 === 0 && y % 100 !== 0) || y % 100 === 0) {
      ar[1] = 29;
    } else {
      ar[1] = 28;
    }
    dy++;
    d++;

    if (d > ar[m - 1]) {
      m++;
      d = 1;
    }

    if (m > 12) {
      m = 1;
      y++;
    }

    if (dy === 7) {
      dy = 0;
    }
  }

  let c = dy;

  if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
    ar[1] = 29;
  } else {
    ar[1] = 28;
  }

  console.log("예약 현황");
  console.log();
  console.log(`현재: ${yy}년 ${month[mm - 1]}`);
  console.log();

  for (let k = 0; k < 7; k++) {
    process.stdout.write("   " + day[k] + "   ");
  }

  console.log("\n");

  for (let j = 1; j <= ar[mm - 1] + dy; j++) {
    if (j > 6) {
      dy = dy % 7;
    }
  }

  let spaces = dy - 1;
  if (spaces < 0) spaces = 6;

  for (let i = 0; i < spaces; i++) {
    process.stdout.write("         ");
  }

  if (house.houseType === "PERSONAL") {
    // console.log(house.acceptanceInfo.room);
    const localDate = new Date(yy, mm - 1, 1);
    printPersonal(res, house, ar, mm, spaces, localDate);
  }
  if (house.houseType === "WHOLE") {
    printWhole(res, ar, mm, spaces);
  }
}

function printPersonal(res, house, ar, mm, spaces, localDate) {
  let i = 0;
  let j = 0;
  let k = 1;
  let currentRoom = 0;
  let index = 0;
  let isFirstLine = true;
  const reservationDates = getBookedDates(res);
  let dateCountMap = null;

  for (i = 1; i <= ar[mm - 1]; i++) {
    process.stdout.write(`${i}`.padEnd(9, " "));

    if ((i + spaces) % 7 === 0 || i === ar[mm - 1]) {
      console.log("\n");
      if (isFirstLine) {
        for (j = 0; j < spaces; j++) {
          process.stdout.write("         ");
        }
        isFirstLine = false;
      }
      for (; k <= i && k <= ar[mm - 1]; k++) {
        localDate.setDate(k);

        if (reservationDates === null) {
          currentRoom = house.acceptanceInfo.room;
        } else {
          dateCountMap = countDates(reservationDates);
          currentRoom = house.acceptanceInfo.room;
          for (const [key, value] of dateCountMap.entries()) {
            if (localDate.getTime() === new Date(key).getTime()) {
              currentRoom = house.acceptanceInfo.room - value;
              break;
            }
          }
        }
        process.stdout.write("    " + `${currentRoom}`.padEnd(5, " "));
      }
      k = i + 1;
      console.log("\n\n");
    }
  }
}

function printWhole(res, ar, mm, spaces) {
  let i = 0;
  let j = 0;
  let k = 1;
  let currentRoom = "◯";
  let index = 0;
  let isFirstLine = true;
  const reservationDates = getBookedDates(res);

  for (i = 1; i <= ar[mm - 1]; i++) {
    process.stdout.write(`${i}`.padEnd(9, " "));

    if ((i + spaces) % 7 === 0 || i === ar[mm - 1]) {
      console.log("\n");
      if (isFirstLine) {
        for (j = 0; j < spaces; j++) {
          process.stdout.write("         ");
        }
        isFirstLine = false;
      }
      for (; k <= i && k <= ar[mm - 1]; k++) {
        if (reservationDates.length <= 0) {
          currentRoom = "◯";
        }
        // else if (mm !== reservationDates[index].getMonth() + 1) {
        //   currentRoom = "◯";
        // }
        else if (k === reservationDates[index].getDate()) {
          currentRoom = "*";
          if (index !== reservationDates.length - 1) index++;
        } else currentRoom = "◯";

        process.stdout.write("    " + `${currentRoom}`.padEnd(5, " "));
      }
      k = i + 1;
      console.log("\n\n");
    }
  }
}

function countDates(dates) {
  let dateCountMap = new Map();
  dates.forEach((date) => {
    date.setHours(0, 0, 0, 0);
    const dateString = date.toISOString();
    dateCountMap.set(dateString, (dateCountMap.get(dateString) || 0) + 1);
  });
  return dateCountMap;
}

function getBookedDates(res) {
  let checkin = null;
  let checkout = null;
  const totalDates = [];

  for (let i = 0; i < res.length; i++) {
    checkin = new Date(res[i].time.checkin);
    checkout = new Date(res[i].time.checkout);
    while (checkin <= checkout) {
      // console.log(checkin)
      totalDates.push(new Date(checkin));
      checkin.setDate(checkin.getDate() + 1);
    }
  }

  totalDates.sort((a, b) => a - b);
  return totalDates;
}

module.exports = { getCalendar, getBookedDates };
