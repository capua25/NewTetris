let canva = document.getElementById("tetris")
let table = canva.getContext("2d")

const blockSize = 20
const width = 14
const height = 30
const board = new Array(height).fill(0).map(() => new Array(width).fill(0))

let piece = 0

table.canvas.width = width * blockSize
table.canvas.height = height * blockSize
table.scale(blockSize, blockSize)

let erasedLines = 0
let nextLevel = 10

let dropCounter = 0
let dropInterval = 1000
let lastTime = 0

let gameStarted = false

function updateTable(time = 0) {
    const deltaTime = time - lastTime
    lastTime = time
    dropCounter += deltaTime

    if (dropCounter > dropInterval) {
        pieces[piece].position.y++
        if (checkCollision()) {
            pieces[piece].position.y--
            merge()
        }
        dropCounter = 0
    }

    drawTable()
    window.requestAnimationFrame(updateTable)
}

function drawTable() {
    table.fillStyle = "black"
    table.fillRect(0, 0, width, height)

    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                table.fillStyle = pieces[piece].color
                table.fillRect(x, y, 1, 1)
            }
        })
    })

    pieces[piece].shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                table.fillStyle = pieces[piece].color
                table.fillRect(x + pieces[piece].position.x, y + pieces[piece].position.y, 1, 1)
            }
        })
    })
}

function checkCollision() {
    let collision = false
    pieces[piece].shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0 && board[y + pieces[piece].position.y]?.[x + pieces[piece].position.x] !== 0) {
                collision = true
            }
        })
    })
    return collision
}

function merge() {
    pieces[piece].shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                board[y + pieces[piece].position.y][x + pieces[piece].position.x] = 1
            }
        })
    })
    nextPiece()
    removeLine()
}

function removeLine() {
    board.forEach((row, y) => {
        if (row.every(value => value !== 0)) {
            board.splice(y, 1)
            board.unshift(new Array(width).fill(0))
            erasedLines++
        }
    })
    if (erasedLines > nextLevel) {
        dropInterval = dropInterval / 2
        nextLevel += 10
    }
}

function nextPiece() {
    piece = Math.floor(Math.random() * pieces.length)
    pieces[piece].position.x = 5
    pieces[piece].position.y = 0
    if (checkCollision()) {
        alert("Game Over")
        gameStarted = false
        board.forEach((row, y) => {
            row.fill(0)
        })
    }
}

function rotatePiece() {
    const rotatedPiece = []
    for (let y = 0; y < pieces[piece].shape[0].length; y++) {
        const row = []
        for (let x = pieces[piece].shape.length - 1; x >= 0; x--) {
            row.push(pieces[piece].shape[x][y])
        }
        rotatedPiece.push(row)
    }
    pieces[piece].shape = rotatedPiece
}

document.addEventListener("keydown", event => {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        pieces[piece].position.x--
        if (checkCollision()) {
            pieces[piece].position.x++
        }
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
        pieces[piece].position.x++
        if (checkCollision()) {
            pieces[piece].position.x--
        }
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        pieces[piece].position.y++
        if (checkCollision()) {
            pieces[piece].position.y--
            merge()
        }
    }
    if (event.key === ' ') {
        for (let i = 0; i < 30; i++) {
            pieces[piece].position.y++
            if (checkCollision()) {
                pieces[piece].position.y--
                merge()
                break
            }
        }
    }
    if (event.key === 'ArrowUp' || event.key === 'w') {
        rotatePiece()
        if (checkCollision()) {
        }
    }
})
document.addEventListener("click", event => {
    if (!gameStarted) {
        gameStarted = true
        updateTable()
    }
})