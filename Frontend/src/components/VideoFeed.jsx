// import React, { useEffect, useRef } from "react";
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import "@tensorflow/tfjs";
// import { FaceMesh } from "@mediapipe/face_mesh";

// // Simple PnP approximation for yaw/pitch using 3D landmarks
// function estimateHeadPose(landmarks) {
//   // Key points: left eye, right eye, nose tip, mouth corners, chin
//   const leftEye = landmarks[33];
//   const rightEye = landmarks[263];
//   const noseTip = landmarks[1];
//   const leftMouth = landmarks[61];
//   const rightMouth = landmarks[291];
//   const chin = landmarks[152];

//   // Calculate pitch and yaw in normalized space
//   const dx = rightEye.x - leftEye.x;
//   const dy = chin.y - noseTip.y;
//   const yaw = (noseTip.x - (leftEye.x + rightEye.x) / 2) / dx; // left/right
//   const pitch = (noseTip.y - (leftEye.y + rightEye.y) / 2) / dy; // up/down

//   return { yaw, pitch };
// }

// export const VideoFeed = ({ addLog, onRecordingReady, isRunning }) => {
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);
//   const streamRef = useRef(null);

//   const detectorRef = useRef(null);
//   const faceMeshRef = useRef(null);

//   const gazeBufferRef = useRef([]);
//   const objectBufferRef = useRef([]);

//   const GAZE_HISTORY = 5;
//   const OBJECT_HISTORY = 3;
//   const ALERT_THRESHOLD = 0.6;

//   // Load Coco SSD
//   useEffect(() => {
//     cocoSsd.load().then((detector) => {
//       detectorRef.current = detector;
//     });
//   }, []);

//   // Start/Stop camera and recording
//   useEffect(() => {
//     if (!isRunning) {
//       stopAll();
//       return;
//     }

//     const startCamera = async () => {
//       try {
//         streamRef.current = await navigator.mediaDevices.getUserMedia({
//           video: { width: 640, height: 480 },
//           audio: true,
//         });
//         if (videoRef.current) videoRef.current.srcObject = streamRef.current;

//         // Recording setup
//         mediaRecorderRef.current = new MediaRecorder(streamRef.current);
//         chunksRef.current = [];
//         mediaRecorderRef.current.ondataavailable = (e) => {
//           if (e.data.size > 0) chunksRef.current.push(e.data);
//         };
//         mediaRecorderRef.current.onstop = () => onRecordingReady(chunksRef.current);
//         mediaRecorderRef.current.start();

//         // FaceMesh setup
//         const faceMesh = new FaceMesh({
//           locateFile: (file) =>
//             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
//         });
//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.7,
//           minTrackingConfidence: 0.7,
//         });
//         faceMesh.onResults(onFaceResults);
//         faceMeshRef.current = faceMesh;

//         // Loop frames
//         const runLoop = async () => {
//           if (!videoRef.current) return;
//           await faceMesh.send({ image: videoRef.current });
//           requestAnimationFrame(runLoop);
//         };
//         runLoop();
//       } catch (err) {
//         console.error("Camera error:", err);
//         addLog("Camera error");
//       }
//     };

//     const stopAll = () => {
//       if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
//         mediaRecorderRef.current.stop();
//       }
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((t) => t.stop());
//         streamRef.current = null;
//       }
//     };

//     startCamera();
//     return () => stopAll();
//   }, [isRunning]);

//   // Handle face results (head pose + object detection)
//   const onFaceResults = async (results) => {
//     if (!videoRef.current) return;

//     // ---------- Object detection ----------
//     if (detectorRef.current) {
//       const predictions = await detectorRef.current.detect(videoRef.current);
//       const objectsDetected = predictions
//         .filter((obj) => ["cell phone", "book", "laptop", "tablet", "paper"].includes(obj.class))
//         .map((obj) => obj.class);

//       objectBufferRef.current.push(objectsDetected);
//       if (objectBufferRef.current.length > OBJECT_HISTORY) objectBufferRef.current.shift();

