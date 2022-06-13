/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import Experience from '../Experience';
import vertexShader from '../Shaders/portalHalo/vertex.glsl';
import fragmentShader from '../Shaders/portalHalo/fragment.glsl';

export default class Halo {
  private experience : Experience;

  private material! : THREE.ShaderMaterial;

  private count : number;

  constructor() {
    this.experience = new Experience();
    this.count = 0;
    this.setMesh();
  }

  private setMesh() : void {
    const geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms:
        {
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color('Black') },
          uColorB: { value: new THREE.Color('Red') },
          uColorC: { value: new THREE.Color('Orange') }
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
