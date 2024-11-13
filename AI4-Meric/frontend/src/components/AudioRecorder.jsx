"use client";

import { useState } from "react";
import { ReactMic } from "react-mic";

export default function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);

  const onStop = (recordedData) => {
    console.log("Recorded Blob:", recordedData.blob);
    console.log("Audio Blob Type:", recordedData.blob.type);
    console.log("Audio Blob Size:", recordedData.blob.size);
    onRecordingComplete(recordedData.blob);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleOnStop = (recordedData) => {
    onRecordingComplete(recordedData.blob);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 w-full max-w-md">
        <ReactMic
          record={isRecording}
          className="w-full h-32 rounded-lg shadow-md"
          mimeType="audio/wav"
          onStop={handleOnStop}
          strokeColor="#4F46E5"
          backgroundColor="#E0E7FF"
        />
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
