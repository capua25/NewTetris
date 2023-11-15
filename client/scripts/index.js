//Login Check--------------------------------------------------------------------------------------------------------------------------


//Buttons------------------------------------------------------------------------------------------------------------------------------
const startBtn = document.getElementById("start-button")
const pauseBtn = document.getElementById("pause-button")
const restartBtn = document.getElementById("reset-button")
const score = document.getElementById("score")
const level = document.getElementById("level")
const lines = document.getElementById("lines")

pauseBtn.disabled = true
restartBtn.disabled = true

startBtn.addEventListener("click", () => {
    if (!gameStarted) {
        startBtn.disabled = true
        pauseBtn.disabled = false
        gameStarted = true
        updateTable()
        drawFuturePiece()
    }
})
pauseBtn.addEventListener("click", () => {
    startBtn.disabled = false
    pauseBtn.disabled = true
    gameStarted = false
})
restartBtn.addEventListener("click", () => {
    restartBtn.disabled = true
    startBtn.disabled = true
    pauseBtn.disabled = false
    gameStarted = true
    playerLevel = 1
    playerScore = 0
    erasedLines = 0
    nextLevel = 10
    dropInterval = 1000
    score.innerText = playerScore
    level.innerText = playerLevel
    lines.innerText = erasedLines
    board.forEach((row) => {
        row.fill(0)
    })
    nextPiece()
    updateTable()
    drawFuturePiece()
})

//Modal------------------------------------------------------------------------------------------------------------------------------
const modal = document.querySelector(".modal_container")
const saveScore = document.getElementById("save_score")
const restartGame = document.getElementById("restart_button")
const modalScore = document.getElementById("score_modal")

const openModal = () => {
    modalScore.innerText = playerScore
    modal.classList.add("modal_show")
}
const closeModal = () => {
    modal.classList.remove("modal_show")
}

restartGame.addEventListener("click", () => {
    closeModal()
    restartBtn.click()
})

saveScore.addEventListener("click", () => {

})

//Tetris------------------------------------------------------------------------------------------------------------------------------
let canva = document.getElementById("tetris")
let canva2 = document.getElementById("next")
let table = canva.getContext("2d")
let nextCanva = canva2.getContext("2d")

let playerScore = 0
let playerLevel = 1

const blockSize = 25
const width = 14
const height = 30
const board = new Array(height).fill(0).map(() => new Array(width).fill(0))

const pieces = [
    {
        name: "I",
        color: "#0f85ea",
        position: {
            x: 5,
            y: 0
        },
        shape: [
            [1, 1, 1, 1]
        ]
    },
    {
        name: "J",
        color: "#1db3c8",
        position: {
            x: 5,
            y: 0
        },
        shape: [
            [1, 0, 0],
            [1, 1, 1]
        ]
    },
    {
        name: "L",
        color: "#fb3e00",
        position: {
            x: 5,
            y: 0
        },
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ]
    },
    {
        name: "O",
        color: "#d12a60",
        position: {
            x: 5,
            y: 0
        },
        shape: [
            [1, 1],
            [1, 1]
        ]
    },
    {
        name: "S",
        color: "#ab47bb",
        position: {
            x: 5,
            y: 0
        },
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ]
    },
    {
        name: "T",
        color: "#ffe703",
        position: {
            x: 5,
            y: 0
        },
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ]
    },
    {
        name: "Z",
        color: "#eaedee",
        position: {
            x: 5,
            y: 0
        },
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ]
    }
]
let piece = Math.floor(Math.random() * pieces.length)
let futurePiece = Math.floor(Math.random() * pieces.length)

table.canvas.width = width * blockSize
table.canvas.height = height * blockSize
table.scale(blockSize, blockSize)
nextCanva.canvas.width = 4 * blockSize
nextCanva.canvas.height = 4 * blockSize
nextCanva.scale(blockSize, blockSize)
drawTable()

let erasedLines = 0
let nextLevel = 10

let dropCounter = 0
let dropInterval = 1000
let lastTime = 0

let gameStarted = false

function updateTable(time = 0) {
    if (gameStarted) {
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
            playerScore++
            score.innerText = playerScore
        }

        drawTable()
        requestAnimationFrame(updateTable)
    }
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

function drawFuturePiece() {
    nextCanva.fillStyle = "black"
    nextCanva.fillRect(0, 0, 4, 4)

    pieces[futurePiece].shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                nextCanva.fillStyle = pieces[futurePiece].color
                nextCanva.fillRect(x, y, 1, 1)
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
            lines.innerText = erasedLines
            playerScore += 100
        }
    })
    if (erasedLines > nextLevel) {
        dropInterval =  dropInterval * 0.8
        nextLevel += 10
        playerLevel++
        level.innerText = playerLevel
    }
}

function pieceNew() {
    futurePiece = Math.floor(Math.random() * pieces.length)
}

function nextPiece() {
    resetPieces()
    piece = futurePiece
    pieceNew()
    drawFuturePiece()
    pieces[piece].position.x = 5
    pieces[piece].position.y = 0
    if (checkCollision()) {
        restartBtn.disabled = false
        pauseBtn.disabled = true
        gameStarted = false
        openModal()
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

function resetPieces() {
    pieces[0].shape = [[1, 1, 1, 1]]
    pieces[1].shape = [[1, 0, 0], [1, 1, 1]]
    pieces[2].shape = [[0, 0, 1], [1, 1, 1]]
    pieces[3].shape = [[1, 1], [1, 1]]
    pieces[4].shape = [[0, 1, 1], [1, 1, 0]]
    pieces[5].shape = [[0, 1, 0], [1, 1, 1]]
    pieces[6].shape = [[1, 1, 0], [0, 1, 1]]
}

document.addEventListener("keydown", event => {
    if (event.key === 'Escape') {
        gameStarted = false
    }
    if (gameStarted){
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
            console.log(gameStarted)
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
                //NO ANDA------------------------------------------------------------------------------------------------------------------------------
                for (let i = 0; i < 3; i++) {
                    pieces[piece].position.x++
                    if (checkCollision()) {
                        pieces[piece].position.x--
                    }
                }
                for (let i = 0; i < 3; i++) {
                    pieces[piece].position.x--
                    if (checkCollision()) {
                        pieces[piece].position.x++
                    }
                }
                for (let i = 0; i < 3; i++) {
                    pieces[piece].position.y++
                    if (checkCollision()) {
                        pieces[piece].position.y--
                    }
                }
                for (let i = 0; i < 3; i++) {
                    pieces[piece].position.y--
                    if (checkCollision()) {
                        pieces[piece].position.y++
                    }
                }
                rotatePiece()
            }
        }
    }
})