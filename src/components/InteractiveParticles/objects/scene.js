import * as THREE from 'three';

export default class Canvas {
  constructor () {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x111111);
  }

  add (obj) {
    this.scene.add(obj)
  }

  remove (obj) {
    this.scene.remove(obj)
  }

  get () {
    return this.scene
  }
}
