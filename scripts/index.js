///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Login Check--------------------------------------------------------------------------------------------------------------------------
const user = localStorage.getItem('user')
const user_id = localStorage.getItem('user_id')
const token = localStorage.getItem('token')
const loginModal = document.querySelector('.login_modal')
const alertModal = document.querySelector('.alert_modal')
const alertTitle = document.querySelector('.alert_h1')
const alertText = document.querySelector('.alert_h2')
const alertButton = document.querySelector('#alert_button')
const newUserButton = document.querySelector('#create_user')
const gameDiv = document.querySelector('.border_div')
const userDiv = document.querySelector('#user')
const form = document.querySelector('form')
const logOutBtn = document.querySelector('#logOut')

alertButton.addEventListener('click', () => {
    alertModal.classList.remove('modal_show')
})

form.addEventListener('submit', event => {
    event.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    if (!username && !password) {
        alertText.innerText = 'Please complete all the fields'
        alertTitle.innerText = 'Alert!'
        alertModal.classList.add('modal_show')
    }else if (!username) {
        alertText.innerText = 'Please complete the username field'
        alertTitle.innerText = 'Alert!'
        alertModal.classList.add('modal_show')
    }else if(!password){
        alertText.innerText = 'Please complete the password field'
        alertTitle.innerText = 'Alert!'
        alertModal.classList.add('modal_show')
    }else if(username.length < 6){
        alertText.innerText = 'Username must be at least 6 characters long'
        alertTitle.innerText = 'Alert!'
        alertModal.classList.add('modal_show')
    }else if (password.length < 6){
        alertText.innerText = 'Password must be at least 6 characters long'
        alertTitle.innerText = 'Alert!'
        alertModal.classList.add('modal_show')
    }else{
        serverLogin(username, password)
    }
})

async function serverLogin(username, password){
    try{
        const res = await fetch('http://localhost:3060/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        })
        const data = await res.json()
        if (data.token){
            localStorage.removeItem('user')
            localStorage.removeItem('user_id')
            localStorage.removeItem('token')
            localStorage.setItem('user', data.user.username)
            localStorage.setItem('user_id', data.user.id)
            localStorage.setItem('token', data.token)
            startBtn.disabled = false
            pauseBtn.disabled = true
            restartBtn.disabled = true
            gameStarted = false
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
            drawTable()
            drawFuturePiece()
            loginModal.classList.remove('modal_show')
            refreshScores()
            userDiv.innerText = data.user.username
            gameDiv.classList.remove('hide')
        }else{
            newUserButton.classList.remove('hide_btn')
            throw new Error('Invalid credentials, create new user?')
        }
    }catch(error){
        console.log(error)
        alertTitle.innerText = 'Alert!'
        alertText.innerText = error.message
        alertModal.classList.add('modal_show')
    }
}
async function serverSignup(username, password){
    try{
        const res = await fetch('http://localhost:3060/signup', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        })
        const data = await res.json()
        if (data.message === 'User Created'){
            newUserButton.classList.add('hide_btn')
            alertModal.classList.remove('modal_show')
            serverLogin(username, password)
        }else{
            newUserButton.classList.add('hide_btn')
            throw new Error('Error, user already exists')
        }
    }catch(error){
        console.log(error)
        alertTitle.innerText = 'Alert!'
        alertText.innerText = error.message
        alertModal.classList.add('modal_show')
    }
}

newUserButton.addEventListener('click', () => {
    newUserButton.classList.add('hide_btn')
    serverSignup(document.getElementById('username').value, document.getElementById('password').value)
})

logOutBtn.addEventListener('click', () => {
    gameDiv.classList.add('hide')
    localStorage.removeItem('user')
    localStorage.removeItem('user_id')
    localStorage.removeItem('token')
    loginModal.classList.add('modal_show')
})

if (user === null || token === null || user_id === null) {
    gameDiv.classList.add('hide')
    localStorage.removeItem('user')
    localStorage.removeItem('user_id')
    localStorage.removeItem('token')
    loginModal.classList.add('modal_show')
}else{
    userDiv.innerText = user
    refreshScores()
    gameDiv.classList.remove('hide')
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        restartBtn.disabled = false
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
    startBtn.disabled = true
    pauseBtn.disabled = false
    restartBtn.disabled = true
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Scores Tables----------------------------------------------------------------------------------------------------------------------
const highScoresTable = document.querySelector('#bestScores ul')
const userScoresTable = document.querySelector('#userScores ul')
const deleteScoresBtn = document.querySelector('#delete-scores')

async function getHighScores() {
    try {
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:3060/scores', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            }
        })
        const data = await res.json()
        highScoresTable.innerHTML = ''
        if (data.length > 0) {
            data.forEach(score => {
                const li = document.createElement('li')
                li.innerText = `${score.username}- ${score.score}`
                highScoresTable.appendChild(li)
            })
        } else {
            throw new Error('No scores found')
        }
    } catch (error) {
        console.log(error.message)
    }
}

