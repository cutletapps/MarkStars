import React, { Component } from 'react';
import * as THREE from 'three';
import isWebglEnabled from 'detector-webgl';
import DatGui, {
  DatBoolean,
  DatColor,
  DatNumber,
  DatString
} from "react-dat-gui";

import StarTexture from './star.png';

class Stars extends Component {
  constructor(props) {
    super(props);
      
    this.state = {
      data: {
        package: "react-dat-gui",
        power: 9000,
        isAwesome: true,
        feelsLike: "#2FA1D6"
      }
    }
  }

  componentDidMount() {
    let threshold;
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString() !== '') {
      const vals = urlParams.values();
      for (let value of vals) {
        if (value > 10) {
          threshold = value;
        } else {
          threshold = 500;
        }
      }
    } else {
      threshold = 500;
    }


    if (isWebglEnabled) {
      // Variables
      // const threshold = 450;
      const WIDTH = window.innerWidth
      const HEIGHT = window.innerHeight
      const fov = 45;
      const StarAmount = 6000;
      let video, imageCache, videoWidth, videoHeight, particles, clock;

      // Scene & Camera
      clock = new THREE.Clock();
      let scene = new THREE.Scene();
      // let camera = new THREE.PerspectiveCamera(
      //   fov,
      //   WIDTH / HEIGHT,
      //   aspectRatio,
      //   1000
      // );
      // camera.position.z = 1;
      // camera.rotation.x = Math.PI / 2;


      // ZOOM OUT CAMERA
      const aspect = WIDTH / HEIGHT;

      let camera = new THREE.PerspectiveCamera(fov, aspect, 2, 10000);
      const z = Math.min(window.innerWidth, window.innerHeight);
      camera.position.set(0, 0, z/1.25);
      camera.lookAt(0, 0, 0);

      scene.add(camera);
      

      // Renderer
      let renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(WIDTH, HEIGHT);
      this.mount.appendChild(renderer.domElement);

      // MESHES
      // ===========
      // STARS
      let starGeo = new THREE.Geometry();
      for (let i = 0; i < StarAmount; i++) {
        let star = new THREE.Vector3(
          Math.random() * 600 - 300,
          Math.random() * 600 - 300,
          Math.random() * 600 - 300
        );
        star.velocity = 0;
        star.acceleration = 0.003;
        starGeo.vertices.push(star);
      }

      let sprite = new THREE.TextureLoader().load(StarTexture);
      let starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 1,
        map: sprite
      });

      let stars = new THREE.Points(starGeo, starMaterial);
      stars.lookAt(camera.position);
      scene.add(stars);

      // ===========
      // VIDEO
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      // video = document.getElementById('video');
      // const phi = Math.acos(- 1 + (2 * 1) / 1);
      // const theta = Math.sqrt(1 * Math.PI) * phi;

      // let geometry = new THREE.PlaneBufferGeometry(35, 20);

      // let texture = new THREE.VideoTexture(video);
      // let material = new THREE.MeshBasicMaterial({ map: texture });
      // let mesh = new THREE.Mesh(geometry, material);
      // mesh.position.setFromSphericalCoords(40, phi, theta);
      // mesh.lookAt(camera.position);
      // scene.add(mesh);
      const initVideo = () => {
        video = document.getElementById("video");
        video.autoplay = true;

        const option = {
          video: true,
          audio: false
        };
        navigator.mediaDevices
          .getUserMedia(option)
          .then(stream => {
            video.srcObject = stream;
            video.addEventListener("loadeddata", () => {
              videoWidth = video.videoWidth;
              videoHeight = video.videoHeight;

              createParticles();
            });
          })
          .catch(error => {
            console.log(error);
          });
      };
      const createParticles = () => {
        const imageData = getImageData(video);
        const geometry = new THREE.Geometry();
        geometry.morphAttributes = {}; // This is necessary to avoid error.
        // for (let i = 0; i < 5000; i++) {
        //   let star = new THREE.Vector3(
        //     Math.random() * 600 - 300,
        //     Math.random() * 600 - 300,
        //     Math.random() * 600 - 300
        //   );
        //   star.velocity = 0;
        //   // star.acceleration = 0.001;
        //   geometry.vertices.push(star);
        // }
        const material = new THREE.PointsMaterial({
          color: new THREE.Color("rgb(120 , 120, 120)"),
          size: 0.1,
          map: sprite,
          sizeAttenuation: true
        });

        for (let y = 0, height = imageData.height; y < height; y += 1) {
          for (let x = 0, width = imageData.width; x < width; x += 1) {
            const vertex = new THREE.Vector3(
              x - imageData.width / 2,
              -y + imageData.height / 2,
              100
            );
            geometry.vertices.push(vertex);
          }
        }

        particles = new THREE.Points(geometry, material);
        particles.lookAt(camera.position);
        scene.add(particles);
      };
      const getImageData = (image, useCache) => {
        if (useCache && imageCache) {
          return imageCache;
        }

        const w = image.videoWidth;
        const h = image.videoHeight;

        canvas.width = w;
        canvas.height = h;

        ctx.translate(w, 0);
        ctx.scale(-1, 1);

        ctx.drawImage(image, 0, 0);
        imageCache = ctx.getImageData(0, 0, w, h);

        // console.log(imageCache)

        return imageCache;
      };
      initVideo();

      // Animation
      const animate = (t) => {
        starGeo.vertices.forEach(p => {
          p.velocity += p.acceleration
          p.z -= p.velocity;

          if (p.z < -200) {
            p.z = 200;
            p.velocity = 0;
          }
        });
        starGeo.verticesNeedUpdate = true;
        stars.rotation.z += 0.0010;


        if (particles) {
          const useCache = this.state.freeze === true; // To reduce CPU usage.
          const imageData = getImageData(video, useCache);
          for (let i = 0, length = particles.geometry.vertices.length; i < length; i++) {
            const particle = particles.geometry.vertices[i];
            let index = i * 4;

            // Take an average of RGB and make it a gray value.
            let gray = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3;
            if (gray < threshold) {
              // Apply the value to Z coordinate if the value of the target pixel is less than threshold.
              particle.z = gray * 2.5;
            } else {
              // If the value is greater than threshold, make it big value.
              particle.z = -10000;
            }
          }
          particles.geometry.verticesNeedUpdate = true;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });


      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };

        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {

          video.srcObject = stream;
          video.play();

        }).catch((error) => {
          console.error('Unable to access the camera/webcam.', error);
        });
      } else {
        console.error('MediaDevices interface not available.');
      }

    } else {
      document.getElementById('no-support').style.display = 'block';
    }

  }
  render() {
    return (
      <div>
        <div ref={ref => (this.mount = ref)} />
        <video id="video" className="hidden" autoPlay></video>
        <div id="no-support">
          <h4>
            Your device or browser is not supported. Please use the latest
            version of Chrome on desktop.
          </h4>
        </div>
        {/* <div style={{ position: 'absolute', zIndex: 99, display: 'block' }}>
          <DatGui data={this.state.data} onUpdate={this.handleUpdate}>
            <DatString path="package" label="Package" />
            <DatNumber
              path="power"
              label="Power"
              min={9000}
              max={9999}
              step={1}
            />
            <DatBoolean path="isAwesome" label="Awesome?" />
            <DatColor path="feelsLike" label="Feels Like" />
          </DatGui>
        </div> */}
      </div>
    );
  }
}

export default Stars;