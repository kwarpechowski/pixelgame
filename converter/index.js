const getPixels = require('get-pixels');
const Color = require('color');
const fs = require('fs');

getPixels("w.png", function (err, pixels) {
  const set = new Set();
  const arrColors = [];
  let j = 0;
  for (let i = 0; i < pixels.data.length; i+=4) {
    j++;
    const color = `rgb(${pixels.data[i]},${pixels.data[i + 1]},${pixels.data[i + 2]})`;
    set.add(color);
    arrColors.push(color);
  }

  const colors = [...set];
  const colorsObj = {};
  const colorsTab = {};
  const revertedColors = {};
  const greyColors = {}
  colors.map((color, i) => {
    colorsObj[color] = i + 1;
    colorsTab[i + 1] = color;
    revertedColors[i + 1] = Color(color).isLight() ? '#000': '#fff';
    greyColors[i + 1] = Color(color).lighten(0.2).grayscale().alpha(0.7).toString();
  });

  const cong = arrColors.map(color => colorsObj[color]);

  const width = pixels.shape[0];
  const height = pixels.shape[1];

  const allTab = [];
  for(let i = 0; i < height; i++) {
    const tab = [];
    for(let j = 0; j < width; j++) {
      tab.push(cong[width*i+j]);
    }
    allTab.push(tab);
  }

  const resp = {
    colors:  colorsTab,
    greyColors,
    revertedColors,
    data: allTab
  };

  fs.writeFileSync('../sample.json', JSON.stringify(resp));

});
