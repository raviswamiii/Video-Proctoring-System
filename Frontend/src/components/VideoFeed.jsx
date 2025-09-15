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
// };j



import React, { useEffect, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

export const VideoFeed = ({ addLog, isRunning, onRecordingReady }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const runningRef = useRef(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const objectBufferRef = useRef([]);
  const lastLoggedRef = useRef({});

  // Configuration
  const OBJECT_HISTORY = 5;
  const ALERT_THRESHOLD = 0.6;
  const MIN_LOG_INTERVAL = 5000;
  const TARGET_CLASSES = [
    "cell phone",
    "book",
    "laptop",
    "tablet",
    "remote",
    "keyboard",
  ];

  // Load COCO-SSD model once
  useEffect(() => {
    let cancelled = false;
    cocoSsd
      .load()
      .then((detector) => {
        if (!cancelled) {
          detectorRef.current = detector;
          addLog && addLog("Object detector loaded");
        }
      })
      .catch((err) => {
        console.error("Failed to load COCO-SSD:", err);
        addLog && addLog("Failed to load object detector");
      });
    return () => {
      cancelled = true;
    };
  }, [addLog]);

  // Start / stop camera and detection loop with recording
  useEffect(() => {
    if (!isRunning) {
      stopCameraAndLoop();
      return () => {};
    }

    let rafId = null;
    runningRef.current = true;

    const start = async () => {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          await videoRef.current.play();

          // Setup recording
          mediaRecorderRef.current = new MediaRecorder(streamRef.current);
          chunksRef.current = [];
          mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
          };
          mediaRecorderRef.current.onstop = () => {
            onRecordingReady && onRecordingReady(chunksRef.current);
          };
          mediaRecorderRef.current.start();

          // set canvas size to match actual video resolution
          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth || 640;
            canvasRef.current.height = videoRef.current.videoHeight || 480;
          }

          // detection loop
          const detectLoop = async () => {
            if (!runningRef.current) return;
            if (detectorRef.current && videoRef.current.readyState >= 2) {
              try {
                const predictions = await detectorRef.current.detect(videoRef.current);
                handleDetections(predictions);
                drawPredictions(predictions);
              } catch (e) {
                console.error("Detection error:", e);
              }
            }
            rafId = requestAnimationFrame(detectLoop);
          };

          detectLoop();
        }
      } catch (err) {
        console.error("Camera start error:", err);
        addLog && addLog("Camera error: " + (err.message || err));
        runningRef.current = false;
      }
    };

    start();

    return () => {
      runningRef.current = false;
      if (rafId) cancelAnimationFrame(rafId);
      stopCameraAndLoop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const stopCameraAndLoop = () => {
    runningRef.current = false;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx && ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Process detections: buffer + alert logic
  const handleDetections = (predictions) => {
    const matched = predictions
      .filter((p) => TARGET_CLASSES.includes(p.class))
      .map((p) => p.class);

    objectBufferRef.current.push(matched);
    if (objectBufferRef.current.length > OBJECT_HISTORY) objectBufferRef.current.shift();

    const all = objectBufferRef.current.flat();
    const counts = all.reduce((acc, c) => {
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {});

    Object.keys(counts).forEach((obj) => {
      if (counts[obj] / Math.max(1, OBJECT_HISTORY) >= ALERT_THRESHOLD) {
        const now = Date.now();
        const last = lastLoggedRef.current[obj] || 0;
        if (now - last > MIN_LOG_INTERVAL) {
          addLog && addLog(`Detected unauthorized object: ${obj}`);
          lastLoggedRef.current[obj] = now;
        }
      }
    });
  };

  // Draw bounding boxes on canvas
  const drawPredictions = (predictions) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    const vw = video.videoWidth || canvas.width;
    const vh = video.videoHeight || canvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);

    predictions.forEach((p) => {
      const [x, y, w, h] = p.bbox;
      const sx = (x / vw) * canvas.width;
      const sy = (y / vh) * canvas.height;
      const sw = (w / vw) * canvas.width;
      const sh = (h / vh) * canvas.height;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#00FFFF";
      ctx.strokeRect(sx, sy, sw, sh);

      const label = `${p.class} (${(p.score * 100).toFixed(0)}%)`;
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(sx, sy - 20, textWidth + 6, 20);
      ctx.fillStyle = "#000";
      ctx.fillText(label, sx + 3, sy - 5);
    });

    ctx.restore();
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-contain bg-black"
        style={{ transform: "scaleX(-1)" }}
      />
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 w-full h-full pointer-events-none"
        style={{ transform: "scaleX(-1)" }}
      />
    </div>
  );
};

export default VideoFeed;
