const { House } = require("./models/house"); // Update the path accordingly
const mongoose = require("mongoose");

function getCalendar(mm, house) {
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

  console.log(`현재: ${yy}년 ${month[mm - 1]}`);

  for (let k = 0; k < 7; k++) {
    console.log("   " + day[k] +  "   ");
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
    console.log("         ");
  }

  if (house.houseType === "PERSONAL") {
    console.log("PERSONAL");
    //   this.printPersonal(house, ar, mm, spaces, localDate);
  }
  if (house.houseType === "WHOLE") {
    console.log("WHOLE");
    //   this.printWhole(house, ar, mm, spaces);
  }
}

function printPersonal(house, ar, mm, spaces, localDate) {
  let i = 0;
  let j = 0;
  let k = 1;
  let currentRoom = 0;
  let index = 0;
  let isFirstLine = true;
  const reservationDates = this.getBookedDates(house);
  let dateCountMap = null;

  for (i = 1; i <= ar[mm - 1]; i++) {
    process.stdout.write(`\x1b[0;1m${i.toString().padEnd(4)}     \x1b[0m`);

    if ((i + spaces) % 7 === 0 || i === ar[mm - 1]) {
      console.log("\n\n");
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
          dateCountMap = this.countDates(reservationDates);
          currentRoom = house.acceptanceInfo.room;
          for (const [key, value] of dateCountMap.entries()) {
            if (localDate.getTime() === key.getTime()) {
              currentRoom = house.acceptanceInfo.room - value;
              break;
            }
          }
        }
        process.stdout.write(`${currentRoom.toString().padStart(5)}    `);
      }
      k = i + 1;
      console.log("\n\n");
    }
  }
}

function printWhole(house, ar, mm, spaces) {
  let i = 0;
  let j = 0;
  let k = 1;
  let currentRoom = "◯";
  let index = 0;
  let isFirstLine = true;
  const reservationDates = this.getBookedDates(house);

  for (i = 1; i <= ar[mm - 1]; i++) {
    process.stdout.write(`\x1b[0;1m${i.toString().padEnd(4)}     \x1b[0m`);

    if ((i + spaces) % 7 === 0 || i === ar[mm - 1]) {
      console.log("\n\n");
      if (isFirstLine) {
        for (j = 0; j < spaces; j++) {
          process.stdout.write("         ");
        }
        isFirstLine = false;
      }
      for (; k <= i && k <= ar[mm - 1]; k++) {
        if (reservationDates === null) {
          currentRoom = "◯";
        } else if (mm !== reservationDates[index].getMonth() + 1) {
          currentRoom = "◯";
        } else if (k === reservationDates[index].getDate()) {
          currentRoom = "*";
          if (index !== reservationDates.length - 1) index++;
        } else currentRoom = "◯";

        process.stdout.write(`${currentRoom.toString().padStart(5)}    `);
      }
      k = i + 1;
      console.log("\n\n");
    }
  }
}

function countDates(dates) {
  const dateCountMap = new Map();
  for (const date of dates) {
    dateCountMap.set(date, (dateCountMap.get(date) || 0) + 1);
  }

  return new Map([...dateCountMap.entries()].sort((a, b) => a[0] - b[0]));
}

function getBookedDates(house) {
  if (house.reservationList.length === 0) {
    return null;
  }

  let checkin = null;
  let checkout = null;
  const totalDates = [];

  for (let i = 0; i < house.reservationList.length; i++) {
    checkin = new Date(house.reservationList[i].checkin);
    checkout = new Date(house.reservationList[i].checkout);

    let checkin_localDate = new Date(checkin.getFullYear(), checkin.getMonth(), checkin.getDate());
    const checkout_localDate = new Date(checkout.getFullYear(), checkout.getMonth(), checkout.getDate());

    while (checkin_localDate <= checkout_localDate) {
      totalDates.push(new Date(checkin_localDate));
      checkin_localDate.setDate(checkin_localDate.getDate() + 1);
    }
  }

  totalDates.sort((a, b) => a - b);
  return totalDates;
}

module.exports = { getCalendar };
