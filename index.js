// select all buttons with class drum
const buttons = document.querySelectorAll(".drum");

// Volume control (default = 1)
let currentVolume = localStorage.getItem("volume") 
  ? parseFloat(localStorage.getItem("volume")) 
  : 1.0;

// Recording state
let isRecording = false;
let recordedSequence = [];

buttons.forEach(button => {
    button.addEventListener("click", function() {
        const buttonKey = this.innerHTML;
        handleInput(buttonKey);
    });
});

// Detecting keyboard press and playing sound
document.addEventListener("keydown", function(event) {
    handleInput(event.key);
});

// Combine input handling for clicks + key presses
function handleInput(key) {
  playSound(key);
  animateButton(key);

  if (isRecording) {
    recordedSequence.push({ key, time: Date.now() });
  }
}

//  Function to play sound
function playSound(key) {
  let sound;

  switch (key) {
    case "w":
      sound = new Audio("sounds/tom-1.mp3");
      break;
    case "a":
      sound = new Audio("sounds/tom-2.mp3");
      break;
    case "s":
      sound = new Audio("sounds/tom-3.mp3");
      break;
    case "d":
      sound = new Audio("sounds/tom-4.mp3");
      break;
    case "j":
      sound = new Audio("sounds/snare.mp3");
      break;
    case "k":
      sound = new Audio("sounds/crash.mp3");
      break;
    case "l":
      sound = new Audio("sounds/kick-bass.mp3");
      break;
    default:
      return; // Ignore other keys
  }

  sound.volume = currentVolume; // Apply volume control
  sound.play();
}

// Function to animate button
function animateButton(key) {
    const activeButton = document.querySelector("." + key);

    if (activeButton) {
        activeButton.classList.add("pressed");

        setTimeout(() => {
            activeButton.classList.remove("pressed");
        }, 150);
    }
}

// Add volume slider dynamically
const volumeSlider = document.createElement("input");
volumeSlider.type = "range";
volumeSlider.min = 0;
volumeSlider.max = 1;
volumeSlider.step = 0.1;
volumeSlider.value = currentVolume;
volumeSlider.style.marginTop = "20px";

document.body.appendChild(volumeSlider);

volumeSlider.addEventListener("input", () => {
  currentVolume = parseFloat(volumeSlider.value);
  localStorage.setItem("volume", currentVolume);
});

// Recording & playback buttons
const recordBtn = document.createElement("button");
recordBtn.textContent = "🎙️ Record";
document.body.appendChild(recordBtn);

const playBtn = document.createElement("button");
playBtn.textContent = "▶️ Play";
playBtn.disabled = true;
document.body.appendChild(playBtn);

recordBtn.addEventListener("click", () => {
  if (!isRecording) {
    recordedSequence = []; // reset
    isRecording = true;
    recordBtn.textContent = "⏹️ Stop";
    playBtn.disabled = true;
  } else {
    isRecording = false;
    recordBtn.textContent = "🎙️ Record";
    playBtn.disabled = recordedSequence.length === 0;
  }
});

playBtn.addEventListener("click", () => {
  if (recordedSequence.length === 0) return;

  let startTime = recordedSequence[0].time;

  recordedSequence.forEach(event => {
    setTimeout(() => {
      playSound(event.key);
      animateButton(event.key);
    }, event.time - startTime);
  });
});