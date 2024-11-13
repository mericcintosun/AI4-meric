"use client";

import React, { useEffect, useState } from "react";

const ConversationHistory = () => {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversations");

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Konuşmalar alınırken bir hata oluştu.");
          return;
        }

        const data = await response.json();
        setConversations(data);
      } catch (err) {
        setError("Sunucuya bağlanırken bir hata oluştu.");
      }
    };

    fetchConversations();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mt-8">
  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
    Konuşma Geçmişi:
  </h2>
  {conversations.length === 0 ? (
    <p className="text-gray-600 dark:text-gray-400">Henüz bir konuşma yok.</p>
  ) : (
    <ul className="space-y-4">
      {conversations.map((conv) => (
        <li key={conv.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md transition duration-200">
          <p className="font-semibold text-gray-800 dark:text-gray-200">Sen:</p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">{conv.userInput}</p>
          <p className="font-semibold text-gray-800 dark:text-gray-200">Asistan:</p>
          <p className="text-gray-700 dark:text-gray-300">{conv.assistantResponse}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {new Date(conv.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default ConversationHistory;
