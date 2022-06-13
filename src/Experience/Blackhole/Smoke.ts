/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import Experience from '../Experience';
import SmokeTexture from '../../Assets/smoke/smoke.png';

interface Item {
    floatingSpeed : number;
    rotationSpeed : number;
    progress : number;
    material : THREE.MeshBasicMaterial | undefined;
    scale : number;
    angle : number;
    mesh : THREE.Mesh | undefined;
}

function getDefaultItem() : Item {
  const item : Item = {
    floatingSpeed: 0.0,
    rotationSpeed: 0.0,
    progress: 0.0,
    material: undefined,
    scale: 0.0,
    angle: 0.0,
    mesh: undefined
  };

  return item;
}

export default class Smoke {
  private experience : Experience;

  private items! : Item[];

  private group! : THREE.Group;

  constructor() {
    this.experience = new Experience();
    this.group = new THREE.Group();
    this.setMesh();
  }

  private setMesh() : void {
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.items = [];

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(SmokeTexture);

    for (let i = 0; i < 40; i += 1) {
      const item = getDefaultItem();

      item.floatingSpeed = Math.random() * 0.5;
      item.rotationSpeed = (Math.random() - 0.5) * Math.random() * 0.0002 + 0.0002;
      item.progress = Math.random();
      item.material = new THREE.MeshBasicMaterial({
        depthWrite: false,
        transparent: true,
        blending: THREE.AdditiveBlending,
        alphaMap: texture,
        side: THREE.DoubleSide,
        opacity: 1
      });
      item.angle = Math.random() * Math.PI * 2;
      item.mesh = new THREE.Mesh(geometry, item.material);

      item.material.color = new THREE.Color('Orange');
      // Mesh
      // item.mesh = new THREE.Mesh(this.geometry, item.material);
      item.mesh.position.z = (i + 1) * 0.0005;
      this.group.add(item.mesh);

      // Save
      this.items.push(item);
    }
    // Add in the scene
    this.experience.scene.add(this.group);
  }

  public update() : void {
    const elapsedTime = this.experience.time.getElapsedTime() * 1500;
    this.items.forEach((item) => {
      item.progress += this.experience.time.getDelta() * 0.001;

      if (item.progress > 1) { item.progress = 0; }

      // Opacity
      if (item.material !== undefined) {
        item.material.opacity = Math.min((1 - item.progress) * 2, item.progress * 4);
        item.material.opacity = Math.min(item.material.opacity, 1);
        item.material.opacity *= 0.25;
      }

      if (item.mesh !== undefined) {
        // Rotation
        item.mesh.rotation.z = elapsedTime * item.rotationSpeed;
        // Position
        const radius = 1 - item.progress * item.floatingSpeed;
        item.mesh.position.x = Math.sin(item.angle) * radius;
        item.mesh.position.y = Math.cos(item.angle) * radius;
      }
    });
  }
}
