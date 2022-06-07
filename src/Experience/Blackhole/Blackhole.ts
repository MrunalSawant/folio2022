/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import Experience from '../Experience';
import vertexShader from '../Shaders/Blackhole/vertexShader.glsl';
import fragmentShader from '../Shaders/Blackhole/fragmentShader.glsl';

export default class Blackhole {
  private experience: Experience;

  private clock : THREE.Clock;

  private material!: THREE.ShaderMaterial;

  private count : number;

  constructor() {
    this.experience = new Experience();
    this.clock = new THREE.Clock();
    this.clock.start();
    this.count = 1560;
    this.setMesh();
  }

  private setMesh(): void {
    const geometry = new THREE.RingGeometry(1, 2, 32);
    this.material = new THREE.ShaderMaterial({
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

    const mesh = new THREE.Mesh(geometry, this.material);
    this.experience.scene.add(mesh);
  }

  public update() : void {
    this.count += 1;
    this.material.uniforms.uTime.value = this.count * 20;
  }
}
