const texts = [
  "Three little birds sat on my window",
  "And they told me I don't need to worry",
  "Summer came like cinnamon, so sweet",
  "Little girls, double-dutch on the concrete",
  "Maybe sometimes we got it wrong, but it's all right",
]

const messageBox = document.getElementById('messageBox');
// Get all the 10 box elements in the messageBox.
const boxes = messageBox.querySelectorAll('.box');
// Randomly select 5 elements from the boxes.
const shuffledBoxes = Array.from(boxes).sort(() => 0.5 - Math.random());
const selectedBoxes = shuffledBoxes.slice(0, 5);

// Highlight the selected boxes.
selectedBoxes.forEach((box, i) => {
  box.innerText = texts[i];
});