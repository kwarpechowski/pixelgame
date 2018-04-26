const c = document.querySelector("#myCanvas");
const cLetters = document.querySelector("#letters");
const up = document.querySelector("#up");
const down = document.querySelector("#down");
const elements = document.querySelector("#elements");
const colorsElm = document.querySelector("#colors");
const ctx = c.getContext("2d",  { alpha: true });
const ctxLetters = cLetters.getContext("2d",  { alpha: false });

let currentColor = 'red';

const buildPallete = (colors, revertedColors) => {
  Object.entries(colors).forEach(([number, color]) => {
    const elm = document.createElement('button');
    elm.style.background = color;
    elm.style.color = revertedColors[number];
    elm.innerText = number;
    elm.addEventListener('click', () => {
      currentColor = color;
    });
    colorsElm.appendChild(elm);
  })
}


let p = 5;

fetch('sample.json')
  .then(resp => resp.json())
  .then(({colors, greyColors,  data, revertedColors}) => {

  buildPallete(colors, revertedColors);

    const fill = (tab, i, j) => {
      const width = tab[0].length;
      const pointers = [[i, j]];
      const selectedValue = tab[i][j];

      const select = (i, j) => tab[i][j] = tab[i][j] * -1;

    const checkTopDown = (i,j) => {
      const nextIndex = i + 1;
      if (tab[nextIndex] && tab[nextIndex][j] == selectedValue) {
        pointers.push([nextIndex, j]);
      }

      if (tab[i - 1] && tab[i - 1][j] == selectedValue) {
        pointers.push([i - 1, j]);
      }
    }

    const next = () => {
      const [i, j] = pointers.pop();
      const tabRow = tab[i];

      if (tabRow[j] != selectedValue) {
        return;
      }
      select(i, j);
      checkTopDown(i, j);

      let pj = j + 1;
      let lj = j - 1;

      let presp = false;
      let lresp = false;

      while(pj < width && tabRow[pj] == selectedValue) {
        select(i, pj);
        checkTopDown(i, pj);
        pj += 1;
      }

      while(lj >= 0 && tabRow[lj] == selectedValue) {
        select(i, lj);
        checkTopDown(i, lj);
        lj --;
      }
    };

    while(pointers.length) {
      next();
    }


     return tab;
    };

    const drawLetters = () => {
      cLetters.width = data[0].length * p;
      cLetters.height = data.length * p;

      elements.style.width = data[0].length * p;
      elements.style.height = cLetters.height;

      ctxLetters.fillStyle = "#fff";
      ctxLetters.fillRect(0, 0, cLetters.width, cLetters.height);

      if (p >= 15) {
        ctxLetters.fillStyle = "#000";
        ctxLetters.textAlign = "center";
        ctxLetters.font = "12px Arial";
        for(var iRow = 0, len = data.length; iRow < len; iRow++) {
          const rowPos = p * iRow;

          for (var iColumn = 0; iColumn < data[iRow].length; iColumn++) {
            ctxLetters.fillText(data[iRow][iColumn], p * iColumn + p/2 ,rowPos + p/2 + 5);
          }
        }
      }
    };

    const draw = () => {
      c.width = data[0].length * p;
      c.height = data.length * p;
      ctx.clearRect(0, 0, c.width ,c.height);
      console.time("draw");
      for(var iRow = 0, len = data.length; iRow < len; iRow++) {
        const rowPos = p * iRow;

        for (var iColumn = 0; iColumn < data[iRow].length; iColumn++) {

          if (data[iRow][iColumn] < 0) {
            ctx.beginPath();
            ctx.rect(p * iColumn, rowPos, p + 1, p +1);
            ctx.fillStyle = currentColor;
            ctx.fill();
          } else if (p > 2) {
            ctx.beginPath();
            ctx.rect(p * iColumn, rowPos, p + 1, p +1);
            ctx.fillStyle = greyColors[data[iRow][iColumn]];
            ctx.fill();
          }
        }
      }
      console.timeEnd("draw");
    }

    const setSelected = (x, y) => {
      data = fill(data, x, y)
    }

    c.addEventListener('click', event => {
      const column = Math.ceil(event.layerX / p) - 1;
      const row = Math.ceil(event.layerY / p) - 1;
      setSelected(row, column);
      draw();
    },false);


  up.addEventListener('click', () => {
    p *=0.8;
  drawLetters();
  draw();
  })

  down.addEventListener('click', () => {
    p*=1.2;
  drawLetters();
  draw();
  });

  drawLetters();
  draw();
});

