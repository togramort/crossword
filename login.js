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
function validateLogin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // здесь должна быть проверка логина и пароля на сервере
  if (username == "admin" && password == "password") {
    window.open("generator.html", "_self");
    return false;
  } else {
    alert("incorrect login or password ;(");
    return false;
  }
}

function openCrossword() {
  window.open("crossword.html", "_self");
}