let words = [];
let word;
const gridSize = 30;
let crosswordAll;

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

function getWords() {
    var text = document.getElementById('answers').value;
    text = text.split('\n');
    var clues = document.getElementById('questions').value;
    clues = clues.split('\n');
    for (let i = 0; i < text.length; ++i) {
        words.push(text[i].toLowerCase());
    }

    crosswordAll = clues.map((clue, index) => {
        return {
            id: index + 1,
            word: words[index],
            clue: clue.trim(),
            dir: 'nn'
        };
    });

    words.sort(() => Math.random() - 0.5);
    makeGrid();
    wordPlacement();
}

const emptyCell = '_';
let grid = Array.from(Array( gridSize ), () => new Array(gridSize))
function makeGrid() {
    for (let row = 0; row < gridSize; row++) {
        for (let column = 0; column < gridSize; column++) {
            grid[row][column] = emptyCell;
        }
    }
}

const MULTI_VALUE_SEPARATOR = '|';
function placeWordH(grid, word, posX, posY) {
    for (var i = posY; i < word.length + posY; ++i) {
        grid[posX][i] = word[i - posY];
    }
    const index = crosswordAll.findIndex(wordObj => wordObj.word == word);
    if (!isNaN(grid[posX][posY - 1])) {
        grid[posX][posY - 1] += MULTI_VALUE_SEPARATOR + crosswordAll[index].id;
    } else {
        grid[posX][posY - 1] = crosswordAll[index].id;
    }
    return grid;
}

function placeWordV(grid, word, posX, posY) {
    for (var i = posX; i < word.length + posX; ++i) {
        grid[i][posY] = word[i - posX];
    }
    const index = crosswordAll.findIndex(wordObj => wordObj.word == word);
    if (!isNaN(grid[posX - 1][posY])) {
        grid[posX - 1][posY] += MULTI_VALUE_SEPARATOR + crosswordAll[index].id;
    } else {
        grid[posX - 1][posY] = crosswordAll[index].id;
    }
    return grid;
}

function canPlace(grid, word, x, y, idxWord) {
    var maybeH = true;
    var maybeV = true;
    var isVertical = false;
    var isHorizontal = false;
    var dir;

    if (x + 1 < grid.length && x - 1 > 0) {
        if (grid[x - 1][y] == '_' && grid[x + 1][y] == '_' && x - idxWord > 0) {
            isVertical = true;
            x = x - idxWord;
        } else if (y + 1 < grid.length && y - 1 > 0) {
            if (grid[x][y - 1] == '_' && grid[x][y + 1] == '_' && y - idxWord > 0) {
                isHorizontal = true;
                y = y - idxWord;
            }
        }
    } else if (y + 1 < grid.length && y - 1 > 0) {
        if (grid[x][y - 1] == '_' && grid[x][y + 1] == '_' && y - idxWord > 0) {
            isHorizontal = true;
            y = y - idxWord;
        }
    }

    if (x + word.length >= grid.length) {
        maybeV = false;
    }
    if (y + word.length >= grid[0].length) {
        maybeH = false;
    }

    var countV = 0;
    if (maybeV && isVertical) {
        for (var i = x; i < x + word.length + 1; ++i) {
            if (grid[i][y] == '_' && grid[i][y + 1] == '_' && grid[i][y - 1] == '_' && grid[x - 1][y] == '_') {
                ++countV;
            } else if (grid[i][y] == word[i - x]) {
                ++countV;
            } else {
                maybeV = false;
                break;
            }
        }
    }

    var countH = 0;
    if (maybeH && isHorizontal) {
    	for (var i = y; i < y + word.length + 1; ++i) {
            if (grid[x][i] == '_' && grid[x + 1][i] == '_' && grid[x - 1][i] == '_'  && grid[x][y - 1] == '_') {
                ++countH;
            } else if (grid[x][i] == word[i - y]) {
                ++countH;
            } else {
                maybeH = false;
                break;
            }
        }
    }

    if (maybeV && isVertical) {
        dir = 'v';
    } else if (maybeH && isHorizontal) {
        dir = 'h';
    } else {
        dir = 'nn';
    }

    return [word, x, y, dir];
}

function placeOnGrid(word, grid, x, y, dir) {
    if (dir == 'h') {
        grid = placeWordH(grid, word, x, y);
    } else if (dir == 'v') {
        grid = placeWordV(grid, word, x, y);
    }
    return grid;
}

function wordPlacement() {
    let maxWords = words.length;
	var countPlacedWords = 1;
    word = words.pop();
    let count = 1;
    placeWordH(grid, word, (gridSize / 2) - 5, (gridSize / 2) - Math.floor(word.length / 2) - 3);
    const indexx = crosswordAll.findIndex(wordObj => wordObj.word == word);
    crosswordAll[indexx].dir = 'h';
    while (count < maxWords && words.length > 0) {
        var placements = [];
        word = words.pop();
        for (var i = 0; i < word.length; i++) {
            for(var x = 0; x < grid.length; ++x) {
                for (var y = 0; y < grid[x].length; ++y) {
                    if (grid[x][y] == word[i]) {
                        placements.push(canPlace(grid, word, x, y, i));
                    }
                }
            }
        }
        for(var i = 0 ; i < placements.length; ++i){
            var word = placements[i][0];
            var x = placements[i][1];
            var y = placements[i][2];
            var dir = placements[i][3];
            if (dir != 'nn'){
                grid = placeOnGrid(word, grid, x, y, dir);
                ++countPlacedWords;
                const index = crosswordAll.findIndex(wordObj => wordObj.word == word);
                crosswordAll[index].dir = dir;
                break;
            }
        }
    }
    alert("использовано слов: " + countPlacedWords);
    displayCrosswordPuzzle(grid);
}


function displayCrosswordPuzzle(bestGrid) {
    for (let row = 0; row < gridSize; ++row) {
        for (let column = 0; column < gridSize; ++column) {
            let slot = document.getElementById(row + "_" + column);
            if(bestGrid[row][column] != '_' && isNaN(bestGrid[row][column])) {
                slot.innerHTML = bestGrid[row][column];
                slot.style.borderBottom =  '1px solid #9a8e9a';
                slot.style.borderRight =  '1px solid #9a8e9a';
                slot.style.backgroundColor = 'rgb(102, 178, 255)';
                slot.style.fontSize = '22px';
            } else if (!isNaN(bestGrid[row][column])) {
                slot.innerHTML = bestGrid[row][column];
                slot.style.border =  '1px solid #1c1b1b';
                slot.style.backgroundColor = '#e9e9e9';
                slot.style.fontSize = '15px';
            } else {
                slot.innerHTML = "";
                slot.style.border =  '1px solid #1c1b1b';
                slot.style.backgroundColor = '#e9e9e9';
            }
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
            hor.innerHTML += textNode + "<br>\n";
        } else if (crosswordAll[i].dir == 'v') {
            vert.innerHTML += textNode + "<br>\n";
        }
    }
}

function writeDataToJson() {  
    let data = [];
    console.log("gr in wr", grid)
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
          data.push({
            x: i,
            y: j,
            symbol: grid[i][j]
          });
        }
    }
    console.log("data in wr", data)
    const jsonData = JSON.stringify(data);
    fetch('/uploadcross', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: jsonData,
    })
    .then(response => response.text())
    .then(alert('successfully sent'))
    .catch(error => {
        console.error(error)
    });

    let clues = [];
    clues = crosswordAll.map(({id, clue, dir}) => ({id, clue, dir}));
    fetch('/uploadclues', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(clues),
    })
    .then(response => response.text())
    .catch(error => {
        console.error(error)
    });
}