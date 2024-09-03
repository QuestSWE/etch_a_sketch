// ███████╗ █████╗ ███████╗
// ██╔════╝██╔══██╗██╔════╝
// █████╗  ███████║███████╗
// ██╔══╝  ██╔══██║╚════██║
// ███████╗██║  ██║███████║
// ╚══════╝╚═╝  ╚═╝╚══════╝

"use strict";

let row = 2;
let column = 2;
let opacities = {};
let currentIndex = 0;
let isDrawing = false;
let isGridVisible = true;
let selectedColor = "#000000";
const gridContainer = document.querySelector(".grid-container");

function createDiv() {
  gridContainer.innerHTML = "";
  const itemWidth = 100 / column;

  for (currentIndex = 0; currentIndex < row * column; currentIndex++) {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";
    gridItem.style.width = `${itemWidth}%`;
    gridItem.style.border = "solid #383944 1px";
    gridItem.setAttribute("tabindex", "0");

    gridItem.addEventListener("click", function () {
      gridItem.focus();
      currentIndex = Array.from(gridContainer.children).indexOf(gridItem);
    });

    gridContainer.appendChild(gridItem);
  }
}

const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", function () {
  selectedColor = colorPicker.value || "#000000";
});

function hexToRgba(hex, alpha) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function randomizeColor() {
  let alpha = 1;
  const r = Math.floor(Math.random() * (255 + 1));
  const g = Math.floor(Math.random() * (255 + 1));
  const b = Math.floor(Math.random() * (255 + 1));

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Key controls
document.addEventListener("keydown", function (event) {
  const gridItems = document.querySelectorAll(".grid-item");

  switch (event.key) {
    case "l":
      if (currentIndex >= row) {
        currentIndex -= row;
      }
      break;
    case "j":
      if (currentIndex < gridItems.length - row) {
        currentIndex += row;
      }
      break;
    case "a":
      if (currentIndex % row !== 0) {
        currentIndex -= 1;
      }
      break;
    case "d":
      if (
        currentIndex % row !== row - 1 &&
        currentIndex < gridItems.length - 1
      ) {
        currentIndex += 1;
      }
      break;
    default:
      return;
  }
  gridItems[currentIndex].focus();
  hoverOrKeyPress(gridItems[currentIndex], currentIndex);
});

createDiv();

// Mouse control
const mouseDown = (leftClick) => {
  if (leftClick.button === 0) {
    isDrawing = true;
    const gridItem = leftClick.target;
    if (gridItem.classList.contains("grid-item")) {
      const index = Array.from(gridContainer.children).indexOf(gridItem);
      hoverOrKeyPress(gridItem, index);
    }
  }
};

const mouseUp = () => {
  isDrawing = false;
};

const mouseOver = (div, index) => {
  if (isDrawing) {
    hoverOrKeyPress(div, index);
  }
};

function hoverOrKeyPress(div, index) {
  if (typeof opacities[index] === "undefined") {
    opacities[index] = 0;
  }
  if (darkenToggle.checked && opacities[index] < 1) {
    let newOpacity = opacities[index] + 0.1;
    if (newOpacity > opacities[index]) {
      opacities[index] = Math.min(newOpacity, 1);
      div.style.backgroundColor = hexToRgba(selectedColor, opacities[index]);
    }
  } else if (lightenToggle.checked) {
    if (opacities[index] > 0) {
      opacities[index] = Math.max(0, opacities[index] - 0.1);
      div.style.backgroundColor = hexToRgba(selectedColor, opacities[index]);
    }
  } else if (randomizeToggle.checked) {
    div.style.backgroundColor = randomizeColor();
  } else {
    opacities[index] = 1;
    div.style.backgroundColor = hexToRgba(selectedColor, opacities[index]);
  }
}

document.addEventListener("mouseup", () => {
  isDrawing = false;
});

function defaultOpacity() {
  darkenOff();
  document.querySelectorAll(".grid-item").forEach((div, index) => {
    const mouseOverHandler = () => mouseOver(div, index);
    div.addEventListener("mouseover", mouseOverHandler);
    div._mouseOverHandler = mouseOverHandler;
  });
  gridContainer.addEventListener("mousedown", mouseDown);
  document.addEventListener("mouseup", mouseUp);
}

function darkenOff() {
  document.querySelectorAll(".grid-item").forEach((div) => {
    if (div._mouseOverHandler) {
      div.removeEventListener("mouseover", div._mouseOverHandler);
      delete div._mouseOverHandler;
    }
  });
  gridContainer.removeEventListener("mousedown", mouseDown);
  document.removeEventListener("mouseup", mouseUp);
}

const randomizeToggle = document.querySelector("#randomize-toggle input");
randomizeToggle.addEventListener("change", function () {
  if (this.checked) {
    randomizeColor();
    darkenToggle.checked = false;
    lightenToggle.checked = false;
  } else {
    defaultOpacity();
  }
});

const darkenToggle = document.querySelector("#darken-toggle input");
darkenToggle.addEventListener("change", function () {
  if (this.checked) {
    lightenToggle.checked = false;
    randomizeToggle.checked = false;
    defaultOpacity();
  }
});

const lightenToggle = document.querySelector("#lighten-toggle input");
lightenToggle.addEventListener("change", function () {
  if (this.checked) {
    darkenToggle.checked = false;
    randomizeToggle.checked = false;
  } else {
    defaultOpacity();
  }
});

const gridToggle = document.querySelector("#grid-toggle input");
gridToggle.addEventListener("change", function () {
  isGridVisible = !this.checked;
  updateGridDisplay();
});

function updateGridDisplay() {
  document.querySelectorAll(".grid-item").forEach((div) => {
    if (isGridVisible) {
      div.style.border = "solid #383944  1px";
      gridContainer.style.border = "none";
      gridContainer.style.outline = "solid #b10f0f  100px";
    } else {
      div.style.border = "none";
      gridContainer.style.border = "solid #383944  1px";
    }
  });
}

const reset = document.querySelector(".reset");
reset.addEventListener("click", function () {
  darkenOff();

  gridContainer.classList.add("shake");
  setTimeout(() => {
    gridContainer.classList.remove("shake");
  }, 500);

  document.querySelectorAll(".grid-item").forEach((div, index) => {
    div.style.transition = "background-color 0.4s ease-out";
    opacities[index] = 0;
    div.style.backgroundColor = `rgba(0, 0, 0, ${opacities[index]})`;

    setTimeout(() => {
      div.style.transition = "";
    }, 400);
  });
  defaultOpacity();
});

const rangeSlider = document.querySelector("#range-slider");
noUiSlider.create(rangeSlider, {
  start: 2,
  range: {
    min: 2,
    max: 100,
  },
  step: 1,
  tooltips: true,
  format: wNumb({
    decimals: 0,
  }),
});
rangeSlider.style.width = "150px";
rangeSlider.style.height = "10px";

function sliderValue() {
  const noUiHandle = document.querySelector(".noUi-handle");
  rangeSlider.noUiSlider.on("update", function (values) {
    row = Number(values[0]);
    column = Number(values[0]);
    gridContainer.innerHTML = "";
    createDiv();
    defaultOpacity();
    updateGridDisplay();
  });
  noUiHandle.style.height = "20px";
  noUiHandle.style.width = "20px";
  noUiHandle.style.backgroundColor = "#2196f3";
}

sliderValue();
defaultOpacity();
