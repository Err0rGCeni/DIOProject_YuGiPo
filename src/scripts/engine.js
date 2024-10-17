const STATE = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        player2: "computer-cards",
        player2Box: document.querySelector("#computer-cards"),
    },
    actions:  {
        button: document.getElementById("next-duel")
    }
}

const pathImages = "./src/assets/icons/"

const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    }
]

async function getRandomCardID() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(IDCard, fieldSide) {
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png")
    cardImage.setAttribute("data-id", IDCard)
    cardImage.classList.add("card")

    if(fieldSide === STATE.playerSides.player1) {
        cardImage.addEventListener("click", ()=> {
            setCardsField(cardImage.getAttribute("data-id"))
        })

        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(IDCard)
        })

        cardImage.addEventListener("mouseleave", hideCardDetails)        
    }

    return cardImage
}

async function hideCardDetails() {
    STATE.cardSprites.avatar.src = ""
    STATE.cardSprites.name.innerText = "Name"
    STATE.cardSprites.type.innerText = "Type"
}

async function setCardsField(cardID) {
    await removeAllCardsImages()
    let computerCardID = await getRandomCardID()
    //await hideCardDetails();
    STATE.fieldCards.player.style.display = "block"
    STATE.fieldCards.computer.style.display = "block"
    STATE.fieldCards.player.src = cardData[cardID].img
    STATE.fieldCards.computer.src = cardData[computerCardID].img

    let duelResults = await checkDuelResults(cardID, computerCardID)
    await updateScore()
    await drawButton(duelResults)
}

async function updateScore() {
    STATE.score.scoreBox.innerText = `Win: ${STATE.score.playerScore} | ${STATE.score.computerScore}`    
}

async function checkDuelResults(playerCardID, computerCardID) {
    let duelResults = "Draw"
    let playerCard = cardData[playerCardID]

    if (playerCard.WinOf.includes(computerCardID)) {
        duelResults = "Win"
        await playAudio("win")
        STATE.score.playerScore++
    } else if (playerCard.LoseOf.includes(computerCardID)) {
        duelResults = "Lose"
        await playAudio("lose")
        STATE.score.computerScore++
    }

    return duelResults
}

async function drawButton(text) {
    STATE.actions.button.innerText = text
    STATE.actions.button.style.display = "block"
}

async function removeAllCardsImages() {
    let cards = STATE.playerSides.player2Box
    let imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

    cards = STATE.playerSides.player1Box
    imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())
}

async function drawSelectCard(index) {
    STATE.cardSprites.avatar.src =  cardData[index].img
    STATE.cardSprites.name.innerText = cardData[index].name
    STATE.cardSprites.type.innerText = "Attribute: " + cardData[index].type
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIDCard = await getRandomCardID()
        const cardImage = await createCardImage(randomIDCard, fieldSide)
        
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    STATE.cardSprites.avatar.src = ""
    STATE.actions.button.style.display = "none"
    STATE.fieldCards.player.style.display = "none"
    STATE.fieldCards.computer.style.display = "none"
    init()
}

async function playAudio(status) {
    try {
        const audio = new Audio(`./src/assets/audios/${status}.wav`)
        audio.play()        
    } catch (error) {
        console.log(error)        
    }
}

async function init() {
    await hideCardDetails()
    STATE.fieldCards.player.style.display = "none"
    STATE.fieldCards.computer.style.display = "none"
    drawCards(5, STATE.playerSides.player1)
    drawCards(5, STATE.playerSides.player2)
    const bgm = document.getElementById("bgm")
    bgm.play()
}

init()