async function getUserScores() {
    try {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('user_id')
        const res = await fetch(`http://localhost:3060/scores/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            }
        })
        const data = await res.json()
        userScoresTable.innerHTML = ''
        if (data.length > 0) {
            let index = 1
            data.forEach(score => {
                const li = document.createElement('li')
                li.innerText = `${(index)} - ${score.score}`
                index++
                userScoresTable.appendChild(li)
            })
        } else {
            throw new Error('No scores found')
        }
    } catch (error) {
        console.log(error.message)
    }
}

function refreshScores() {
    getHighScores()
    getUserScores()
}

async function saveScoreToDB() {
    try {
        const token = localStorage.getItem('token')
        const user_id = localStorage.getItem('user_id')
        const res = await fetch('http://localhost:3060/scores', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            },
            body: JSON.stringify({
                'user_id': user_id,
                'score': playerScore
            })
        })
        const data = await res.json()
        console.log(data)
        if (data.message === 'Score Added') {
            alertTitle.innerText = 'Success!'
            alertText.innerText = 'Score saved successfully'
            alertModal.classList.add('modal_show')
        } else {
            if (token === null) {
                gameDiv.classList.add('hide')
                localStorage.removeItem('user')
                localStorage.removeItem('user_id')
                localStorage.removeItem('token')
                loginModal.classList.add('modal_show')
            }
            throw new Error('Error, score not saved')
        }
    } catch (error) {
        console.log(error.message)
        alertTitle.innerText = 'Alert!'
        alertText.innerText = error.message
        alertModal.classList.add('modal_show')
    }
}

async function deleteScores() {
    try {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('user_id')
        const res = await fetch(`http://localhost:3060/scores/${userId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            }
        })
        const data = await res.json()
        if (data.message === 'Scores Deleted') {
            alertTitle.innerText = 'Success!'
            alertText.innerText = 'Scores deleted successfully'
            alertModal.classList.add('modal_show')
            refreshScores()
        } else {
            throw new Error('Error, scores not deleted')
        }
    } catch (error) {
        console.log(error.message)
        alertTitle.innerText = 'Alert!'
        alertText.innerText = error.message
        alertModal.classList.add('modal_show')
    }
}

deleteScoresBtn.addEventListener('click', () => deleteScores())
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    closeModal()
    saveScoreToDB()
    refreshScores()
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        position: { x: 5, y: 0 },
        shape: [
            [1, 1, 1, 1]
        ]
    },
    {
        name: "J",
        color: "#1db3c8",
        position: { x: 5, y: 0 },
        shape: [
            [1, 0, 0],
            [1, 1, 1]
        ]
    },
    {
        name: "L",
        color: "#fb3e00",
        position: { x: 5, y: 0 },
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ]
    },
    {
        name: "O",
        color: "#eaedee",
        position: { x: 5, y: 0 },
        shape: [
            [1, 1],
            [1, 1]
        ]
    },
    {
        name: "S",
        color: "#d12a60",
        position: { x: 5, y: 0 },
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ]
    },
    {
        name: "T",
        color: "#ffe703",
        position: { x: 5, y: 0 },
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ]
    },
    {
        name: "Z",
        color: "#ab47bb",
        position: { x: 5, y: 0 },
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
nextCanva.canvas.height = 2 * blockSize
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
    nextCanva.fillStyle = "#888888"
    nextCanva.fillRect(0, 0, 4, 2)

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
        dropInterval = dropInterval * 0.8
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
    if (gameStarted) {
        if(restartBtn.disabled === true){ restartBtn.disabled = false }
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
                for (let i = 0; i < 3; i++) {
                    pieces[piece].position.x++
                    if (checkCollision()) {
                        pieces[piece].position.x--
                        if(piece === 0 && i < 2){
                            pieces[piece].position.x--
                        }
                    } else {
                        break
                    }
                }
                for (let i = 0; i < 3; i++) {
                    pieces[piece].position.x--
                    if (checkCollision()) {
                        pieces[piece].position.x++
                    } else {
                        break
                    }
                }
                for (let i = 0; i < 3; i++) {
                    pieces[piece].position.y++
                    if (checkCollision()) {
                        pieces[piece].position.y--
                    } else {
                        break
                    }
                }
                for (let i = 0; i < 3; i++) {
                    pieces[piece].position.y--
                    if (checkCollision()) {
                        pieces[piece].position.y++
                    } else {
                        break
                    }
                }
            }
        }
    }
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////