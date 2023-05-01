let crosswordAll = [];
let gridAll = [];
const gridSize = 30;
const emptyCell = '_';
let grid = Array.from(Array( gridSize ), () => new Array(gridSize));

function getJson() {
    fetch('/getthisgrid')
      .then(response => response.json())
      .then(data => {
        gridAll = data;
      })
      .catch(error => console.error(error));

    fetch('/getthisclues')
    .then(response => response.json())
    .then(data => {
    crosswordAll = data;
    })
    .catch(error => console.error(error));
}

let slots = gridSize * gridSize;
let gridDiv = document.getElementById("grid");
let row = 0;
let column = 0;
for (let slot = 0; slot < slots; slot++) {
	let div = document.createElement("DIV");
	div.id = row + "_" + column;
	div.classList.add("slot");
    div.style.border =  '1px solid #e9e9e9';
    div.style.backgroundColor = '#e9e9e9';
	gridDiv.appendChild(div);
	column++;
	if (column >= gridSize ) {
		column = 0;
		row++;
	}
}
getJson();

function displayCrosswordPuzzle() {
    for (var i = 0; i < gridAll.length; ++i) {
        var row = gridAll[i].x;
        var column = gridAll[i].y;
        let slot = document.getElementById(row + "_" + column);
        if (gridAll[i].symbol != '_' && isNaN(gridAll[i].symbol)) {
            let input = document.createElement('input');
            input.type = 'text';
            input.className = 'inputLetter';
            input.id = 'i_' + row + '_' + column;
            input.maxLength = 1;
            input.style.width = slot.clientWidth + 'px';
            input.style.height = slot.clientHeight + 'px';
            slot.style.borderBottom =  '1px solid #9a8e9a';
            slot.style.borderRight =  '1px solid #9a8e9a';
            slot.style.backgroundColor = 'rgb(153, 204, 255)';
            slot.style.fontSize = '22px';
            slot.appendChild(input);
        } else if (!isNaN(gridAll[i].symbol)) {
            slot.innerHTML = gridAll[i].symbol;
            slot.style.backgroundColor = '#e9e9e9';
            slot.style.fontSize = '15px';
        } else {
            slot.innerHTML = "";
            slot.style.backgroundColor = '#e9e9e9';
        }
    }
    printClues();
}

function printClues() {
    let vert = document.getElementById("questionsV");
    let hor = document.getElementById("questionsH");
    vert.innerHTML = '';
    hor.innerHTML = '';
    vert.innerHTML = "<h3>vertical</h3>";
    hor.innerHTML = "<h3>horizontal</h3>";
    for (var i = 0; i < crosswordAll.length; ++i) {
        let textNode = crosswordAll[i].id + ". " + crosswordAll[i].clue;
        if (crosswordAll[i].dir == 'h') {
            hor.innerHTML += textNode + "<br><br>";
        } else if (crosswordAll[i].dir == 'v') {
            vert.innerHTML += textNode + "<br><br>";
        }
    }
}



function checkCrossword() {
    let allCorrect = true;
    for (var p = 0; p < gridAll.length; ++p) {
        if (gridAll[p].symbol != '_' && isNaN(gridAll[p].symbol)) {
            let i = gridAll[p].x;
            let j = gridAll[p].y;
            let temp = document.getElementById("i_" + i + "_" + j);
            let thisSlot = document.getElementById(i + "_" + j);
            let letter = temp.value;
            let res = gridAll[p].symbol;
            if (letter.toLowerCase() != res) {
                allCorrect = false;
                thisSlot.style.backgroundColor = "#FF0000";
            }
        }
    }

    if (allCorrect == true) {
        let slots = document.getElementsByClassName("slot");
        for (let i = 0; i < slots.length; i++) {
            let input = slots[i].getElementsByClassName("inputLetter");
            if (input.length > 0) {
                slots[i].style.backgroundColor = 'rgb(153, 255, 153)';
            }
        }
        alert("wooow congrats! al good ;)");
    } else if (allCorrect == false) {
        alert("naaah something wrong ;(");
    } else {
        alert ("unexpected error");
    }
}

function getCurrentSlot(x, y) {
    const currentSlot = gridAll.find(slot => slot.x === x && slot.y === y);
    if (!currentSlot) {
      return null;
    }
    const { x: currentX, y: currentY } = currentSlot;
    const nextSlotRight = gridAll.find(slot => slot.x === currentX && slot.y === currentY + 1);
    const nextSlotLeft = gridAll.find(slot => slot.x === currentX && slot.y === currentY - 1);
    const nextSlotDown = gridAll.find(slot => slot.x === currentX + 1 && slot.y === currentY);
    const nextSlotUp = gridAll.find(slot => slot.x === currentX - 1 && slot.y === currentY);
    return {
      current: currentSlot,
      right: nextSlotRight,
      left: nextSlotLeft,
      down: nextSlotDown,
      up: nextSlotUp,
    };
}

function getCurrentCursorPosition() {
    const input = document.activeElement;
    if (input == null) {
        return;
    }
    const [, row, column] = input.id.split('_');
    const x = parseInt(row, 10);
    const y = parseInt(column, 10);
    const slot = gridAll.find(slot => slot.x === x && slot.y === y);
    if (!slot) {
      return null;
    }
    return { x, y };
}

document.addEventListener('keydown', function(event) {
    const { x, y } = getCurrentCursorPosition();
    const { current, right, left, down, up } = getCurrentSlot(x, y);
    let nextSlot;

    if (event.key === 'ArrowRight' && right) {
      nextSlot = right;
    } else if (event.key === 'ArrowLeft' && left) {
      nextSlot = left;
    } else if (event.key === 'ArrowDown' && down) {
      nextSlot = down;
    } else if (event.key === 'ArrowUp' && up) {
      nextSlot = up;
    } else {
      return;
    }

    const nextInput = document.getElementById("i_" + nextSlot.x + "_" + nextSlot.y);
    if (nextInput) {
      nextInput.focus();
      nextInput.select();
    }

    event.preventDefault();
});