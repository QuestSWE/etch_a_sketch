let row = 16;
let divSize = row * row;
let gridsDivision = document.querySelectorAll(".grids-division");
const gridContainer = document.querySelector(".grid-container");

function createDiv() {
  for (let i = 1; i <= divSize; i++) {
    let div = document.createElement("div");
    div.className = "grids-division";
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
  let opacity = 0.4;
  
  // while (opacity < 1) {
  //   opacity + 0.1;
  // }
  gridsDivision.forEach((div) => {
    div.addEventListener("mouseover", () => {
      div.style.backgroundColor = `rgba(255, 0, 0, ${opacity})`;
      console.log(opacity);
    });
  });
}
createDiv();
mouseOver();
