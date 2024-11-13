"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Bileşenlerin sadece istemci tarafında çalışacak şekilde düzenlenmesi
const AudioRecorder = dynamic(() => import("@/components/AudioRecorder"), {
  ssr: false,
});
const ConversationHistory = dynamic(
  () => import("@/components/ConversationHistory"),
  { ssr: false }
);

const DashboardPage = () => {
  const [feedback, setFeedback] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null); // Ses URL'sini burada saklıyoruz

  const handleRecordingComplete = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    try {
      const response = await fetch("/api/process-audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback(data.text);
        setTranscribedText(data.transcribedText);
        setRefresh((prev) => !prev);

        try {
          const ttsResponse = await fetch("/api/text-to-speech", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: data.text }),
          });

          if (ttsResponse.ok) {
            const audioBlob = await ttsResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl); // Ses URL'sini duruma kaydediyoruz
          } else {
            console.error("TTS API Hatası");
          }
        } catch (error) {
          console.error("Ses çalma hatası:", error);
        }
      } else {
        setFeedback(data.error || "Ses işlenirken bir hata oluştu.");
      }
    } catch (error) {
      setFeedback("Sunucuya ses gönderilirken bir hata oluştu.");
    }
  };

  // Sesin yalnızca istemci tarafında çalınması için bir useEffect kancası kullanıyoruz
  useEffect(() => {
    if (audioUrl) {
      const playAudio = async () => {
        try {
          const audio = new Audio(audioUrl);
          await audio.play();
        } catch (error) {
          console.error("Ses oynatılamadı:", error);
        }
      };
      playAudio();
    }
  }, [audioUrl]); // audioUrl değiştiğinde ses oynatma tetiklenir

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-lg transition duration-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          İngilizce Dil Geliştirme
        </h1>
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        {transcribedText && (
          <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Senin Metnin:
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {transcribedText}
            </p>
          </div>
        )}
        {feedback && (
          <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Geri Bildirim:
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {feedback}
            </p>
          </div>
        )}
        <ConversationHistory refresh={refresh} />
      </div>
    </div>
  );
};

// Bileşeni dinamik olarak yükleyip yalnızca istemci tarafında render edilmesini sağlıyoruz
export default dynamic(() => Promise.resolve(DashboardPage), { ssr: false });
