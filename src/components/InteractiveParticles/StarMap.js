import React, { Component } from 'react';
import * as THREE from 'three';
import disc from './disc.png';
import './style.css';

class StarMap extends Component {
  componentDidMount() {
    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0,0,0,0);
    scene.fog = new THREE.FogExp2(0x000000, 0.001);
    
    let camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      2,
      2000
    );
    camera.position.z = 1000;

    let canvas = this.mount.domElement;
    let renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
    });
    renderer.setClearAlpha(0.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(renderer.domElement);

    var geometry = new THREE.BufferGeometry();
    var vertices = [];

    var sprite = new THREE.TextureLoader().load(disc);

    for (var i = 0; i < 4000; i++) {

      var x = 2000 * Math.random() - 1000;
      var y = 2000 * Math.random() - 1000;
      var z = 1000 * Math.random() - 1000;

      vertices.push(x, y, z);

    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    let material = new THREE.PointsMaterial({ size: 10, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true });
    material.color.setRGB(255, 255, 255, 0.25)

    var particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // VIDEO
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia() not supported.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then(function(stream) {
        var video = document.querySelector("video");
        if ("srcObject" in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });


    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    //

    window.addEventListener('resize', onWindowResize, false);


    function onWindowResize() {

      windowHalfX = 1080 / 2;
      windowHalfY = 1080 / 2;

      camera.aspect = 1080 / 1080;
      camera.updateProjectionMatrix();

      renderer.setSize(1080, 1080);

    }

    function onDocumentMouseMove(event) {

      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;

    }

    function onDocumentTouchStart(event) {
      if (event.touches.length == 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

      }
    }

    function onDocumentTouchMove(event) {
      if (event.touches.length == 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

      }
    }

    //
    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function render() {

      var time = Date.now() * 0.00005;

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (- mouseY - camera.position.y) * 0.05;

      camera.lookAt(scene.position);

      var h = (360 * (1.0 + time) % 360) / 360;

      renderer.render(scene, camera);
    }

    animate();
  }
  render() {
    return (
      <div className="da-cont">
        <div ref={ref => (this.mount = ref)} />
        <video id="video" autoPlay />
      </div>
    );
  }
}
 export default StarMap;