//       const allObjects = objectBufferRef.current.flat();
//       const counts = {};
//       allObjects.forEach((o) => (counts[o] = (counts[o] || 0) + 1));
//       Object.keys(counts).forEach((obj) => {
//         if (counts[obj] / OBJECT_HISTORY >= ALERT_THRESHOLD)
//           addLog(`Detected unauthorized object: ${obj}`);
//       });
//     }

//     // ---------- Head pose detection ----------
//     let gaze = "away";

//     if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
//       const landmarks = results.multiFaceLandmarks[0];
//       const { yaw, pitch } = estimateHeadPose(landmarks);

//       if (yaw > 0.05) gaze = "right";
//       else if (yaw < -0.05) gaze = "left";
//       else if (pitch > 0.05) gaze = "down";
//       else if (pitch < -0.05) gaze = "up";
//       else gaze = "center";
//     }

//     // Temporal smoothing
//     gazeBufferRef.current.push(gaze);
//     if (gazeBufferRef.current.length > GAZE_HISTORY) gazeBufferRef.current.shift();

//     const awayFrames = gazeBufferRef.current.filter((g) => g === "away").length;
//     if (awayFrames / GAZE_HISTORY >= ALERT_THRESHOLD) {
//       addLog("User is looking away or not visible");
//     } else {
//       const nonCenterGaze = gazeBufferRef.current.find((g) => g !== "center" && g !== "away");
//       if (nonCenterGaze) addLog(`User looking ${nonCenterGaze}`);
//     }
//   };

//   return (
//     <video
//       ref={videoRef}
//       autoPlay
//       playsInline
//       className="w-full h-full object-contain bg-black"
//       style={{ transform: "scaleX(-1)" }}
//     />
//   );
// };
import React, { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

export const VideoFeed = ({ addLog, onRecordingReady, isRunning }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const detectorRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Load Coco SSD once
  useEffect(() => {
    cocoSsd.load().then((detector) => {
      detectorRef.current = detector;
      addLog("Object detector loaded ✅");
      setLoading(false);
    });
  }, [addLog]);

  // Start/Stop camera and recording
  useEffect(() => {
    if (!isRunning) {
      stopAll();
      return;
    }

    const startCamera = async () => {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          await videoRef.current.play();
        }

        mediaRecorderRef.current = new MediaRecorder(streamRef.current);
        chunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        mediaRecorderRef.current.onstop = () =>
          onRecordingReady(chunksRef.current);
        mediaRecorderRef.current.start();

        const runLoop = async () => {
          if (!videoRef.current || !detectorRef.current) {
            requestAnimationFrame(runLoop);
            return;
          }

          const predictions = await detectorRef.current.detect(videoRef.current);

          const ctx = canvasRef.current.getContext("2d");
          ctx.save();
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          // Mirror preview
          ctx.scale(-1, 1);
          ctx.drawImage(
            videoRef.current,
            -canvasRef.current.width,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctx.restore();

          // Draw detections
          predictions.forEach((p) => {
            if (
              ["cell phone", "book", "laptop", "tablet", "paper"].includes(p.class)
            ) {
              addLog(`Detected object: ${p.class}`);
              ctx.strokeStyle = "red";
              ctx.lineWidth = 2;
              ctx.strokeRect(
                canvasRef.current.width - p.bbox[0] - p.bbox[2],
                p.bbox[1],
                p.bbox[2],
                p.bbox[3]
              );
              ctx.fillStyle = "red";
              ctx.fillText(
                p.class,
                canvasRef.current.width - p.bbox[0] - p.bbox[2],
                p.bbox[1] > 10 ? p.bbox[1] - 5 : 10
              );
            }
          });

          requestAnimationFrame(runLoop);
        };

        runLoop();
      } catch (err) {
        console.error("Camera error:", err);
        addLog("Camera error");
      }
    };

    const stopAll = () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };

    startCamera();
    return () => stopAll();
  }, [isRunning, addLog, onRecordingReady]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-base sm:text-lg">
          Loading object detector...
        </div>
      )}

      {/* Raw video (hidden) */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />

      {/* Responsive Canvas */}
      <div className="w-full max-w-5xl aspect-video">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full rounded-lg shadow-lg object-contain"
        />
      </div>
    </div>
  );
};
