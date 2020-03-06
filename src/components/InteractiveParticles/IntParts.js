import React, { Component } from 'react';
import * as THREE from 'three';
import disc from './disc.png';
import isWebglEnabled from 'detector-webgl'
import Camera from './io/camera'
import Controls from './io/controls'
import Renderer from './io/renderer'
import Stats from './io/stats'
import Scene from './objects/scene'
import Particles from './objects/particles'

import getParameterByName from './helpers/getParameterByName'
import showInfoBox from './helpers/showInfoBox'
import isNotMobileScreen from './helpers/isNotMobileScreen'

class StarMap extends Component {
  componentDidMount() {
    const quality = 8000;

    if (!quality || isNaN(quality)) {
      document.getElementById('select-quality').style.display = 'block'
      return
    }

    if (isWebglEnabled && isNotMobileScreen()) {
      showInfoBox()

      const WIDTH = window.innerWidth
      const HEIGHT = window.innerHeight
      const aspectRatio = 1

      const container = document.getElementById('simulation')

      const renderer = new Renderer({
        width: WIDTH,
        height: HEIGHT,
        container
      })

      const scene = new Scene()

      const camera = new Camera({
        aspectRatio,
        position: {
          x: 0,
          y: 0,
          z: -1
        }
      })

      const stats = new Stats()

      const particles = new Particles({
        numParticles: quality,
        scene,
        renderer
      })

      const init = () => {
        new Controls({ particles }) // eslint-disable-line
        container.appendChild(stats.getDomElement())
      }

      const animate = () => {
        requestAnimationFrame(animate) // eslint-disable-line
        render()
      }

      const render = () => {
        camera.update()
        stats.update()

        particles.update()

        renderer.render({
          scene: scene.get(),
          camera: camera.get()
        })
      }

      init()
      animate()
    } else {
      document.getElementById('no-support').style.display = 'block'
    }
  }
  render() {
    return (
      <div>
        {/* <div ref={ref => (this.mount = ref)} /> */}
        <div id="container">
          <div id="simulation"></div>
          <div id="select-quality">
            <h4>Select Quality</h4>
            <a className="quality-selector" href="?quality=35000">Very Low</a>
            <a className="quality-selector" href="?quality=60000">Low</a>
            <a className="quality-selector" href="?quality=80000">Medium</a>
            <a className="quality-selector" href="?quality=120000">High</a>
            <a className="quality-selector" href="?quality=170000">Very High</a>
          </div>
          <div id="no-support">
            <h4>Your device or browser is not supported. Please use the latest version of Chrome on desktop.</h4>
          </div> 
          <div id="info">
            <a className="hide-info-button">Close</a>
            <div className="info-content">
              Number of particles: <span className="num-particles">0</span><br />
              By <a target="_blank" rel="noopener noreferrer" href="http://www.tuqire.com">Tuqire Hussain</a>
              [<a target="_blank" rel="noopener noreferrer" href="https://github.com/tuqire/webcam-particles">View Code</a>]<br />
              Select Quality:
              <a href="?quality=35000">V Low</a> |
              <a href="?quality=60000">Low</a> |
              <a href="?quality=80000">Medium</a> |
              <a href="?quality=120000">High</a> |
              <a href="?quality=170000">V High</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default StarMap;
