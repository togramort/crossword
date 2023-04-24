let words = []
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

function canPlace(grid, word, x, y) {
    var maybeH = true;
    var maybeV = true;
    var dir;
    if (x + word.length > grid.length) {
        maybeV = false;
    } else if (y + word.length > grid[0].length) {
        maybeH = false;
    }

    if (maybeV) {
        for (var i = x; i < x + word.length; ++i) {
            if (grid[i][y] != '_' && grid[i][y] != word[i - x]) {
                maybeV = false;
                break;
            }
        }
    } 
    if (maybeH) {
        for (var i = y; i < y + word.length; ++i) {
            if (grid[x][i] != '_' && grid[x][i] != word[i - y]) {
                maybeH = false;
                break;
            }
        }
    }

    if (maybeV) {
        dir = 'v';
    } else if (maybeH) {
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

function generateScore(grid) {
    var filled = 0;
    var empty = 0;
    var sizeRatio = grid.length / grid[0].length;
    for(var x in grid) {
        for(var y in grid[x]) {
            if (grid[x][y] == '_') {
                ++empty;
            } else {
                ++filled;
            }
        }
    }
    var filledRatio = filled / empty;
    return (sizeRatio * 10) + (filledRatio * 20);
}

function wordPlacement() {
    let maxWords = words.length;
    var bestGrid = grid;
    word = words.pop();
    let count = 1;
    placeWordH(grid, word, (gridSize / 2) - 1, (gridSize / 2) - Math.floor(word.length / 2));
    while (count < maxWords && words.length > 0) {
        var placements = [];
        word = words.pop();
        for(var letter in word) {
            for(var x = 0; x < grid.length; ++x) {
                for (var y = 0; y < grid[x].length; ++y) {
                    if (grid[x][y] == word[letter]) {
                        placements.push(canPlace(grid, word, x, y));
                    }
                }
            }
        }
        console.log(placements)
        var bestScore = 0;
        var newScore = 0;
        var newGrid = grid;
        for(var [word, x, y, dir] in placements) {
            newGrid = placeOnGrid(word, grid, x, y, dir);
            newScore = generateScore(newGrid);
            if (newScore > bestScore) {
                bestScore = newScore;
                bestGrid = newGrid;
            }
        }
        if (bestScore > 0) {
            grid = bestGrid;
            ++count;
        }
    }
    displayCrosswordPuzzle(bestGrid);
}

function displayCrosswordPuzzle(bestGrid) {      
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
                slot.style.border =  '1px solid #e9e9e9';
                slot.style.backgroundColor = '#e9e9e9';
            }
        }
    }
}