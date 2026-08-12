import { useMutation } from "@tanstack/react-query";
import { generateReply } from "../services/aiService";

export default function useAIReply() {
  return useMutation({
    mutationFn: generateReply,
  });
}