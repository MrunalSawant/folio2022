/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import Experience from '../Experience';
import FlowField from './FlowField';
import ParticleMaskTexture from '../../Assets/blackhole/particle.png';
import vertexShader from '../Shaders/particle/vertex.glsl';
import fragmentShader from '../Shaders/particle/fragment.glsl';

export default class Particle {
  private experience : Experience;

  private positions! : Float32Array;

  private geometry! : THREE.BufferGeometry;

  private material! : THREE.ShaderMaterial;

  private count! : number;

  private flowField! : FlowField;

  constructor() {
    this.experience = new Experience();
    this.setPositions();
    this.setFlowField();
    this.setGeometry();
    this.setMaterial();
    this.setPoints();
  }

  private setFlowField() : void {
    this.flowField = new FlowField(this.positions);
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
    if (this.flowField.fboUv.attribute !== undefined) {
      this.geometry.setAttribute('aFboUv', this.flowField.fboUv.attribute);
    }
  }

  private setMaterial() : void {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(ParticleMaskTexture);

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms:
      {
        uColor: { value: new THREE.Color('Red') },
        uSize: { value: 30 * this.experience.config.pixelRatio },
        uMaskTexture: { value: texture },
        uFBOTexture: { value: this.flowField.texture }
      },
      vertexShader,
      fragmentShader
    });
  }

  private setPoints() : void {
    const points = new THREE.Points(this.geometry, this.material);
    this.experience.scene.add(points);
  }

  public update() : void {
    this.flowField.update();
    this.material.uniforms.uFBOTexture.value = this.flowField.texture;
  }
}
