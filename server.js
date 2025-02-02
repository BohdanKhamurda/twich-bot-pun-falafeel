const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const path = 'data.json'; // Шлях до файлу для збереження даних
const roshenPath = 'roshen.json'; // Шлях до файлу для цукерок

// Масив з уловами
const responses = [
  { text: "Окунь 🐟", probability: 20 },
  { text: "Короп 🐟", probability: 20 },
  { text: "Сом 🐟", probability: 8 },
  { text: "Риба з раком 🦞🐟", probability: 8 },
  { text: "Кавун 🍉", probability: 3 },
  { text: "Кілька в томаті 🐟🍅", probability: 7 },
  { text: "Оселедець 🐟", probability: 8 },
  { text: "Нічого 😔", probability: 20 },
  { text: "Фігурка Тіфа 🎮", probability: 2 },
  { text: "Тунець 🐟", probability: 8 },
  { text: "Лосось 🐟", probability: 8 },
  { text: "Краб 🦀", probability: 3 },
  { text: "Бусік 🚐", probability: 2 },
  { text: "Форель 🐟", probability: 5 },
  { text: "Візок 🛒", probability: 3 },
  { text: "Банка цвяхів 🪛", probability: 4 },
  { text: "163 гри в Steam 🎮", probability: 1 },
  { text: "Пляшка ускаря 🥃", probability: 6 },
  { text: "Каблук 👠", probability: 9 },
  { text: "Білд для Elden Ring 🛡️⚔️", probability: 2 },
  { text: "ФОП третьої групи 📜", probability: 1 },
  { text: "Сандалі 🩴", probability: 5 },
  { text: "Акула 🦈", probability: 2 },
  { text: "Чиряк на жопі 😔", probability: 2 },
  { text: "Кіт 🐈", probability: 4 },
  { text: "КРАКЕН 🐙", probability: 1 },
  { text: "Пляшка різдвяного Опілля 🍺", probability: 3 },
  { text: "Кашель Жожима", probability: 8 },  
  //{ text: "Замовлення гри на стрім", probability: 1 },  
  { text: "Таймач Альфонсичу на 30 хвилин", probability: 1 },  
  { text: "Автотаймач на 5 хвилин", probability: 1 },  
  { text: "Гумова качка", probability: 7 },  
  { text: "Флеш", probability: 5 },  
  { text: "Стріт", probability: 4 },  
  { text: "Роял флеш", probability: 1 },  
  { text: "4 туза", probability: 4 },  
  { text: "Скриня скарбів", probability: 1 },  
  { text: "Квиток в Чікаґо", probability: 3 },  
  { text: "Навушники за 800 злотих", probability: 5 },  
  { text: "Привітання з іменинами", probability: 3 },
];

// Масив цукерок Roshen
const roshenCandies = [
  "Червоний мак",
  "Ліщина",
  "Кара-Кум",
  "Ромашка",
  "Київ вечірній",
  "Стріла подільська",
  "Bonny-Fruit",
  "Candy Nut",
  "Рачки",
  "Шалена бджілка",
  "Yummi Gummi",
  "Шипучка",
  "LolliPops",
  "Бім-Бом",
  "Еклер",
  "Барбарис",
  "Дюшес",
  "Молочна крапля",
  "Корівка",
  "Сливки-Ленивки",
  "Шоколапки",
  "Петро Олексійович Порошенко",
  "цукерка від АВК ICANT"
];

// Завантаження стану Roshen
let roshenData = {};
if (fs.existsSync(roshenPath)) {
  try {
    const data = fs.readFileSync(roshenPath);
    if (data.length > 0) {
      roshenData = JSON.parse(data);
    }
  } catch (error) {
    console.error('Помилка при зчитуванні стану Roshen:', error);
  }
}

// Збереження стану Roshen у файл
function saveRoshen() {
  fs.writeFileSync(roshenPath, JSON.stringify(roshenData, null, 2));
}

// Роут для команди !roshen
app.get('/roshen', (req, res) => {
  const username = req.query.username; // Ім'я користувача передається в запиті, наприклад ?username=Іван
  if (!username) {
    return res.status(400).send("Помилка: потрібно вказати ім'я користувача через ?username=Ім'я");
  }

  if (roshenData[username]) {
    return res.send(`😅 ${username}, ви вже отримали свою цукерку цього стріму: ${roshenData[username]}`);
  }

  const randomCandy = roshenCandies[Math.floor(Math.random() * roshenCandies.length)];
  roshenData[username] = randomCandy; // Зберігаємо цукерку для користувача
  saveRoshen();

  res.send(`🎉 ${username}, ви отримали цукерку: ${randomCandy}!`);
});

// Роут для скидання стану Roshen (адмін-команда)
app.get('/reset-roshen', (req, res) => {
  roshenData = {}; // Скидаємо всі дані
  saveRoshen();
  res.send("Стан команди !roshen для всіх користувачів було успішно скинуто!");
});

// Роут для команди !my-candy
app.get('/my-candy', (req, res) => {
  const username = req.query.username; // Ім'я користувача передається в запиті, наприклад ?username=Іван
  if (!username) {
    return res.status(400).send("Помилка: потрібно вказати ім'я користувача через ?username=Ім'я");
  }

  if (roshenData[username]) {
    return res.send(`🍬 ${username}, ваша цукерка: ${roshenData[username]}`);
  }

  res.send(`😕 ${username}, ви ще не отримували цукерку. Використовуйте команду !roshen, щоб отримати одну.`);
});

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
      var result = '';
      if(username == 'pendragon186') {
        result = `${username} впіймав Каблук 👠 вагою ${weight} кг!`;
      }
      else if (username == 'ALFONSYCH'){
        result = `${username} впіймав Автотаймач на 5 хвилин вагою ${weight} кг!`;
      }
      else {
        result = `${username} впіймав ${response.text} вагою ${weight} кг!`;
      }
      

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
