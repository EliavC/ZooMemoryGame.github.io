$(document).ready(function() {
    const startButton = $("#start-button");
    const startScreen = $("#start-screen");
    const gameScreen = $("#game-screen");
    const playerNameInput = $("#player-name");
    const numCardsInput = $("#num-cards");
    const cardsContainer = $("#cards");
    const timerDisplay = $("#timer");

    let cards = [];
    let numCards = 0;
    let matchedCards = 0;
    let timer = null;
    let seconds = 0;
    
    startButton.on("click", startGame);
    
    function startGame() {
      const playerName = playerNameInput.val();
      numCards = parseInt(numCardsInput.val())*2 ;
      
      if (!playerName || !numCards || numCards < 3 || numCards > 60) {
        alert("Please enter your name and choose a valid number of cards (2-30).");
        return;
      }
      
      startScreen.hide();
      gameScreen.show();
      
      generateCards();
      shuffleCards();
      renderCards();
      
      timer = setInterval(updateTimer, 1000);
    }
    function generateCards() {
       const images = ["images/download.jpg","images/download1.jpg","images/download2.jpg","images/download3.jpg","images/download4.jpg","images/download5.jpg","images/download6.jpg","images/download7.jpg","images/download8.jpg","images/download9.jpg","images/download10.jpg","images/download11.jpg","images/download12.jpg","images/download13.jpg","images/download14.jpg","images/download15.jpg","images/download16.jpg","images/download17.jpg","images/download18.jpg","images/download19.jpg","images/download20.jpg","images/download21.jpg","images/download22.jpg","images/download23.jpg","images/download24.jpg","images/download25.jpg","images/download26.jpg","images/download27.jpg","images/download28.jpg","images/download29.jpg"];
       const shuffledImages = shuffleArray(images);
      const uniqueSymbols = shuffledImages.slice(0, numCards / 2);
      const duplicatedSymbols = uniqueSymbols.concat(uniqueSymbols);
      const shuffledSymbols = shuffleArray(duplicatedSymbols);
      cards = shuffledSymbols.map(function(image,index) {
        return {
            id: index,
            image: image,
          isFlipped: false,
          isMatched: false
        };
      });
    }
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
    
    function shuffleCards() {
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
    }
    
    function renderCards() {
      cardsContainer.html("");
     cards.forEach(function(card) {
     const cardElement = $("<div>")
      .addClass("card")
      .attr("data-id",card.id)
       .on("click", handleCardClick);
        
     const frontFace = $("<div>").addClass("front-face");
      const backFace = $("<div>").addClass("back-face");

    if (card.isFlipped) {
      backFace.css("background-image", `url(${card.image})`);
      cardElement.addClass("flipped");
    }
    cardElement.append(frontFace, backFace);
        cardsContainer.append(cardElement);
      });
    }
    
    function handleCardClick() {
      const clickedIndex = $(this).data("id");
      const clickedCard = cards.find(function(card) {
        return card.id === clickedIndex;
      });
      if (clickedCard.isFlipped || clickedCard.isMatched) {
        return;
      }
      
      
      clickedCard.isFlipped = true;
      renderCards();
      
      const flippedCards = cards.filter(function(card) {
        return card.isFlipped && !card.isMatched;
      });
      
      if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;
        
        if (card1.image === card2.image) {
          card1.isMatched = true;
          card2.isMatched = true;
          matchedCards += 2;
          
          if (matchedCards === numCards) {
            clearInterval(timer);
            setTimeout(function() {
              endGame();
            }, 500);
          }
        } else {
          setTimeout(function() {
            card1.isFlipped = false;
            card2.isFlipped = false;
            renderCards();
          }, 1000);
        }
      }
    }
    
    function updateTimer() {
      seconds++;
      timerDisplay.text(seconds);
    }
    
    function endGame() {
      const playerName = playerNameInput.val();
      const gameTime = seconds;
      
      gameScreen.hide();
      startScreen.show();
      playerNameInput.val("");
      numCardsInput.val("");
      clearInterval(timer);
      cards = [];
      numCards = 0;
      matchedCards = 0;
      seconds = 0;
      
      alert(`Congratulations, ${playerName}! You completed the game in ${gameTime} seconds, press OK to play again'`);
    }
  });
  