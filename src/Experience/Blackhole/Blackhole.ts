/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import Experience from '../Experience';
import vertexShader from '../Shaders/Blackhole/vertexShader.glsl';
import fragmentShader from '../Shaders/Blackhole/fragmentShader.glsl';
import Halo from './Halo';
import Smoke from './Smoke';
import Flash from './Flash';
import Particle from './Particle';

export default class Blackhole {
  private experience: Experience;

  private material!: THREE.ShaderMaterial;

  private halo : Halo;

  private smoke : Smoke;

  private flash : Flash;

  private particle: Particle;

  constructor() {
    this.experience = new Experience();
    this.halo = new Halo();
    this.smoke = new Smoke();
    this.flash = new Flash();
    this.particle = new Particle();
    this.setMesh();
  }

  private setMesh(): void {
    const geometry = new THREE.RingGeometry(1, 2, 32);
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.NormalBlending,
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
    this.material.uniforms.uTime.value = this.experience.time.getElapsedTime() * 1000;
    this.halo.update();
    this.smoke.update();
    this.flash.update();
    this.particle.update();
  }
}
