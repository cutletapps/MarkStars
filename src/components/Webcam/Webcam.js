import React, { Component } from 'react';
import * as THREE from 'three';

class Webcam extends Component {
  componentDidMount() {

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia() not supported.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
      .then(function (stream) {
        var video = document.querySelector('video');
        if ("srcObject" in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = function (e) {
          video.play();
        };
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });

  }
  render() {
    return <video id="video" autoPlay style={{width: '100%'}} />;
  }
}
export default Webcam;
