let numMoves = 0;
let n = 5;
let k = 3; //default values
let customLabel = ""; //if empty generate default number labels
let groundTruthLabels = [];
let currentLabels = []; //will update based on knob turning

const customLabelInput = document.getElementById("custom-label-input");
const windowSizeInput = document.getElementById("window-size-input");
const permLengthInput = document.getElementById("perm-length-input");

const submitButton = document.getElementById("submit-button");
const resetButton = document.getElementById("reset-button");
const scrambleButton = document.getElementById("scramble-button");

const knobs = document.getElementById("knobs");

const permutationDisplay = document.getElementById("permutation-display");
const numberMoves = document.getElementById("number-moves");

const customizationForm = document.getElementById("customization");


function renderPuzzle() {
    numberMoves.innerHTML = `<h4>0</h4>`
    knobs.hidden = false;
    if (customLabel && customLabel.length === n) {
        groundTruthLabels = customLabel.toUpperCase().split('');
    } else {
        groundTruthLabels = Array.from({length: n}, (_, i) => i + 1);
    }
    
    currentLabels = groundTruthLabels.slice();
    const indicesArr = [];
    for (let i = 1; i <= n-k+1; i++) {
        indicesArr.push(i);
    }

    knobs.innerHTML = indicesArr.map((index) => {
        let finalStructure = `<div class="knob-set">
            <button class="knob" id="knob-${index}-left">
                Shift elements ${index} to ${index+k-1} left
            </button>
            <button class="knob" id="knob-${index}-right">
                Shift elements ${index} to ${index+k-1} right 
            </button>
        </div>
        `;
        return finalStructure;
    }).join("");
    indicesArr.forEach((index) => {
        const leftButton = document.getElementById(`knob-${index}-left`);
        const rightButton = document.getElementById(`knob-${index}-right`);
        leftButton.addEventListener("click", () => {
            applyKnob(index, 'left');
        });
        rightButton.addEventListener("click", () => {
            applyKnob(index, 'right');
        });
    });
    numMoves = 0;

    scramblePuzzle();

}

function applyKnob (index, orientation) {
    const currIndex = index;
    let shuffleWindow = currentLabels.slice(currIndex-1, currIndex+k-1);
    if (orientation == 'left') {
        shuffleWindow = leftShift(shuffleWindow);
    }
    else if (orientation == 'right') {
        shuffleWindow = rightShift(shuffleWindow);
    }
    for (let j = 0; j < k; j++) {
        currentLabels[currIndex - 1 + j] = shuffleWindow[j];
    }
    numMoves += 1;
    numberMoves.innerHTML = `<h4>${numMoves}</h4>`
    updateLabels();
}

function scramblePuzzle() {
    const numShuffles = 50;
    for (let i = 1; i <= numShuffles; i++) {
        const currIndex = getRandomInt(1, n-k+1);
        let shuffleWindow = currentLabels.slice(currIndex-1, currIndex+k-1);
        const shift = getRandomInt(0, 1);
        if (shift == 0) {
            shuffleWindow = leftShift(shuffleWindow);
        }
        else {
            shuffleWindow = rightShift(shuffleWindow);
        }
        for (let j = 0; j < k; j++) {
            currentLabels[currIndex - 1 + j] = shuffleWindow[j];
        }
    }
    updateLabels();
}

function updateLabels() {
    const indices = [];
    for (let i = 1; i <= n; i++) {
        indices.push(i);
    }
    permutationDisplay.innerHTML = indices.map ((index) => {
        return `${currentLabels[index - 1]} `
    });
}

function getRandomInt (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function leftShift(arr) {
    if (arr.length === 0) {
        return arr;
    }
    else {
        const first = arr.shift();
        arr.push(first);
        return arr;
    }
}

function rightShift(arr) {
    if (arr.length === 0) {
        return arr;
    }
    else {
        const last = arr.pop();
        arr.unshift(last);
        return arr;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    renderPuzzle();


    customizationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        n = parseInt(permLengthInput.value);
        k = parseInt(windowSizeInput.value);
        customLabel = customLabelInput.value;

        renderPuzzle();
        
    });


    permLengthInput.addEventListener("input", (event) => {
        const inputValue = event.target.value;
        windowSizeInput.max = parseInt(inputValue)-1;
    });
    

    resetButton.addEventListener("click", () => {
        customizationForm.reset();
    });

    scrambleButton.addEventListener("click", () => {

        renderPuzzle();
    });
    
})