const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Масив з уловами
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

// Зберігання найкращих уловів
const bestCatches = {};

// Функція для генерації випадкової ваги (чим важче, тим рідше)
function generateRandomWeight() {
  const random = Math.random();
  if (random < 0.5) return (Math.random() * 5).toFixed(2); // Від 0 до 5 кг (50%)
  if (random < 0.8) return (Math.random() * 10 + 5).toFixed(2); // Від 5 до 15 кг (30%)
  if (random < 0.95) return (Math.random() * 20 + 15).toFixed(2); // Від 15 до 35 кг (15%)
  return (Math.random() * 50 + 35).toFixed(2); // Від 35 до 85 кг (5%)
}

// Роут для команди !fish
app.get('/fish', (req, res) => {
  const username = req.query.username || "Гість"; // Отримуємо ім'я користувача з запиту
  const totalProbability = responses.reduce((sum, item) => sum + item.probability, 0);
  const random = Math.random() * totalProbability;
  let cumulative = 0;

  for (const response of responses) {
    cumulative += response.probability;
    if (random < cumulative) {
      if (response.text === "Нічого 😔") {
        return res.send(`${username}, на жаль, ви нічого не впіймали 😔.`);
      }

      const weight = generateRandomWeight();
      const result = `${username} впіймав ${response.text} вагою ${weight} кг!`;

      // Оновлюємо найкращий улов
      if (
        !bestCatches[username] ||
        parseFloat(weight) > parseFloat(bestCatches[username].weight)
      ) {
        bestCatches[username] = { text: response.text, weight };
      }

      return res.send(result);
    }
  }

  res.send("Щось пішло не так!");
});

// Роут для команди !bestcatch
app.get('/bestcatch', (req, res) => {
  const username = req.query.username || "Гість";
  const bestCatch = bestCatches[username];

  if (!bestCatch) {
    return res.send(`${username} ще не має жодного улову.`);
  }

  res.send(
    `${username} найкращий улов: ${bestCatch.text} вагою ${bestCatch.weight} кг!`
  );
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер працює на порту ${port}`);
});
