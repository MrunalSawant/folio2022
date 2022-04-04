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
    this.instance = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 150);
    this.instance.position.set(0, 10, 10);
    this.instance.lookAt(new THREE.Vector3());
    // this.experience.scene.add(this.instance);
  }

  public update(): void {
    this.instance.updateMatrixWorld();
    this.instance.updateMatrix();
  }
}
