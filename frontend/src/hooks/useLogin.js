import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/authService";

export default function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }) =>
      loginUser(email, password),
  });
}