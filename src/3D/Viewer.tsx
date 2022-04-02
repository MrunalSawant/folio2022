import React from 'react'

export class Viewer extends React.Component {
    
    render() {
        return <div>
          <div className="viewer-container" >
            <canvas id="viewer3d" />
          </div>
        </div >
      }
}
