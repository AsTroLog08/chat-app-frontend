import httpClient from "../httpClient";

export const userApi = {
  getProfile: async () => {
    return await httpClient.get(`/users/profile`); 
  },

};
