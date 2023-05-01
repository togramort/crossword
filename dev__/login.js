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
function checkLogin() {
  return new Promise(function(resolve, reject) {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    fetch('/superdupercheck')
      .then(response => response.json())
      .then(users => {
        var validUser = users.find(function(user) {
          return user.username === username && user.password === password;
        });
        if (validUser) {
          resolve(true);
        } else {
          reject("wrong login or password");
        }
      })
      .catch(error => {
        reject(error.message);
      });
  });
}

async function openCross() {
  try {
    var temp = await checkLogin();
    window.location.href = '/generator';
  } catch (error) {
    alert(error);
  }
}

function openCrossword() {
  window.location.href = '/crossword';
}