const faker = require("faker");


const generateUsers = (num) => {
  const house = [];

  for (let i = 0; i < num; i++) {
    const fullName = faker.address.zipcode();
    const ratings = faker.datatype.number({ min: 1, max: 5 });
    const reviews = faker.lorem.sentences(3);
    const location = faker.lorem.sentences(1);
    const password = faker.datatype.number();
    const email = faker.internet.email();
    const category = faker.commerce.department();
    const createdAt = faker.date.past();

    user.push({
      fullName,
      reviews,
      category,
      ratings,
      password,
      category,
      email,
      location,
      createdAt,
    });
  }

  return user;
};