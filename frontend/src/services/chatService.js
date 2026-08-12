// Streaming client for POST /api/Chat/stream.
//
// This intentionally does NOT use the shared `api` (axios) instance from
// ./api.js: axios buffers the response body and cannot expose it as a
// ReadableStream, so token-by-token streaming requires the native fetch()
// API instead. Authentication is still sourced from the exact same place
// as every axios request — src/utils/authToken.js — so there is only ever
// one JWT, one storage key, and one way of building the Authorization
// header anywhere in the app.

import { buildAuthHeader } from "../utils/authToken";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5016/api";

/**
 * Sends a chat message to the streaming endpoint and reads the response body
 * incrementally via fetch() + ReadableStream, invoking `onChunk` as each new
 * piece of text arrives.
 *
 * @param {Object} params
 * @param {string} params.message - The user's message to send.
 * @param {AbortSignal} [params.signal] - Used to cancel an in-flight stream
 *   (e.g. from a "Stop generating" button).
 * @param {(chunk: string, fullTextSoFar: string) => void} [params.onChunk] -
 *   Called every time new text arrives from the stream.
 * @returns {Promise<string>} The complete assistant response once the stream ends.
 */
export async function streamChatMessage({ message, signal, onChunk }) {
  let response;

  try {
    response = await fetch(`${API_URL}/Chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
        ...buildAuthHeader(),
      },
      body: JSON.stringify({ message }),
      signal,
    });
  } catch (networkError) {
    if (networkError?.name === "AbortError") {
      throw networkError;
    }
    throw new Error("Could not reach the chat service. Please check your connection and try again.", { cause: networkError });
  }

  if (response.status === 401) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  if (!response.ok) {
    let detail = "";
    try {
      detail = await response.text();
    } catch {
      // Ignore secondary read failures; we still have the status code.
    }
    throw new Error(
      `Chat request failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
    );
  }

  if (!response.body) {
    throw new Error("Streaming responses are not supported in this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const chunkText = decoder.decode(value, { stream: true });

    if (chunkText) {
      fullText += chunkText;
      onChunk?.(chunkText, fullText);
    }
  }

  // Flush any bytes the decoder buffered for a multi-byte UTF-8 sequence
  // that was split across the final read.
  const remainder = decoder.decode();
  if (remainder) {
    fullText += remainder;
    onChunk?.(remainder, fullText);
  }

  return fullText;
}
