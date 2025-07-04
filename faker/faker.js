const faker = require("faker");
const mongoose = require("mongoose");
const fs = require("fs");
const { Guest, House, Review } = require("../models");

const HouseType = {
  PERSONAL: "PERSONAL",
  WHOLE: "WHOLE",
};

const basics = ["화장지", "손과 몸을 씻을 수 있는 비누", "게스트당 수건 1장", "침대당 침구 1세트", "게스트당 베개 1개", "청소용품"];
const preferences = [
  "수영장",
  "와이파이",
  "주방",
  "무료 주차 공간",
  "자쿠지",
  "세탁기 또는 건조기",
  "에어컨 또는 난방",
  "셀프 체크인",
  "노트북 작업 공간",
  "반려동물 동반 가능",
];
const safeties = ["안전 편의시설", "일산화탄소 경보기", "화재 경보기", "소화기", "구급상자", "비상 대피 안내도 및 현지 응급 구조기관 번호"];
const accessibilities = [
  "접근성 편의시설",
  "계단이나 단차가 없는 현관",
  "폭 32인치/81cm 이상의 넓은 출입구",
  "폭 36인치/91cm 이상의 넓은 복도",
  "휠체어 접근 가능 욕실",
];

function getHouseName() {
  const data = fs.readFileSync("faker/houseName", "utf8").toString().split("\n");
  // const names = data.split("\n").map((line) => line.trim());
  return data;
}

function getHouseType() {
  const statusValues = Object.values(HouseType);
  const randomIndex = Math.floor(Math.random() * statusValues.length);
  return statusValues[randomIndex];
}

function getRandomNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAmountIn1000s(min, max) {
  const randomAmount = faker.finance.amount(min, max, 0); // 0으로 설정하여 소수점 이하 자릿수를 없앰
  const roundedAmount = Math.round(parseFloat(randomAmount) / 1000) * 1000;
  return roundedAmount;
}

async function getRandomUserId(db) {
  const randomUser = await Guest.aggregate([{ $sample: { size: 1 } }]);
  return randomUser.length > 0 ? randomUser[0]._id : null;
}

async function getRandomHouseId(db) {
  const randomHouse = await House.aggregate([{ $sample: { size: 1 } }]);
  return randomHouse.length > 0 ? randomHouse[0]._id : null;
}

generateDummyData = async (nGuest, nReviews) => {
  const guests = [];
  const houses = [];
  const reviews = [];
  const db = mongoose.connection.db;

  console.log("drop all collections");
  const collections = await db.listCollections().toArray();
  collections
    .map((collection) => collection.name)
    .forEach(async (collectionName) => {
      db.dropCollection(collectionName);
    });

  console.log("Generating Dummy data");

  for (let i = 0; i < nGuest; i++) {
    guests.push(
      new Guest({
        name: faker.internet.userName() + parseInt(Math.random() * 100),
        address: {
          city: faker.address.city(),
          street: faker.address.streetName(),
          zipCode: faker.address.zipCode(),
        },
      })
    );
  }

  var houseName = getHouseName();
  // name: { type: String, required: true },
  // address: { city: String, street: String, zipCode: String },
  // houseType: { type: String, enum: ["PERSONAL", "WHOLE"], default: "PERSONAL" },
  // acceptanceInfo: { room: Number, bath: Number, people: Number },
  // facility: { basic: String, preference: String, safety: String, accessibility: String },
  // cost: { weekdays: Number, weekend: Number },
  // reservation: { type: Types.ObjectId, ref: "Reservation" },

  for (let i = 0; i < houseName.length - 1; i++) {
    houses.push(
      new House({
        name: houseName[i],
        address: {
          city: faker.address.city(),
          street: faker.address.streetName(),
          zipCode: faker.address.zipCode(),
        },
        houseType: getHouseType(),
        acceptanceInfo: {
          room: getRandomNumberInRange(1, 5),
          bath: getRandomNumberInRange(1, 5),
          people: getRandomNumberInRange(5, 10),
        },
        facility: {
          basic: faker.random.arrayElement(basics),
          preference: faker.random.arrayElement(preferences),
          safety: faker.random.arrayElement(safeties),
          accessibility: faker.random.arrayElement(accessibilities),
        },
        cost: {
          weekdays: getRandomAmountIn1000s(100000, 200000),
          weekend: getRandomAmountIn1000s(150000, 250000),
        },
      })
    );
  }

  console.log("dummpy data inserting....");
  await Guest.insertMany(guests);
  await House.insertMany(houses);

  console.log(await getRandomUserId(db));

  for (let i = 0; i < nReviews; i++) {
    reviews.push(
      new Review({
        star: getRandomNumberInRange(3, 5),
        comment: faker.lorem.paragraph(),
        guest: await getRandomUserId(db),
        house: await getRandomHouseId(db),
      })
    );
  }
  await Review.insertMany(reviews);

  const reviewAll = await Review.find({});
  for (const review of reviewAll) {
    const house = await House.findById(review.house);
    house.reviews.push(review._id);
    house.save();
    const guest = await Guest.findById(review.guest);
    guest.reviews.push(review._id);
    guest.save();
  }
};

module.exports = { generateDummyData };
