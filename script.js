const words = [
  {foreign: 'cupboard', translation: 'шкаф', example: 'The cupboard is made of oak.'},
  {foreign: 'telefon', translation: 'телефон', example: 'She spoke to him by telephone.'},
  {foreign: 'computer', translation: 'компьютер', example: 'He bought a new computer.'},
  {foreign: 'fireplace', translation: 'камин', example: 'She built a fire in the fireplace.'},
  {foreign: 'desk', translation: 'письменный стол', example: 'This desk is a little too low for me.'},
  {foreign: 'carpet', translation: 'ковер', example: 'There is a large carpet in the middle on the floor.'},
  {foreign: 'armchair', translation: 'кресло', example: 'He sat down in a armchair.'},
  {foreign: 'curtain', translation: 'занавеска', example: 'New curtains will cozy the room up.'},
  {foreign: 'sofa', translation: 'диван', example: 'The bed in each room turns into a comfortable sofa every day.'},
  {foreign: 'bed', translation: 'кровать', example: 'This bed is very soft and comfortable.'},
  {foreign: 'lamp', translation: 'лампа', example: 'My lamp shines brighter than a lantern.'},
  {foreign: 'bookcase', translation: 'книжный шкаф', example: 'My bookcase is overflowing with unnecessary magazines.'},
  {foreign: 'table', translation: 'стол', example: 'It is comfortable to eat at this table.'},
  {foreign: 'door', translation: 'дверь', example: 'When you go for a walk, close the door behind you.'},
  {foreign: 'window', translation: 'окно', example: 'A strong wind opened the window.'}
];

let currentWord = 0;
const selectedCards = [];

// Функция для обновления отображаемого слова
function updateWord() {
  const word = words[currentWord];
  document.querySelector('#card-front h1').textContent = word.foreign;
  document.querySelector('#card-back h1').textContent = word.translation;
  document.querySelector('#card-back span').textContent = word.example;
  document.querySelector('#current-word').textContent = currentWord + 1;
}

// Функция для переключения слов вперед/назад
function switchWord(direction) {
  currentWord += direction;
  // Блокировка стрелки "назад", если мы на первом слове
  if (currentWord <= 0) {
    currentWord = 0;
    document.querySelector('#back').disabled = true;
  } else {
    document.querySelector('#back').disabled = false;
  }
  // Блокировка стрелки "вперед", если на последнем слове
  if (currentWord >= words.length - 1) {
    currentWord = words.length - 1;
    document.querySelector('#next').disabled = true;
  } else {
    document.querySelector('#next').disabled = false;
  }
  updateWord();
}

// Обработчики событий для кнопок вперед/назад
document.querySelector('#back').addEventListener('click', () => switchWord(-1));
document.querySelector('#next').addEventListener('click', () => switchWord(1));

// Обновление слов при загрузке страницы
updateWord();

// Обработчик событий для переворачивания карточки
document.querySelector('.flip-card').addEventListener('click', function() {
  this.classList.toggle('active');
});

// Функция для перемешивания массива
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateWord() {
  const word = words[currentWord];
  document.querySelector('#card-front h1').textContent = word.foreign;
  document.querySelector('#card-back h1').textContent = word.translation;
  document.querySelector('#card-back span').textContent = word.example;
  document.querySelector('#current-word').textContent = currentWord + 1;
}

// Обработчик событий для кнопки "Перемешать слова"
document.querySelector('#shuffle-words').addEventListener('click', function() {
  shuffleArray(words);
  currentWord = 0; // Начинаем с первого слова в перемешанном массиве
  updateWord(); // Обновляем слово на карточке
});

updateWord();

// Обработчик событий для кнопки "Тестирование"
document.querySelector('#exam').addEventListener('click', startTest);

// Функция для начала тестирования
function startTest() {
  // Перемешиваем массив слов и создаем массив для карточек
  const shuffledWords = [...words];
  shuffleArray(shuffledWords);
  const cardsArray = shuffledWords.concat(shuffledWords.map(word => ({ foreign: word.translation, translation: word.foreign })));
  shuffleArray(cardsArray);

  // Очищаем предыдущие карточки
  const examContainer = document.querySelector('#exam-cards');
  examContainer.innerHTML = '';

  // Создаем карточки для тестирования
  cardsArray.forEach((cardData, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = cardData.foreign;
    card.dataset.translation = cardData.translation;
    card.dataset.index = index;
    examContainer.appendChild(card);

    // Обработчик клика по карточке
    card.addEventListener('click', function() {
      selectCard(this, cardData);
    });
  });

  // Показываем контейнер для тестирования и скрываем учебные карточки
  document.querySelector('.study-cards').classList.add('hidden');
  examContainer.classList.remove('hidden');
}

// Функция для выбора карточки
function selectCard(card, cardData) {
  // Если карточка уже выбрана или исчезла, ничего не делаем
  if (card.classList.contains('selected') || card.classList.contains('fade-out')) return;

  // Помечаем карточку как выбранную
  card.classList.add('selected');

  // Добавляем карточку в массив выбранных
  selectedCards.push({ card, cardData });

  // Если выбраны две карточки, проверяем их
  if (selectedCards.length === 2) {
    checkPair();
  }
}

// Функция для проверки пары карточек
function checkPair() {
  const [firstCard, secondCard] = selectedCards;

  // Если слово и перевод совпадают, убираем карточки
  if (firstCard.cardData.foreign === secondCard.cardData.translation || firstCard.cardData.translation === secondCard.cardData.foreign) {
    firstCard.card.classList.add('fade-out');
    secondCard.card.classList.add('fade-out');
    // Очищаем массив выбранных карточек
    selectedCards = [];
    // Проверяем, остались ли еще карточки
    checkCompletion();
  } else {
    // Если пара выбрана неверно, подсвечиваем вторую карточку красным
    secondCard.card.classList.add('wrong');
    // Убираем классы выбора через 500ms
    setTimeout(() => {
      firstCard.card.classList.remove('selected');
      secondCard.card.classList.remove('selected', 'wrong');
      selectedCards = [];
    }, 500);
  }
}

// Функция для проверки завершения тестирования
function checkCompletion() {
  const remainingCards = document.querySelectorAll('.card:not(.fade-out)');
  if (remainingCards.length === 0) {
    alert('Поздравляем! Вы успешно завершили проверку знаний.');
  }
}