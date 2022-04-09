/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import Experience from './Experience';
// import { Colors } from '../Constant/Constant';

export default class Renderer {
  private experience: Experience;

  private instance! : THREE.WebGLRenderer;

  public controls! : TrackballControls;

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

    // Make renderer background transparent
    this.instance.setClearColor(0x000000, 0);
    this.instance.setSize(window.innerWidth, window.innerHeight);
    this.instance.setPixelRatio(window.devicePixelRatio);

    // this.experience.targetElement!.style.position = 'absolute';
    // this.experience.targetElement!.style.top = '0px';
    // this.experience.targetElement!.style.left = '0px';
    // this.experience.targetElement!.style.width = '100%';
    // this.experience.targetElement!.style.height = '100%';

    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.autoUpdate = false;
    this.instance.shadowMap.needsUpdate = this.instance.shadowMap.enabled;

    this.controls = new TrackballControls(this.experience.camera.instance, this.experience.targetElement!);
  }

  public update() : void {
    this.controls.update();
    this.instance.render(this.experience.scene, this.experience.camera.instance);
  }
}
