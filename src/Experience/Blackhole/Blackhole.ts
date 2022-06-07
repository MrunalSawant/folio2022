/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import Experience from '../Experience';
import vertexShader from '../Shaders/Blackhole/vertexShader.glsl';
import fragmentShader from '../Shaders/Blackhole/fragmentShader.glsl';

export default class Blackhole {
  private experience: Experience;

  constructor() {
    this.experience = new Experience();
    this.setMesh();
  }

  private setMesh(): void {
    console.log(vertexShader);
    console.log(fragmentShader);
    const geometry = new THREE.PlaneGeometry(3, 3, 1, 1);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms:
            {
              uTime: { value: 0 },
              uColorStart: { value: new THREE.Color('Red') },
              uColorEnd: { value: new THREE.Color('Orange') }
            },
      vertexShader,
      fragmentShader
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.experience.scene.add(mesh);
  }
}
