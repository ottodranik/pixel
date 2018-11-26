import React, { Component } from 'react';
import './App.css';
import pixelization from './pixelization';

class App extends Component {

  componentWillMount() {
    this.setState({
      defaultCanvas: {
        canvasWidth: 300,
        canvasHeight: 300
      },
      isImage: false
    })
  }

  handleImageChange = ($event) => {
    const context = this.canvas.getContext('2d');
    const image = new Image();
    image.onload = (imageData) => {
      this.canvas.width = imageData.path[0].width;
      this.canvas.height = imageData.path[0].height;
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
      this.setState({ isImage: true })
    }
    image.src = URL.createObjectURL($event.target.files[0]);
  }

  pixelizationHandler = () => {
    pixelization(this.canvas, { cellValue: +this.cellValue.value });
  }

  render() {
    return (
      <div className="App">
        <div style={{ width: '200px' }}>
          {(this.state.isImage)
            ?
              <div>
                <label style={{ marginBottom: '20px' }}>
                  <span>Размер ячейки</span>
                  <input style={{ width: '50px' }} type="number" ref={cellValue => this.cellValue = cellValue} />
                </label>
                <button onClick={this.pixelizationHandler}>Пикселизировать</button>
              </div>
            : null
          }
        </div>
        <div className={`fileWrapper ${!this.state.isImage ? 'fileWrapperBg' : ''}`}>
          <canvas className="canvasStyle" ref={canvas => this.canvas = canvas} />
          <input
            type="file"
            id="file"
            className="inputFile"
            onChange={this.handleImageChange}
          />
        </div>
      </div>
    );
  }
}

export default App;
