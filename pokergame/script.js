const GAME_STATE = {
    FirstCardAwaits: "FirstCardAwaits",
    SecondCardAwaits: "SecondCardAwaits",
    CardsMatchFailed: "CardsMatchFailed",
    CardsMatched: "CardsMatched",
    GameFinished: "GameFinished",
  }
const Symbols = [
    'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
    'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
    'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
    'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
  ]

const utility = {
    shuffle(array) {
        var currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      },
}
const view = {   
    getCardElement(index){
        return `<div data-index="${index}" class="card back"></div>`
    },
    getCardContent(index){
        const number = this.transform((index % 13) + 1)
        const symbol = Symbols[Math.floor(index / 13)]
        return `
            <p>${number}</p>
            <img src="${symbol}" alt="">
            <p>${number}</p>
        `
    },
    transform(number){
        switch (number){
            case 1:
                return "A"
            case 11:
                return "J"
            case 12:
                return "Q"
            case 13:
                return "K"
            default:
                return number
        }
    },
    disPlayCards(indexes){
        const cards = document.querySelector('#cards')
        cards.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
    },

    flipCards(...cards){
        cards.map(card =>{
            if(card.classList.contains('back')){
                card.classList.remove('back')
                card.innerHTML = this.getCardContent(Number(card.dataset.index))
                return
            }
            card.classList.add('back')
            card.innerHTML = null
        })
    },
    pairCards(...cards){
        cards.map(card =>{
            card.classList.add('pair')
        })
    },
    triedCount(count){
        document.querySelector(".tried").innerHTML = `You've tried: ${count} times`
    },
    scoreCount(count){
        document.querySelector('.score').innerHTML = `Score: ${count}`
    },
    renderWrongAnimation(...cards){
        cards.map(card =>{
            card.classList.add('wrong')
            card.addEventListener('animationend', event =>
                event.target.classList.remove('wrong')
            ,{once: true})
        })
    },
    showGameFinished () {
        const div = document.createElement('div')
        div.classList.add('completed')
        div.innerHTML = `
          <p>Complete!</p>
          <p>Score: ${model.score}</p>
          <p>You've tried: ${model.tried} times</p>
        `
        const header = document.querySelector('#header')
        header.before(div)
    }
}

const controller = {
    currentState: GAME_STATE.FirstCardAwaits,
    generateCards(){
        view.disPlayCards(utility.shuffle(Array.from(Array(52).keys())))
    },
    dispatchCardAction(card){
        if(!card.classList.contains("back")){
            return
        }
        switch(this.currentState){
            case GAME_STATE.FirstCardAwaits:
                view.flipCards(card)
                model.revealedCards.push(card)
                this.currentState = GAME_STATE.SecondCardAwaits
                view.triedCount(model.tried += 1)
                break
            case GAME_STATE.SecondCardAwaits:
                view.flipCards(card)
                model.revealedCards.push(card)
                if(model.isRevealedCardsMatched()){
                    this.currentState = GAME_STATE.CardsMatched
                    view.pairCards(...model.revealedCards)
                    view.scoreCount(model.score += 10)
                    model.revealedCards = []
                    if (model.score === 260) {
                        console.log('showGameFinished')
                        this.currentState = GAME_STATE.GameFinished
                        view.showGameFinished()  // 加在這裡
                        return
                      }
                    this.currentState = GAME_STATE.FirstCardAwaits
                }else{
                    this.currentState = GAME_STATE.CardsMatchFailed
                    view.renderWrongAnimation(...model.revealedCards)
                    setTimeout(this.resetCards, 1000)
                }
                break

        }
        console.log(this.currentState)
        console.log(model.revealedCards.map(card => card.dataset.index))
    },
    resetCards(){
        view.flipCards(...model.revealedCards)
        model.revealedCards = []
        controller.currentState = GAME_STATE.FirstCardAwaits        
    }
}

const model = {
    revealedCards: [],
    isRevealedCardsMatched(){
        return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
    },
    score: 0,
    tried: 0,
}

controller.generateCards()

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', event =>{
        controller.dispatchCardAction(card)
    })
})