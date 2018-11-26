import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import hqx from 'js-hqx';

// function show(data){
//   var png = new PNG(data);
//   var img = document.getElementById('image'), limg = document.getElementById('largeimage');
//   document.getElementById('nativeimage').src = 'data:image/png;base64,' + data;
//   img.innerHTML = '';
//   limg.innerHTML = '';
//   img.style.width = png.width + 'px';
//   img.style.height = png.height + 'px';
//   limg.style.width = (png.width * 3) + 'px';
//   limg.style.width = (png.height * 3) + 'px';
//   var line;
//   while(line = png.readLine())
//   {
//       for (var x = 0; x < line.length; x++){
//           var px = document.createElement('div'), px2 = document.createElement('div');
//           px.className = px2.className = 'pixel';
//           px.style.backgroundColor = px2.style.backgroundColor = '#' + line[x].toString(16).padRight('0', 6);
//           img.appendChild(px);
//           limg.appendChild(px2);
//       }
//   }
// }

function drawPixelsPoints2(pixels) {
  const pixelsWidth = pixels.width * 4;
  const pixelsArray = Array(pixels.data.length).fill(0);

  const fillArray = (item, index) => {
    if (item !== 0 && typeof pixelsArray[index] !== 'undefined') {
      pixelsArray[index] = item;
      if (typeof pixelsArray[index - pixelsWidth] !== 'undefined') {
        pixelsArray[index - pixelsWidth] = item;
      }
      if (typeof pixelsArray[index + pixelsWidth] !== 'undefined') {
        pixelsArray[index + pixelsWidth] = item;
      }
      if (typeof pixelsArray[index - 4] !== 'undefined') {
        pixelsArray[index - 4] = item;
      }
      if (typeof pixelsArray[index + 4] !== 'undefined') {
        pixelsArray[index + 4] = item;
      }
    }
  };

  pixels.data.forEach((item, index) => {
    fillArray(item, index);
    fillArray(item, index + 4);
    fillArray(item, index + 8);
    fillArray(item, index - 4);
    fillArray(item, index - 8);
    fillArray(item, pixelsWidth + index + 4);
    fillArray(item, pixelsWidth + index + 8);
    fillArray(item, pixelsWidth + index - 4);
    fillArray(item, pixelsWidth + index - 8);
  });
  return new Uint8ClampedArray(pixelsArray);
}

function drawNet(width, height, coef) {
  var canvas = document.querySelector('canvas')
  var context = canvas.getContext('2d')

  const image = new Image();
  image.src = logo;
  image.onload = () => {
    
  

  // Представление всех ячеек
  var cells = []
  var canvasWidth = 600
  var canvasHeight = 600
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  var cellWidth = 5
  var cellHeight = 5
  var cellsInRow = Math.floor(canvasWidth / cellWidth)
  var cellsInColumn = Math.floor(canvasHeight / cellHeight)

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  setTimeout(() => {
  for (var top = 0; top < canvasWidth; top += cellWidth) {
    for (var left = 0; left < canvasHeight; left += cellHeight) {
      let cell = {
        top: top,
        left: left,
        solid: false,
        pixelsColors: [],
        // аргумент говорит о том каким цветом закрашивать клетку. Предполагается что у клетки может быть 2 цвета. 
        fill: function (solid, color) {
          // запоминаем состояние закрашенности клетки
          this.solid = solid;
          context.fillStyle = color ? color : 'rgba(255, 255, 255, 0)';
          context.fillRect(this.top, this.left, cellWidth,cellHeight);
        },
        drawBorder: function () {
          context.beginPath();
          context.strokeStyle = '#000';
          // magic. According to http://stackoverflow.com/questions/8696631/canvas-drawings-like-lines-are-blurry
          context.moveTo(this.top - 0.5, this.left - 0.5)
          context.lineTo(this.top - 0.5, this.left + cellWidth - 0.5)
          context.lineTo(this.top + cellHeight - 0.5, this.left + cellWidth - 0.5)
          context.lineTo(this.top + cellHeight - 0.5, this.left - 0.5)
          context.lineTo(this.top - 0.5, this.left - 0.5)
          context.stroke()
        },
        getTop: function () {
          return this.top
        },
        getLeft: function () {
          return this.left
        }
        
      }
      cells.push(cell)
      cell.fill(true)
      // cell.drawBorder()
    }
  }


  const pixelsData = context.getImageData(0, 0, canvas.width, canvas.height);
  console.log(pixelsData);
  console.log(cells);
  cells.forEach((cell, cellIndex) => {
    const oneCellPixels = [];
    const top = cell.getTop();
    const left = cell.getLeft();
    // console.log(top, left)
    let i = 0;
    let j = 0;
    let k = 0;
    let pIndex = ((top * canvasWidth) + left) * cellWidth * 4;
    while (i < pIndex * cellHeight) {
      // console.log(top + i);
      
      cell.pixelsColors[k] = [];
      while (j < cellWidth * 4) {
        // cell.pixelsColors[k][l] = [];
        
        // let pIndex = 675826;
    //     // console.log(top, left, pIndex);
        cell.pixelsColors[k].push([
          pixelsData.data[pIndex+i+j+0],
          pixelsData.data[pIndex+i+j+1],
          pixelsData.data[pIndex+i+j+2],
          pixelsData.data[pIndex+i+j+3]
        ]);
        j = j + 4;
      }
      i += pIndex;
      j = 0;
      k++;
    }
    // pixelsInCells.push(oneCellPixels);
  // context.clearRect(0, 0, canvas.width, canvas.height);

  const colors = {}
  // let cell = pixelsInCells[index];
  cell.pixelsColors.forEach(row => {
    row.forEach(col => {
      const color = col.join(',');
      if (!colors[color]) {
        colors[color] = 1;
      } else {
        colors[color]++;
      }
    });
  })
  // console.log(colors);
  const mostPopularColors = Object.keys(colors).sort((a, b) => {
    return colors[b] - colors[a];
  })

  let mostPopular;
  mostPopularColors.forEach((item, index) => {
    if ((!mostPopular && item !== ',,,' && item !== '0,0,0,0') || !mostPopularColors[index+1]) {
      mostPopular = item;
      console.log(cell.top, cell.left, item);
    }
  });
  // console.log(mostPopular);
  // item.fill(true, '#000')
  // if (cellColor[0] && cellColor[1] && cellColor[2] && cellColor[3]) {
    cell.fill(true, `rgba(${mostPopular})`);
    // cell.fill(true, `rgba(0, 0, 0, 0.5)`);
  // }
  cells.forEach((cell, index) => {
    
  })
});

  console.log(cells);
}, 1000)
  

  // function getCellByPosition(top, left) {
  //   var topIndex = Math.floor(top / cellHeight) * cellsInRow
  //   var leftIndex = Math.floor(left / cellWidth)
  //   return cells[topIndex + leftIndex]
  // }

  // // Взаимодействие
  // var filling = false

  // function fillCellAtPositionIfNeeded(x, y, fillingMode) {
  //   var cellUnderCursor = getCellByPosition(x, y)
  //   if (cellUnderCursor.solid !== fillingMode) {
  //     cellUnderCursor.fill(fillingMode)
  //   }
  //   cell.drawBorder()
  // }
  // function handleMouseDown(event) {
  //   // нужно вычислить координаты клика относительно верхнего левого края canvas
  //   // это делается с использованием вычисления координат канваса и кроссбраузерных свойств объекта event
  //   // я использую некроссбраузерные свойства объекта событий
  //   filling = !getCellByPosition(event.layerX, event.layerY).solid
  //   fillCellAtPositionIfNeeded(event.layerX, event.layerY, filling)

  //   canvas.addEventListener('mousemove', handleMouseMove, false)
  // }

  // function handleMouseUp() {
  //   canvas.removeEventListener('mousemove', handleMouseMove)
  // }

  // function handleMouseMove(event) {
  //   fillCellAtPositionIfNeeded(event.layerX, event.layerY, filling)
  // }

  // canvas.addEventListener('mousedown', handleMouseDown, false)
  // canvas.addEventListener('mouseup', handleMouseUp, false)
}
}

