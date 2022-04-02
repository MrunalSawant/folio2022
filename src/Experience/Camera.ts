/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import Experience from './Experience';

export default class Camera {
  private experience : Experience;

  public instance! : THREE.PerspectiveCamera;

  constructor() {
    this.experience = new Experience();
    this.setInstance();
  }

  private setInstance() : void {
    this.instance = new THREE.PerspectiveCamera(25, this.experience.config.width / this.experience.config.height, 0.1, 150);
    this.experience.scene.add(this.instance);
  }

  public update(): void {
    this.instance.updateMatrixWorld();
  }
}
