import React, { ReactElement } from 'react';
import './Viewer.scss';
import Experience from '../Experience/Experience';

export class Viewer extends React.Component {
  async componentDidMount(): Promise<void> {
    const experience = new Experience();
    experience.update();
  }

  render(): ReactElement {
    return (
      <div>
        <div className="viewer-container">
          <canvas id="viewer3d" />
        </div>

      </div>
    );
  }
}
