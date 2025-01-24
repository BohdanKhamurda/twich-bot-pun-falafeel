const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const path = 'data.json'; // Шлях до файлу для збереження даних

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
  { text: "Чиряк на жопі 😔", probability: 2 },
  { text: "Кіт 🐈", probability: 4 },
  { text: "КРАКЕН 🐙", probability: 1 },
  { text: "Пляшка різдвяного Опілля 🍺", probability: 3 },
];

// Завантаження даних при запуску сервера
let bestCatches = {};
if (fs.existsSync(path)) {
  try {
    const data = fs.readFileSync(path);
    if (data.length > 0) {
      bestCatches = JSON.parse(data);
    }
  } catch (error) {
    console.log('Помилка при зчитуванні JSON з файлу:', error);
    bestCatches = {}; // Якщо є помилка, ініціалізуємо порожній обʼєкт
  }
}

// Збереження даних у файл
function saveData() {
  fs.writeFileSync(path, JSON.stringify(bestCatches, null, 2));
}

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
        return res.send(`${username}, ви нічого не впіймали xddyou .`);
      }

      const weight = generateRandomWeight();
      const result = `${username} впіймав ${response.text} вагою ${weight} кг!`;

      // Оновлюємо найкращий улов
      if (
        !bestCatches[username] ||
        parseFloat(weight) > parseFloat(bestCatches[username].weight)
      ) {
        bestCatches[username] = { text: response.text, weight };
        saveData(); // Зберігаємо дані після оновлення
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

// Роут для команди !leaderboard
app.get('/leaderboard', (req, res) => {
  // Сортуємо улови за вагою у спадному порядку
  const sortedCatches = Object.entries(bestCatches)
    .sort(([, a], [, b]) => parseFloat(b.weight) - parseFloat(a.weight))
    .slice(0, 5); // Топ-5

  if (sortedCatches.length === 0) {
    return res.send("Ніхто ще нічого не впіймав!");
  }

  const leaderboard = sortedCatches
    .map(
      ([username, catchData], index) =>
        ` ${index + 1}. ${username}: ${catchData.text} вагою ${catchData.weight} кг`
    )
    .join("\n");

  res.send(`Топ-5 найкращих уловів:\n${leaderboard}`);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер працює на порту ${port}`);
});
