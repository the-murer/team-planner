import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

import UserModel from "../database/models/User.ts";
import MeetModel from "../database/models/Meet.ts";
import FormModel from "../database/models/Form.ts";
import CompanyModel from "../database/models/Company.ts";

dotenv.config();

const seedDatabase = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI não definida no arquivo .env");
  }

  await mongoose.connect(MONGO_URI, {});

  console.log("Conectado ao MongoDB!");

  // Limpando o banco
  await UserModel.deleteMany({});
  await MeetModel.deleteMany({});
  await FormModel.deleteMany({});
  await CompanyModel.deleteMany({});

  console.log("Banco limpo!");

  // Criando empresas
  const companies = [];

  for (let i = 0; i < 5; i++) {
    const company = await CompanyModel.create({
      name: faker.company.name(),
    });

    companies.push(company);
  }
  console.log("Empresas criadas!");

  // Criando usuários
  const users = [];

  for (let i = 0; i < 10; i++) {
    const company = faker.helpers.arrayElement(companies);
    const user = await UserModel.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      companies: [
        {
          name: company.name,
          companyId: company._id,
          isAdmin: faker.datatype.boolean(),
        },
      ],
    });

    users.push(user);
  }
  console.log("Usuários criados!");

  // Criando reuniões
  const meets = [];

  for (let i = 0; i < 10; i++) {
    const company = faker.helpers.arrayElement(companies);
    const meet = await MeetModel.create({
      name: faker.lorem.words(3),
      local: faker.location.city(),
      timeOfDay: faker.helpers.arrayElement(["Manhã", "Tarde", "Noite"]),
      weekDay: faker.helpers.arrayElement([
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
        "Domingo",
      ]),
      form: [
        {
          name: faker.lorem.sentence(),
          description: faker.lorem.sentence(),
          type: `string`,
        },
      ],
      companyId: company._id,
    });

    meets.push(meet);
  }
  console.log("Reuniões criadas!");

  // Criando formulários de respostas
  for (let i = 0; i < 10; i++) {
    const company = faker.helpers.arrayElement(companies);
    const user = faker.helpers.arrayElement(users);

    await FormModel.create({
      name: faker.lorem.words(2),
      sector: faker.commerce.department(),
      answers: [
        {
          name: faker.lorem.sentence(),
          answer: faker.lorem.sentence(),
        },
      ],
      userId: user._id,
      meetId: faker.database.mongodbObjectId(),
      companyId: company._id,
    });
  }
  console.log("Formulários criados!");

  mongoose.disconnect();
  console.log("Banco populado e conexão encerrada!");
};

seedDatabase().catch((err) => {
  console.error("Erro ao popular o banco:", err);
  mongoose.disconnect();
});