function drawPixelsPoints3(pixels, coef) {
  const pixelsWidth = pixels.width * 4;
  const pixelsArray = Array(pixels.data.length).fill(0);
  pixels.data.forEach((item, index) => {
    if (typeof item !== 'undefined') {
      pixelsArray[index] = item;
      if (pixelsArray[index - pixelsWidth]) {
        pixelsArray[index - pixelsWidth] = (pixelsArray[index - pixelsWidth] + item) / 2;
      }
      if (pixelsArray[index + pixelsWidth]) {
        pixelsArray[index + pixelsWidth] = (pixelsArray[index + pixelsWidth] + item) /2;
      }
      if (pixelsArray[index - 4]) {
        pixelsArray[index - 4] = (pixelsArray[index - 4] + item) / 2;
      }
      if (pixelsArray[index + 4]) {
        pixelsArray[index + 4] = (pixelsArray[index + 4] + item) / 2;
      }
    }
  });
  return new Uint8ClampedArray(pixelsArray);
}

function drawPixelsPoints(pixels) {
  const pixelsWidth = pixels.width * 4;
  return pixels.data.map((item, index) => {
    if (Math.floor(index / pixelsWidth) % 2) { // получить чётность/нечётность линии
      if ([0, 1, 2, 3].indexOf(index % 8) !== -1) {
        return 0;
      } else {
        return item;
      }
    } else {
      if ([0, 1, 2, 3].indexOf(index % 8) !== -1) {
        return item;
      } else {
        return 0;
      }
    }
  });
}

class App extends Component {

  componentWillMount() {
    this.setState({
      canvas: {
        canvasWidth: 800,
        canvasHeight: 600
      }
    })
  }
  
  componentDidMount() {
    const { canvasWidth, canvasHeight } = this.state.canvas;
    this.canvasA.width = canvasWidth;
    this.canvasA.height = canvasHeight;
    this.canvasB.width = canvasWidth;
    this.canvasB.height = canvasHeight;

    // const contextA = this.canvasA.getContext('2d');
    // const contextB = this.canvasB.getContext('2d');
    // const image = new Image();
    // image.src = logo;
    // image.onload = () => {
    //   contextA.drawImage(image, 0, 0, this.canvasA.width, this.canvasA.height);
    //   const pixelsData = contextA.getImageData(0, 0, this.canvasA.width, this.canvasA.height);
    //   console.log(pixelsData);
    //   const newData = new ImageData(
    //     // pixelsData.data.slice(0, pixelsData.data.length/2),
    //     drawPixelsPoints3(pixelsData, 10),
    //     pixelsData.width,
    //     pixelsData.height
    //   );
    //   // contextB.drawImage(newData, 0, 0, this.canvasA.width, this.canvasA.height);
    //   console.log(newData);
    //   contextB.putImageData(newData, 0, 0);
    //   // this.pngUrl = this.canvasA.toDataURL();
    //   // console.log(this.pngUrl.readline())
    // };
    drawNet();
  }

  render() {
    return (
      <div className="App">
        <canvas className="canvasStyle" ref={canvasA => this.canvasA = canvasA} />
        <canvas className="canvasStyle" ref={canvasB => this.canvasB = canvasB} />
      </div>
    );
  }
}

export default App;
