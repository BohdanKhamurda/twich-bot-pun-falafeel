const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const responses = [
  { text: "Окунь 🐟", probability: 10 },
  { text: "Короп 🐟", probability: 10 },
  { text: "Сом 🐟", probability: 5 },
  { text: "Риба з раком 🦞🐟", probability: 5 },
  { text: "Кавун 🍉", probability: 3 },
  { text: "Кілька в томаті 🐟🍅", probability: 7 },
  { text: "Оселедець 🐟", probability: 8 },
  { text: "Нічого 😔", probability: 15 },
  { text: "Фігурка Тіфу 🎮", probability: 1 },
  { text: "Тунець 🐟", probability: 5 },
  { text: "Лосось 🐟", probability: 5 },
  { text: "Краб 🦀", probability: 3 },
  { text: "Бусік 🚐", probability: 2 },
  { text: "Форель 🐟", probability: 5 },
  { text: "Візок 🛒", probability: 3 },
  { text: "Банка цвяхів 🪛", probability: 4 },
  { text: "163 гри в Steam 🎮", probability: 1 },
  { text: "Пляшка ускаря 🥃", probability: 4 },
  { text: "Каблук 👠", probability: 6 },
  { text: "Білд для Elden Ring 🛡️⚔️", probability: 2 },
  { text: "ФОП третьої групи 📜", probability: 1 },
  { text: "Сандалі 🩴", probability: 5 },
  { text: "Акула 🦈", probability: 2 },
  { text: "Кіт 🐈", probability: 4 },
  { text: "КРАКЕН 🐙", probability: 1 },
  { text: "Пляшка різдвяного Опілля 🍺", probability: 3 },
];

app.get('/fish', (req, res) => {
  const totalProbability = responses.reduce((sum, item) => sum + item.probability, 0);
  const random = Math.random() * totalProbability;
  let cumulative = 0;

  for (const response of responses) {
    cumulative += response.probability;
    if (random < cumulative) {
      return res.send(response.text);
    }
  }

  res.send("Щось пішло не так!");
});

app.listen(port, () => {
  console.log(`Сервер працює на порту ${port}`);
});
