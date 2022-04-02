/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import Experience from './Experience';
import { Colors } from '../Constant/Constant';

export default class Renderer {
  private experience: Experience;

  private instance! : THREE.WebGLRenderer;

  constructor() {
    this.experience = new Experience();
    this.setInstance();
  }

  private setInstance() : void {
    this.instance = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      canvas: this.experience.targetElement as HTMLCanvasElement
    });

    this.instance.setClearColor(Colors.rendererBackground, 1);

    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.autoUpdate = false;
    this.instance.shadowMap.needsUpdate = this.instance.shadowMap.enabled;
  }

  public update() : void {
    this.instance.render(this.experience.scene, this.experience.camera.instance);
  }
}
