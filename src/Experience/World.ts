/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import * as dat from 'dat.gui';
import Experience from './Experience';
import EarthTexture from '../Assets/EarthTexture.jpg';
import SunTexture from '../Assets/SunTexture.jpg';
import GalaxyBk from '../Assets/galaxy/redeclipse_bk.png';
import GalaxyDn from '../Assets/galaxy/redeclipse_dn.png';
import GalaxyLf from '../Assets/galaxy/redeclipse_lf.png';
import GalaxyRt from '../Assets/galaxy/redeclipse_rt.png';
import GalaxyUp from '../Assets/galaxy/redeclipse_up.png';
import GalaxyFt from '../Assets/galaxy/redeclipse_ft.png';

const gui = new dat.GUI();
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
    this.setSkyBox();
  }

  private setEarth() : void {
    const geometry = new THREE.SphereBufferGeometry(25, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load(
      EarthTexture
    );
    const material = new THREE.MeshBasicMaterial({ map: normalTexture });
    this.earth = new THREE.Mesh(geometry, material);
    this.earth.position.set(1.5, 0, 0);
    this.experience.scene.add(this.earth);

    gui.add(this.experience.camera.instance.position, 'z').min(0).max(1000).name('Camera z')
      .step(1);
    gui.add(this.experience.camera.instance.position, 'y').min(0).max(1000).name('Camera y')
      .step(1);
  }

  private setSun() : void {
    const geometry = new THREE.SphereBufferGeometry(100, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load(
      SunTexture
    );
    const material = new THREE.MeshBasicMaterial({ map: normalTexture });
    this.sun = new THREE.Mesh(geometry, material);

    // this.experience.scene.add(this.sun);
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

  private setSkyBox() : void {
    const skyBoxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
    const matArr = this.createMaterialArray();
    const skybox = new THREE.Mesh(skyBoxGeometry, matArr);
    this.experience.scene.add(skybox);
  }

  private createMaterialArray(): THREE.Material[] {
    const textures = [GalaxyFt, GalaxyBk, GalaxyUp, GalaxyDn, GalaxyRt, GalaxyLf];
    const matArr = textures.map((texture) => {
      const t = new THREE.TextureLoader().load(texture);
      return new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide });
    });
    return matArr;
  }

  public update(): void {
    this.sun.rotation.y += 0.01;
    this.earth.rotation.y += 0.0125;

    //    const r = Date.now() * 0.5;

    // this.earth.position.x = 100 * Math.cos(r);
    // // this.earth.position.z = 100 * Math.sin(r);
    // this.earth.position.y = 100 * Math.sin(r);
  }
}
