import { useCallback, useRef, useState } from "react";
import { streamChatMessage } from "../services/chatService";

let idCounter = 0;
function nextId(prefix) {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

/**
 * Drives the ChatGPT-style streaming chat experience: keeps the message
 * list in state, streams the assistant reply token-by-token from
 * POST /api/Chat/stream, and exposes a `stop()` action to cancel an
 * in-flight generation.
 */
export default function useChatStream() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    async (rawText) => {
      const trimmed = (rawText || "").trim();

      if (!trimmed || isStreaming) {
        return;
      }

      setError(null);

      const userMessage = { id: nextId("user"), role: "user", content: trimmed };
      const assistantId = nextId("assistant");
      const assistantMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await streamChatMessage({
          message: trimmed,
          signal: controller.signal,
          onChunk: (_chunk, fullTextSoFar) => {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantId ? { ...message, content: fullTextSoFar } : message
              )
            );
          },
        });
      } catch (err) {
        if (err?.name === "AbortError") {
          // User pressed "Stop generating" — keep whatever partial content
          // has already streamed in as the final assistant message.
        } else {
          const friendlyMessage = err?.message || "Something went wrong while generating a response.";
          setError(friendlyMessage);

          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId && !message.content
                ? { ...message, content: `⚠️ ${friendlyMessage}`, isError: true }
                : message
            )
          );
        }
      } finally {
        // Stream finished (successfully, by error, or by user cancellation):
        // freeze the final assistant message into state.
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId ? { ...message, isStreaming: false } : message
          )
        );
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming]
  );

  return { messages, isStreaming, error, sendMessage, stop };
}
