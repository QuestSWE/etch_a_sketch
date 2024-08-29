// ███████╗ █████╗ ███████╗
// ██╔════╝██╔══██╗██╔════╝
// █████╗  ███████║███████╗
// ██╔══╝  ██╔══██║╚════██║
// ███████╗██║  ██║███████║
// ╚══════╝╚═╝  ╚═╝╚══════╝

"use strict";

let row = 0;
let column = 0;
let opacities = {};
let isDrawing = false;
let isGridVisible = true;
let selectedColor = "#000000";
const gridContainer = document.querySelector(".grid-container");

function createDiv() {
  const itemWidth = 100 / column;

  gridContainer.innerHTML = "";

  for (let i = 0; i < row * column; i++) {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";
    gridItem.style.width = `${itemWidth}%`;
    gridItem.style.border = "solid #383944 1px";
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

  console.log(r, g, b, alpha);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

randomizeColor();

const mouseDown = (leftClick) => {
  if (leftClick.button === 0) {
    isDrawing = true;
  }
};

const mouseUp = () => {
  isDrawing = false;
};

const mouseOver = (div, index) => {
  if (isDrawing) {
    if (typeof opacities[index] === "undefined") {
      opacities[index] = 0;
    }
    if (darkenToggle.checked && opacities[index] < 1) {
      let newOpacity = opacities[index] + 0.1;
      if (newOpacity > opacities[index]) {
        opacities[index] = Math.min(newOpacity, 1);
        div.style.backgroundColor = hexToRgba(selectedColor, opacities[index]);
        console.log(
          `Darken: Div ${index} opacity increased to ${opacities[index]}`
        );
      }
    } else if (lightenToggle.checked) {
      if (opacities[index] > 0) {
        opacities[index] = Math.max(0, opacities[index] - 0.1);
        div.style.backgroundColor = hexToRgba(selectedColor, opacities[index]);
        console.log(
          `Lighten: Div ${index} opacity decreased to ${opacities[index]}`
        );
      }
    } else if (randomizeToggle.checked) {
      div.style.backgroundColor = randomizeColor();
    } else {
      opacities[index] = 1;
      div.style.backgroundColor = hexToRgba(selectedColor, opacities[index]);
    }
  }
};

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
    darkenToggle.checked = false;
    lightenToggle.checked = false;
  } else {
    defaultOpacity();
  }
});

// darken toggle slider
const darkenToggle = document.querySelector("#darken-toggle input");
darkenToggle.addEventListener("change", function () {
  if (this.checked) {
    lightenToggle.checked = false;
    randomizeToggle.checked = false;
    defaultOpacity();
    console.log("Darken On");
  }
});

const lightenToggle = document.querySelector("#lighten-toggle input");
lightenToggle.addEventListener("change", function () {
  if (this.checked) {
    darkenToggle.checked = false;
    randomizeToggle.checked = false;
    console.log(`Light ON`);
  } else {
    defaultOpacity();
    console.log(`Light OFF`);
  }
});

// grid toggle slider
const gridToggle = document.querySelector("#grid-toggle input");
gridToggle.addEventListener("change", function () {
  isGridVisible = !this.checked;
  updateGridDisplay();
});

function updateGridDisplay() {
  document.querySelectorAll(".grid-item").forEach((div) => {
    if (isGridVisible) {
      console.log("Grid On");
      div.style.border = "solid #383944  1px";
      gridContainer.style.border = "none";
    } else {
      console.log("Grid Off");
      div.style.border = "none";
      gridContainer.style.border = "solid #383944  1px";
    }
  });
}

// reset button
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

createDiv();
sliderValue();
defaultOpacity();
