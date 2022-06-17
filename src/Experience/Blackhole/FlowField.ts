/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import Experience from '../Experience';
import vertexShader from '../Shaders/flowField/vertex.glsl';
import fragmentShader from '../Shaders/flowField/fragment.glsl';

interface FBOUV{
    data : Float32Array;
    attribute: THREE.BufferAttribute | undefined;
}

interface RendererTargets{
  a : THREE.WebGLRenderTarget | undefined,
  b : THREE.WebGLRenderTarget | undefined,
  primary : THREE.WebGLRenderTarget | undefined,
  secondary : THREE.WebGLRenderTarget | undefined
}

function getDefaultRenderTarget() : RendererTargets {
  const renderTargets : RendererTargets = {
    a: undefined,
    b: undefined,
    primary: undefined,
    secondary: undefined
  };

  return renderTargets;
}

interface Environment{
  scene : THREE.Scene | undefined,
  camera: THREE.OrthographicCamera | undefined,
}

function getDefaultEnvironment() : Environment {
  const environment : Environment = {
    scene: undefined,
    camera: undefined
  };

  return environment;
}

function getDefaultFBOUV() : FBOUV {
  const fboUv : FBOUV = {
    data: new Float32Array(0),
    attribute: undefined
  };
  return fboUv;
}

export default class FlowField {
  private experience : Experience;

  private positions : Float32Array;

  public texture : any;

  private renderTargets! : RendererTargets;

  private width!: number;

  private height!: number;

  private seed! : number;

  private environment! : Environment;

  private planeMaterial! : THREE.ShaderMaterial;

  private baseTexture! : THREE.DataTexture;

  public fboUv! : FBOUV;

  private count!: number;

  constructor(positions: Float32Array) {
    this.experience = new Experience();
    this.positions = positions;

    this.setBaseTexture();
    this.setRenderTargets();
    this.setEnvironment();
    this.setPlane();
    this.setFboUv();
    this.render();
  }

  private setRenderTargets() : void {
    const a = new THREE.WebGLRenderTarget(
      this.width,
      this.height,
      {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        generateMipmaps: false,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        encoding: THREE.LinearEncoding,
        depthBuffer: false,
        stencilBuffer: false
      }
    );

    this.renderTargets = getDefaultRenderTarget();

    this.renderTargets.a = a;
    this.renderTargets.b = a.clone();
    this.renderTargets.primary = this.renderTargets.a;
    this.renderTargets.secondary = this.renderTargets.b;
  }

  private setBaseTexture() : void {
    this.width = 4096;
    this.count = this.positions.length / 3;
    this.height = Math.ceil(this.count / this.width);
    const size = 4096 * Math.ceil((3 * 4096));
    this.seed = Math.random() * 1000;

    const data = new Float32Array(size * 4);

    for (let i = 0; i < size; i += 1) {
      data[i * 4 + 0] = this.positions[i * 3 + 0];
      data[i * 4 + 1] = this.positions[i * 3 + 1];
      data[i * 4 + 2] = this.positions[i * 3 + 2];
      data[i * 4 + 3] = Math.random();
    }

    const baseTexture = new THREE.DataTexture(
      data,
      this.width,
      this.height,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    baseTexture.minFilter = THREE.NearestFilter;
    baseTexture.magFilter = THREE.NearestFilter;
    baseTexture.generateMipmaps = false;
  }

  private setEnvironment() : void {
    this.environment = getDefaultEnvironment();
    this.environment.scene = new THREE.Scene();
    this.environment.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    this.environment.camera.position.z = 1;
  }

  private setPlane() : void {
    const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.planeMaterial = new THREE.ShaderMaterial({
      // precision: 'highp',
      uniforms:
      {
        uTime: { value: 0 },
        uDelta: { value: 16 },

        uBaseTexture: { value: this.baseTexture },
        uTexture: { value: this.baseTexture },

        uDecaySpeed: { value: 0.00049 },

        uPerlinFrequency: { value: 4 },
        uPerlinMultiplier: { value: 0.004 },
        uTimeFrequency: { value: 0.0004 },
        uSeed: { value: this.seed }
      },
      vertexShader,
      fragmentShader
    });

    const planeMesh = new THREE.Mesh(planeGeometry, this.planeMaterial);
    this.experience.scene.add(planeMesh);
  }

  private render() : void {
    if (this.renderTargets.primary) {
      this.experience.renderer.instance.setRenderTarget(this.renderTargets.primary);
    }

    if (this.environment.scene && this.environment.camera) {
      this.experience.renderer.instance.render(this.environment.scene, this.environment.camera);
    }
    this.experience.renderer.instance.setRenderTarget(null);
    // Swap
    const temp = this.renderTargets.primary;
    this.renderTargets.primary = this.renderTargets.secondary;
    this.renderTargets.secondary = temp;

    // Update texture
    if (this.renderTargets.secondary) {
      this.texture = this.renderTargets.secondary.texture;
    }
  }

  private setFboUv() : void {
    this.fboUv = getDefaultFBOUV();

    this.fboUv.data = new Float32Array(this.count * 2);

    const halfExtentX = 1 / this.width / 2;
    const halfExtentY = 1 / this.height / 2;

    for (let i = 0; i < this.count; i += 1) {
      const x = (i % this.width) / this.width + halfExtentX;
      const y = Math.floor(i / this.width) / this.height + halfExtentY;

      this.fboUv.data[i * 2 + 0] = x;
      this.fboUv.data[i * 2 + 1] = y;
    }

    this.fboUv.attribute = new THREE.BufferAttribute(this.fboUv.data, 2);
  }

  public update() : void {
    // Update material
    this.planeMaterial.uniforms.uDelta.value = this.experience.time.getDelta();
    this.planeMaterial.uniforms.uTime.value = this.experience.time.getElapsedTime();
    if (this.renderTargets.secondary) {
      this.planeMaterial.uniforms.uTexture.value = this.renderTargets.secondary.texture;
    }

    this.render();
  }
}
