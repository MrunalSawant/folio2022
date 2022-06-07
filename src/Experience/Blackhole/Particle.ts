import * as THREE from 'three';
import Experience from '../Experience';

export default class Particle {
  private experience : Experience;

  private positions! : Float32Array;

  private geometry! : THREE.BufferGeometry;

  private count! : number;

  constructor() {
    this.experience = new Experience();

    this.setPositions();
  }

  private setPositions() : void {
    const ringCount = 30000;
    const insideCount = 5000;
    this.count = ringCount + insideCount;
    this.positions = new Float32Array(this.count * 3);

    let i = 0;
    for (i = 0; i < ringCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      this.positions[i * 3 + 0] = Math.sin(angle);
      this.positions[i * 3 + 1] = Math.cos(angle);
      this.positions[i * 3 + 2] = 0;
    }

    for (; i < this.count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() ** 2 * 1;
      this.positions[i * 3 + 0] = Math.sin(angle) * radius + Math.random() * 0.2;
      this.positions[i * 3 + 1] = Math.cos(angle) * radius + Math.random() * 0.2;
      this.positions[i * 3 + 2] = 0;
    }
  }

  private setGeometry() : void {
    const sizes = new Float32Array(this.count);

    for (let i = 0; i < this.count; i += 1) {
      sizes[i] = 0.2 + Math.random() * 0.8;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    // this.geometry.setAttribute('aFboUv', this.flowField.fboUv.attribute);
  }
}
