// получаем модальное окно и кнопку закрытия
var modal = document.getElementById("loginModal");
var closeBtn = document.getElementsByClassName("close")[0];

// функция открытия модального окна
function showLogin() {
  modal.style.display = "block";
}

// функция закрытия модального окна
function closeLoginModal() {
  modal.style.display = "none";
}

// функция проверки логина и пароля
const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  }).then(response => {
    if (!response.ok) {
      throw new Error('server error');
    }
  }).catch(error => {
    error ? console.log("oops: ", error) : console.log("all cool");
  })
});

function openCrossword() {
  window.open("crossword.html", "_self");
}