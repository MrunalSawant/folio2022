import * as THREE from 'three';

interface Item {
    floatingSpeed : number;
    rotationSpeed : number;
    progress : number;
    material : THREE.MeshBasicMaterial | THREE.ShaderMaterial | undefined;
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

export { type Item, getDefaultItem };
