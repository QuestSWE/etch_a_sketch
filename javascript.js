// ███████╗ █████╗ ███████╗
// ██╔════╝██╔══██╗██╔════╝
// █████╗  ███████║███████╗
// ██╔══╝  ██╔══██║╚════██║
// ███████╗██║  ██║███████║
// ╚══════╝╚═╝  ╚═╝╚══════╝
                        



let row = 16;
let divSize = row * row;
let isDrawing = false;
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
    div.style.border = "solid white 1px";
    gridsDivision.forEach((item) => {
      item.style.flexBasis = divDimension;
    });
  }
}

function mouseOver() {
  const opacities = {};
  document.querySelectorAll(".grids-division").forEach((div, index) => {
    opacities[index] = 0;

    gridContainer.addEventListener("mousedown", (leftClick) => {
      if (leftClick.button === 0) {
        isDrawing = true;
      }
    });

    document.addEventListener("mouseup", () => {
      isDrawing = false;
    });

    div.addEventListener("mouseover", () => {
      if (isDrawing) {
        if (opacities[index] < 1) {
          opacities[index] += 0.1;
          div.style.backgroundColor = `rgba(255, 0, 0, ${opacities[index]})`;
        }
      }
    });
  });
}

document.addEventListener("mouseup", () => {
  isDrawing = false;
});

createDiv();
mouseOver();
