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
// const gridItem = document.querySelectorAll(".grid-item");
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
        opacities[index] = newOpacity;
        div.style.backgroundColor = `rgba(255, 0, 0, ${opacities[index]})`;
        console.log(`Div ${index} opacity: ${opacities[index]}`);
      }
    } else {
      opacities[index] = 1;
      div.style.backgroundColor = `rgba(255, 0, 0, ${opacities[index]})`;
      console.log(`Div ${index} opacity: ${opacities[index]}`);
    }
  }
};

function defaultOpacity() {
  darkenOff();

  opacities = {};
  document.querySelectorAll(".grid-item").forEach((div, index) => {
    const mouseOverHandler = () => mouseOver(div, index);
    div.addEventListener("mouseover", mouseOverHandler);
    div._mouseOverHandler = mouseOverHandler;
  });

  gridContainer.addEventListener("mousedown", mouseDown);
  document.addEventListener("mouseup", mouseUp);
}

function darkenOn() {
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

document.addEventListener("mouseup", () => {
  isDrawing = false;
});

// darken toggle slider
const darkenToggle = document.querySelector("#darken-toggle input");
darkenToggle.addEventListener("change", function () {
  if (this.checked) {
    darkenOn();
    console.log("Darken On");
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

  if (darkenToggle.checked) {
    darkenOn();
  } else {
    defaultOpacity();
  }
});

const rangeSlider = document.querySelector("#range-slider");
noUiSlider.create(rangeSlider, {
  start: 2,
  range: {
    min: 2,
    max: 100,
  },
  // add a increment by 5/10/20 function PLUS button in the ctrl-panel
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
createDiv();
defaultOpacity();
