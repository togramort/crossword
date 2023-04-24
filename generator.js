let words = [];
let word;
const gridSize = 30;

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
    text = text.split('\n')
    for (let i = 0; i < text.length; ++i) {
        words.push(text[i])
    }
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

function placeWordH(grid, word, posX, posY) {
    for (var i = posY; i < word.length + posY; ++i) {
        grid[posX][i] = word[i - posY];
    }
    return grid;
}

function placeWordV(grid, word, posX, posY) {
    for (var i = posX; i < word.length + posX; ++i) {
        grid[i][posY] = word[i - posX];
    }
    return grid;
}

function canPlace(grid, word, x, y, idxWord) {
    var maybeH = true;
    var maybeV = true;
    var isVertical = false;
    var isHorizontal = false;
    var dir;

    if (x + 1 < grid.length) {
        if (grid[x - 1][y] == '_' && grid[x + 1][y] == '_') {
            isVertical = true;
            x = x - idxWord;
        } else if (y + 1 < grid.length) {
            if (grid[x][y - 1] == '_' && grid[x][y + 1] == '_') {
                isHorizontal = true;
                y = y - idxWord;
            }
        }
    } else if (y + 1 < grid.length) {
        if (grid[x][y - 1] == '_' && grid[x][y + 1] == '_') {
            isHorizontal = true;
            y = y - idxWord;
        }
    }

    if (x + word.length > grid.length) {
        maybeV = false;
    }
    if (y + word.length > grid[0].length) {
        maybeH = false;
    }

    var countV = 0;
    if (maybeV && isVertical) {
      for (var i = x; i < x + word.length + 1; ++i) {
            if (grid[i][y] == '_' && grid[i][y + 1] == '_' && grid[i][y - 1] == '_') {
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
            if (grid[x][i] == '_' && grid[x + 1][i] == '_' && grid[x - 1][i] == '_'  ) {
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
	var countPlacedWords = 0;
    word = words.pop();
    let count = 1;
    var amount = 0;
    placeWordH(grid, word, (gridSize / 2) - 5, (gridSize / 2) - Math.floor(word.length / 2) - 4);
    while (count < maxWords && words.length > 0) {
        var placements = [];
        word = words.pop();
        for(var letter in word) {
            for(var x = 0; x < grid.length; ++x) {
                for (var y = 0; y < grid[x].length; ++y) {
                    if (grid[x][y] == word[letter]) {
                        placements.push(canPlace(grid, word, x, y, letter));
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
                ++amount;
                grid = placeOnGrid(word, grid, x, y, dir);
                ++countPlacedWords;
                break;
            }
        }
    }
    alert("использовано слов: " + amount);
    displayCrosswordPuzzle(grid);
}

function displayCrosswordPuzzle(bestGrid) {
    console.log("INNNNNNN DIIIIIIISSSPL")
    for (let row = 0; row < gridSize; ++row) {
        for (let column = 0; column < gridSize; ++column) {
            let slot = document.getElementById(row + "_" + column);
            if(bestGrid[row][column] != '_') {
                slot.innerHTML = bestGrid[row][column];
                slot.style.borderBottom =  '1px solid #9a8e9a';
                slot.style.borderRight =  '1px solid #9a8e9a';
                slot.style.backgroundColor = 'rgb(102, 178, 255)';
            }
            else {
                slot.innerHTML = "";
                slot.style.border =  '1px solid #1c1b1b';
                slot.style.backgroundColor = '#e9e9e9';
            }
        }
    }
}
