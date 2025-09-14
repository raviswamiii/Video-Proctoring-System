import React, { useEffect, useRef } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

export const VideoFeed = ({ addLog }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const cameraSetUp = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    };

    cameraSetUp();

    let faceModel, objectModel;
    const loadModels = async () => {
      faceModel = await blazeface.load();
      objectModel = await cocoSsd.load();
    };

    loadModels();

    const checkFrames = async () => {
      if (!videoRef.current || !faceModel || !objectModel) return;
      const faceDetector = await faceModel.estimateFaces(
        videoRef.current,
        false
      );
      const objectDetector = await objectModel.detect(videoRef.current);

      if (faceDetector.length === 0) {
        addLog("No Face Detected.");
      } else if (faceDetector.length > 1) {
        addLog("Multiple Faces Detected.");
      }

      objectDetector.forEach((obj) => {
        if (["cell phone", "book", "laptop"].includes(obj.class)) {
          addLog(`Suspicious object detected: ${obj.class}`);
        }
      });
      setTimeout(checkFrames, 5000);
    };
    checkFrames();
  }, [addLog]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="400"
        height="300"
      />
    </div>
  );
};
