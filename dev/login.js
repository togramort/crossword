// получаем модальное окно и кнопку закрытия
var modal = document.getElementById("loginModal");
var closeBtn = document.getElementsByClassName("close")[0];

// require('dotenv').config();

// функция открытия модального окна
function showLogin() {
  modal.style.display = "block";
}

// функция закрытия модального окна
function closeLoginModal() {
  modal.style.display = "none";
}

function openCross() {
  window.open("generator.html", "_self");
}


// функция проверки логина и пароля


function openCrossword() {
  window.open("crossword.html", "_self");
}