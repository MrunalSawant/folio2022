/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import Experience from '../Experience';
import { Item, getDefaultItem } from '../../Utils/Item';
import LightningTexure from '../../Assets/blackhole/lightning.png';
import vertexShader from '../Shaders/lightnings/vertex.glsl';
import fragmentShader from '../Shaders/lightnings/fragment.glsl';

export default class Flash {
  private experience : Experience;

  private items! : Item[];

  private group : THREE.Group;

  constructor() {
    this.experience = new Experience();
    this.group = new THREE.Group();

    this.setMesh();
  }

  private setMesh() : void {
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.items = [];

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(LightningTexure);

    for (let i = 0; i < 4; i += 1) {
      const item = getDefaultItem();
      item.floatingSpeed = Math.random() * 0.5;
      item.rotationSpeed = (Math.random() - 0.5) * Math.random() * 0.0002 + 0.0002;
      item.progress = Math.random();

      item.material = new THREE.ShaderMaterial({
        depthWrite: false,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms:
        {
          uMaskTexture: { value: texture },
          uColor: { value: new THREE.Color('Red') },
          uAlpha: { value: 1 }
        },
        vertexShader,
        fragmentShader
      });

      // Angle
      item.angle = Math.random() * Math.PI * 2;

      // Mesh
      item.mesh = new THREE.Mesh(geometry, item.material);
      item.mesh.position.z = -(i + 0.5) * 0.0005;
      this.group.add(item.mesh);

      // Save
      this.items.push(item);

      this.experience.scene.add(this.group);
    }
  }

  public update(): void {
    const elapsedTime = this.experience.time.getElapsedTime() * 1234.12;

    this.items.forEach((item) => {
      // Progress
      item.progress += this.experience.time.getDelta() * 0.0005;

      if (item.progress > 1) {
        item.progress = 0;
        item.angle = Math.random() * Math.PI * 2;
      }

      // Opacity
      (item.material as THREE.ShaderMaterial).uniforms.uAlpha.value = Math.min((1 - item.progress) * 8, item.progress * 200);
      (item.material as THREE.ShaderMaterial).uniforms.uAlpha.value = Math.min((item.material as THREE.ShaderMaterial).uniforms.uAlpha.value, 1);
      // item.material.opacity *= 0.25

      // Rotation
      if (item.mesh !== undefined) {
        item.mesh.rotation.z = elapsedTime * item.rotationSpeed;

        // Position
        // console.log(this.time.delta)
        const radius = 1 - item.progress * item.floatingSpeed;
        item.mesh.position.x = Math.sin(item.angle) * radius;
        item.mesh.position.y = Math.cos(item.angle) * radius;
      }
    });
  }
}
