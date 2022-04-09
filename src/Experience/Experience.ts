/* eslint-disable consistent-return */
/* eslint-disable import/no-cycle */
/* eslint-disable no-constructor-return */

import * as THREE from 'three';
import Renderer from './Renderer';
import Camera from './Camera';
import World from './World';

interface Config {
    debug : boolean;
    pixelRatio : number;
    width : number;
    height: number;
}

export default class Experience {
  static _instance:Experience;

  public renderer! : Renderer;

  public scene! : THREE.Scene;

  public camera! : Camera;

  public config! : Config;

  public targetElement! : HTMLElement | null;

  public world! : World;

  constructor() {
    if (Experience._instance) {
      return Experience._instance;
    }

    Experience._instance = this;

    this.targetElement = document.getElementById('viewer3d');

    this.setConfig();
    this.setScene();
    this.setCamera();
    this.setRenderer();
    this.setWorld();

    // @ts-ignore
    window.experience = this;
  }

  private setConfig() : void {
    // this.config.debug = false;
    // pixel ratio
    const pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);
    // width and height
    if (this.targetElement) {
      const boundings = this.targetElement.getBoundingClientRect();
      this.config = {
        debug: false,
        pixelRatio,
        width: boundings.width,
        height: boundings.height
      };
    }
  }

  private setScene() : void {
    this.scene = new THREE.Scene();
  }

  private setCamera() : void {
    this.camera = new Camera();
  }

  private setRenderer(): void {
    this.renderer = new Renderer();
  }

  private setWorld(): void {
    this.world = new World();
  }

  public update() : void {
    this.camera.update();

    if (this.renderer) { this.renderer.update(); }

    window.requestAnimationFrame(() => {
      this.update();
    });
  }
}
