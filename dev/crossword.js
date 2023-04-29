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
        console.log("gridAll", gridAll);
      })
      .catch(error => console.error(error));

    fetch('/getthisclues')
    .then(response => response.json())
    .then(data => {
    crosswordAll = data;
    console.log("crossAll", crosswordAll);
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

function printGrid() {
    makeGrid();
    displayCrosswordPuzzle(grid);
}

function makeGrid() {
    for (let row = 0; row < gridSize; row++) {
        for (let column = 0; column < gridSize; column++) {
            grid[row][column] = emptyCell;
        }
    }
}

function displayCrosswordPuzzle(bestGrid) {
    console.log("INNNNNNN DIIIIIIISSSPL")
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