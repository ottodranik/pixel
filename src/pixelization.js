export default (canvas, options) => {
  const context = canvas.getContext('2d')

  // Представление всех ячеек
  const cells = []
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  // console.log(options.cellValue)
  const cellWidth = options.cellValue || 5;
  const cellHeight = options.cellValue || 5;
  // const cellsInRow = Math.floor(canvasWidth / cellWidth);
  // const cellsInColumn = Math.floor(canvasHeight / cellHeight);

  for (let left = 0; left < canvasWidth; left += cellWidth) {
    for (let top = 0; top < canvasHeight; top += cellHeight) {
      let cell = {
        top: top,
        left: left,
        solid: false,
        pixelsColors: [],
        fillColor: null,
        // аргумент говорит о том каким цветом закрашивать клетку. Предполагается что у клетки может быть 2 цвета. 
        fill: function (solid, color) {
          // запоминаем состояние закрашенности клетки
          this.solid = solid;
          context.fillStyle = this.fillColor
            ? this.fillColor
            : color
              ? color
              : 'rgba(0, 0, 0, 0)';
          context.fillRect(this.left, this.top, cellHeight, cellWidth);
        },
        drawBorder: function () {
          context.beginPath();
          context.strokeStyle = '#000';
          // magic. According to http://stackoverflow.com/questions/8696631/canvas-drawings-like-lines-are-blurry
          context.moveTo(this.top - 0.5, this.left - 0.5);
          context.lineTo(this.top - 0.5, this.left + cellWidth - 0.5);
          context.lineTo(this.top + cellHeight - 0.5, this.left + cellWidth - 0.5);
          context.lineTo(this.top + cellHeight - 0.5, this.left - 0.5);
          context.lineTo(this.top - 0.5, this.left - 0.5);
          context.stroke();
        },
        getTop: function () {
          return this.top;
        },
        getLeft: function () {
          return this.left;
        }
        
      }
      cells.push(cell);
      cell.fill(true);
      // cell.drawBorder()
    }
  }


  const pixelsData = context.getImageData(0, 0, canvas.width, canvas.height);
  // console.log(pixelsData);
  // console.log(cells);
  // console.log(pixelsData.data.length, pixelsData.data.length/4);
  cells.forEach((cell, cellIndex) => {
    const top = cell.getTop();
    const left = cell.getLeft();
    let i = 0;
    let j = 0;
    let k = 0;
    const pIndex = ((top * canvasWidth) + left) * 4;
    // console.log(pIndex, top, left) // DEBUG: индекс смещения, top и left углы данной ячейки
    while (i < pIndex * cellHeight) {

      cell.pixelsColors[k] = []; // создать массив для данного пикселя в ячейке

      while (j < cellWidth * 4) {
        cell.pixelsColors[k].push([
          pixelsData.data[pIndex+0],
          pixelsData.data[pIndex+1],
          pixelsData.data[pIndex+2],
          pixelsData.data[pIndex+3]
        ]);
        j = j + 4;
      }
      i += pIndex;
      j = 0;
      k++;
    }    

    const colors = {}
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
      }
    });
    cell.fillColor = `rgba(${mostPopular})`;
  });

  context.clearRect(0, 0, canvas.width, canvas.height);

  cells.forEach(cell => {
    cell.fill(true);
  })

  // console.log(cells);
}