/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import Experience from './Experience';
import EarthTexture from '../Assets/EarthTexture.jpg';
import SunTexture from '../Assets/SunTexture.jpg';

export default class World {
  private experience: Experience;

  private sun! : THREE.Mesh;

  private earth! : THREE.Mesh;

  constructor() {
    this.experience = new Experience();
    this.setWorld();
    // this.setLight();
  }

  private setWorld() : void {
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // const edges = new THREE.EdgesGeometry(geometry);
    // const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    // this.experience.scene.add(cube);
    // this.experience.scene.add(line);

    this.setSun();
    this.setEarth();
  }

  private setEarth() : void {
    const geometry = new THREE.SphereBufferGeometry(0.125, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load(
      EarthTexture
    );
    const material = new THREE.MeshBasicMaterial({ map: normalTexture });
    this.earth = new THREE.Mesh(geometry, material);
    this.earth.position.set(1.5, 0, 0);
    this.experience.scene.add(this.earth);
  }

  private setSun() : void {
    const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load(
      SunTexture
    );
    const material = new THREE.MeshBasicMaterial({ map: normalTexture });
    this.sun = new THREE.Mesh(geometry, material);

    this.experience.scene.add(this.sun);
  }

  private setLight() : void {
    const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.5);
    hemisphereLight.position.set(20, 20, 20);
    hemisphereLight.castShadow = false;

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 80000, 10);
    pointLight.position.set(-200, 400, 200);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.radius = 1;

    this.experience.scene.add(hemisphereLight);
    this.experience.scene.add(pointLight);
  }

  public update(): void {
    this.sun.rotation.y += 0.01;
    this.earth.rotation.y += 0.0125;

    const r = Date.now() * 0.0005;

    this.earth.position.x = 2 * Math.cos(r);
    this.earth.position.z = 2 * Math.sin(r);
    this.earth.position.y = 2 * Math.sin(r);
  }
}
