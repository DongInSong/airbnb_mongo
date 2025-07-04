const axios = require("axios");
const { getCalendar, getBookedDates } = require("./utils/calender");
console.log("client is running...");

const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const checkin = new Date(2023, 11, 11);
const checkout = new Date(2023, 11, 12);
const people = 6;
const houseType = "PERSONAL";

var recursiveAsyncReadLine = function () {
  console.log("   1. 숙소 조회      2. 상세 조회");
  console.log("   3. 예약           4. 예약 취소");
  console.log("   5. 마이페이지     6. 별점 작성");
  console.log("   0. 종료");

  rl.question("입력: ", async function (answer) {
    if (answer == "0") return rl.close();
    if (answer == "1") {
      await getAllHouses(checkin, checkout, people, houseType);
      recursiveAsyncReadLine();
    }

    if (answer == "2") {
      rl.question("숙소 아이디: ", async function (houseId) {
        await getHouseDetail(houseId);
        recursiveAsyncReadLine();
      });
    }
    if (answer == "3") {
      rl.question("숙소 아이디: ", async function (houseId) {
        rl.question("게스트 아이디: ", async function (guestId) {
          await postBookHouse(houseId, guestId, checkin, checkout, 2);
          recursiveAsyncReadLine();
        });
      });
    }
    if (answer == "4") {
      rl.question("예약 번호: ", function (reserveId) {
        deleteBookHouse(reserveId);
        recursiveAsyncReadLine();
      });
    }
    if (answer == "5") {
      rl.question("게스트 아이디: ", async function (guestId) {
        await getMyPage(guestId, "ALL");
        await getMyPage(guestId, "ONCOMING");
        await getMyPage(guestId, "TERMINATED");
        recursiveAsyncReadLine();
      });
    }
    if (answer == "6") {
      rl.question("게스트 아이디: ", async function (guestId) {
        rl.question("예약 번호: ", async function (reserveId) {
          await postComment(guestId, reserveId, 5, "너무 좋았습니다.");
          recursiveAsyncReadLine();
        });
      });
    }
  });
};

recursiveAsyncReadLine();

async function getAllHouses(checkin, checkout, people, houseType) {
  console.log("**** 조회 정보 ****");
  console.log("체크인   : " + checkin);
  console.log("체크아웃 : " + checkout);
  console.log("인원 수  : " + people + "명");
  console.log("숙소 유형: " + houseType);

  const res = await axios.get(`http://localhost:3000/findHouse/${checkin}/${checkout}/${people}/${houseType}`);
  for (var i = 0; i < res.data.length; i++) {
    printHouse(res.data[i]);
  }
}

async function getHouseDetail(houseId) {
  const res = await axios.get(`http://localhost:3000/houseDetail/${houseId}`);
  printHouse(res.data[0]);
  printAllReview(res.data[0]);
  getCalendar(12, res.data[0], res.data[1]);
}

async function postBookHouse(houseId, guestId, checkin, checkout, people) {
  const res = await axios.post(`http://localhost:3000/bookHouse/${houseId}/${guestId}/${checkin}/${checkout}/${people}`);
  console.log(res.data);
}

async function deleteBookHouse(reservationId) {
  try {
    await axios.delete(`http://localhost:3000/cancelReserve/${reservationId}`);
    console.log("예약번호 " + reservationId + " 취소 완료");
  } catch (error) {
    console.log(error);
  }
}

async function getMyPage(guestId, type) {
  try {
    const res = await axios.get(`http://localhost:3000/myPage/${guestId}/${type}`);
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
}

async function postComment(guestId, reserveId, star, comment) {
  try {
    const res = await axios.post(`http://localhost:3000/addComment/${guestId}/${reserveId}/${star}/${comment}`);
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
}

function printHouse(data) {
  var starAvg = 0;
  if (data.reviews.length > 0) {
    var starSum = 0;
    for (review of data.reviews) {
      starSum += review.star;
    }
    starAvg = starSum / data.reviews.length;
  }

  console.log(
    "------------------결과------------------\n" +
      "숙소명   : " +
      data.name +
      "\n" +
      "유형     : " +
      data.houseType +
      "\n" +
      "최대 인원: " +
      data.acceptanceInfo.people +
      "명" +
      "\n" +
      "평일 가격: " +
      data.cost.weekdays +
      "\n" +
      "주말 가격: " +
      data.cost.weekend +
      "\n" +
      "평균 리뷰: " +
      starAvg.toFixed(1) +
      "\n" +
      "----------------------------------------\n"
  );
}

function printAllReview(data) {
  console.log("------------------리뷰------------------\n");
  for (review of data.reviews) {
    console.log("별점   : " + review.star + "\n" + "코멘트  : " + review.comment + "\n");
  }
  console.log("----------------------------------------\n");
}
