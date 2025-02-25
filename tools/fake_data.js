//TODO: USER FAKER
// async function generateFakeUsers() {
//   const users = [];
//   for (let i = 0; i < 20; i++) {
//     users.push({
//       email: faker.internet.email().replace(/@.+/, "@gmail.com"),
//       password: faker.internet.password(),
//       avatar: `https://source.unsplash.com/200x200/?portrait,person&random=${i}`,
//       phone: `0${faker.string.numeric(9, { allowLeadingZeros: false })}`,
//       gender: faker.helpers.arrayElement(["Male", "Female"]),
//       dateOfBirth: faker.date.birthdate({ min: 18, max: 50, mode: "age" }),
//       firstName: faker.person.firstName(),
//       lastName: faker.person.lastName(),
//       status: faker.helpers.arrayElement(["ACTIVE", "UNACTIVE"]),
//       isTwoFactorAuthenticationEnabled: faker.datatype.boolean(),
//     });
//   }

//   await User.insertMany(users);
//   console.log("✅ 20 Fake Users Created!");
// }

// generateFakeUsers();
