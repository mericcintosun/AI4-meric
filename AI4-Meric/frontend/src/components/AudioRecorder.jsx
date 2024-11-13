"use client";

import { useState, useRef } from "react";

export default function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      audioChunksRef.current = [];
      setAudioURL(URL.createObjectURL(blob));
      onRecordingComplete(blob);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 w-full max-w-md">
        {audioURL && (
          <audio
            src={audioURL}
            controls
            className="w-full h-10 rounded-lg shadow-md bg-gray-200"
          />
        )}
      </div>
      <button
        onMouseDown={handleStartRecording}
        onMouseUp={handleStopRecording}
        onTouchStart={handleStartRecording}
        onTouchEnd={handleStopRecording}
        className={`px-8 py-3 mt-4 rounded-full font-semibold shadow-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
          isRecording
            ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
        } text-white`}
      >
        {isRecording ? "Kaydı Durdur" : "Kayda Başla"}
      </button>
    </div>
  );
}
