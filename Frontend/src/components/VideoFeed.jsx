import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import * as cocossd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { drawRect } from "./utilities";

export const VideoFeed = ({ addLogs }) => {
  const [user, setUser] = useState(null);
  const [start, setStart] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const netRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(backendURL + "/user/userDetails", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const initTensor = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      netRef.current = await cocossd.load();
    };
    initTensor();
  }, []);

  useEffect(() => {
    const detect = async () => {
      if (webcamRef.current?.video?.readyState === 4 && netRef.current) {
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        video.width = videoWidth;
        video.height = videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const predictions = await netRef.current.detect(video);
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawRect(predictions, ctx, canvasRef.current.width);

        if(predictions.length > 0){
          const logMessage = `Detected: ${predictions.map((object) => (
            `${object.class} (${Math.round(object.score*100)}%)`
          ))}`
          addLogs(logMessage);
        }
      }
    };

    if (start) {
      intervalRef.current = setInterval(detect, 100);
    } else {
      clearInterval(intervalRef.current);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    return () => clearInterval(intervalRef.current);
  }, [start]);

  return (
    <div className="h-[60vh] w-full sm:h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex flex-col justify-center items-center gap-2 sm:gap-3">
      <div className="bg-black h-[75%] w-[90%] sm:h-[70%] sm:w-[70%] rounded-xl relative flex justify-center items-center">
        <p className="text-white">Click start to proceed...</p>
        {start && (
          <Webcam
            ref={webcamRef}
            className="absolute h-full w-full"
            style={{ transform: "scaleX(-1)" }}
          />
        )}
        <canvas ref={canvasRef} className="absolute h-full w-full" />
        <p className="text-sm text-gray-800 font-semibold absolute bottom-3 left-3 bg-gray-400 rounded-sm px-2">
          {user?.name}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setStart(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 sm:px-10 sm:py-3 rounded-xl"
        >
          Start
        </button>
        <button
          onClick={() => setStart(false)}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 sm:px-10 sm:py-3 rounded-xl"
        >
          Stop
        </button>
      </div>
    </div>
  );
};
