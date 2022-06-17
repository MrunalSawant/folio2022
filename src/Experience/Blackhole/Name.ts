/* eslint-disable import/no-cycle */
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import Experience from '../Experience';

export default class Name {
  private experience : Experience;

  private xMid! : number;

  constructor() {
    this.experience = new Experience();
    this.setMesh();
  }

  private setMesh() : void {
    const loader = new FontLoader();
    loader.load('../Fonts/gentilis_regular.typeface.json', (font) => {
      const color = new THREE.Color(0x006699);

      const matLite = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });

      const message = 'Mrunal Sawant';

      const shapes = font.generateShapes(message, 100);

      const geometry = new THREE.ShapeGeometry(shapes);

      geometry.computeBoundingBox();

      if (geometry !== null && geometry.boundingBox) {
        this.xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

        geometry.translate(this.xMid, 0, 0);

        // make shape ( N.B. edge view not visible )

        const text = new THREE.Mesh(geometry, matLite);
        text.name = 'text';
        text.position.z = -150;
        this.experience.scene.add(text);
      }

      // make line shape ( N.B. edge view remains visible )

      const holeShapes = [];

      for (let i = 0; i < shapes.length; i += 1) {
        const shape = shapes[i];

        if (shape.holes && shape.holes.length > 0) {
          for (let j = 0; j < shape.holes.length; j += 1) {
            const hole = shape.holes[j];
            holeShapes.push(hole);
          }
        }
      }
    });
  }
}
