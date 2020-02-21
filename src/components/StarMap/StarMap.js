import React, { Component } from 'react';
import * as THREE from 'three';

class StarMap extends Component {
  componentDidMount() {
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer();
    var camera = new THREE.PerspectiveCamera(
      75,
      1080 / 1080,
      0.1,
      1000
    );

    renderer.setSize(1080, 1080);
    this.mount.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    var animate = function() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  }
  render() {
    return <div ref={ref => (this.mount = ref)} />;
  }
}
 export default StarMap;
