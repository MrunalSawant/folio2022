/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import Experience from './Experience';

export default class World {
  private experience: Experience;

  constructor() {
    this.experience = new Experience();
    this.setWorld();
  }

  private setWorld() : void {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.experience.scene.add(cube);
  }
}
