// ███████╗ █████╗ ███████╗
// ██╔════╝██╔══██╗██╔════╝
// █████╗  ███████║███████╗
// ██╔══╝  ██╔══██║╚════██║
// ███████╗██║  ██║███████║
// ╚══════╝╚═╝  ╚═╝╚══════╝

"use strict";

let row = 16;
let divSize = row * row;
let isDrawing = false;
let opacities = {};
let gridsDivision = document.querySelectorAll(".grids-division");
const gridContainer = document.querySelector(".grid-container");

function createDiv() {
  for (let i = 1; i <= divSize; i++) {
    let div = document.createElement("div");
    div.className = "grids-division";
    div.setAttribute("data-opacity", 0);
    gridContainer.appendChild(div);

    const divDimension = `calc(${100 / row}%)`;
    gridsDivision = document.querySelectorAll(".grids-division");
    div.style.border = "solid #383944 1px";
    gridsDivision.forEach((item) => {
      item.style.flexBasis = divDimension;
    });
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
  document.querySelectorAll(".grids-division").forEach((div, index) => {
    // opacities[index] = 1;
    const mouseOverHandler = () => mouseOver(div, index);
    div.addEventListener("mouseover", mouseOverHandler);
    div._mouseOverHandler = mouseOverHandler;
  });

  gridContainer.addEventListener("mousedown", mouseDown);
  document.addEventListener("mouseup", mouseUp);
}

function darkenOn() {
  darkenOff();
  document.querySelectorAll(".grids-division").forEach((div, index) => {
    const mouseOverHandler = () => mouseOver(div, index);
    div.addEventListener("mouseover", mouseOverHandler);
    div._mouseOverHandler = mouseOverHandler;
  });

  gridContainer.addEventListener("mousedown", mouseDown);
  document.addEventListener("mouseup", mouseUp);
}

function darkenOff() {
  document.querySelectorAll(".grids-division").forEach((div, index) => {
    if (div._mouseOverHandler) {
      div.removeEventListener("mouseover", div._mouseOverHandler);
      // console.log(`Removed mouseover listener from div ${index}`);
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
  if (this.checked) {
    console.log("Grid Off");
    document.querySelectorAll(".grids-division").forEach((div) => {
      div.style.border = "none";
      gridContainer.style.border = "solid white 1px";
    });
  } else {
    console.log("Grid On");
    document.querySelectorAll(".grids-division").forEach((div) => {
      div.style.border = "solid white 1px";
      gridContainer.style.border = "none";
    });
  }
});

// reset button
const reset = document.querySelector(".reset");
reset.addEventListener("click", function () {
  darkenOff();

  gridContainer.classList.add("shake");
  setTimeout(() => {
    gridContainer.classList.remove("shake");
  }, 500);

  document.querySelectorAll(".grids-division").forEach((div, index) => {
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
const noUiHandle = document.querySelector(".noUi-handle");
// noUiHandle.style.position = 'absolute';
// noUiHandle.style.top = '80%';
noUiHandle.style.height = "20px";
noUiHandle.style.width = "20px";
noUiHandle.style.backgroundColor = "#2196f3";

createDiv();
defaultOpacity();
