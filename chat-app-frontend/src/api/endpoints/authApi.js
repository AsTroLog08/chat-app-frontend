import httpClient from "../httpClient";

export const authApi = {
  googleLogin: async (token) => {
    const response = await httpClient.post("/users/auth/google", { token });
    return response.data; 
  },
  login: async () => {
    const response = await httpClient.get("/users/auth/me");
    return response.data; 
  },
};
