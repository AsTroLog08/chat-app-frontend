import httpClient from "../httpClient";

export const messageApi = {
  getMessageChat: async (id) => {
    return await httpClient.get(`/chats/${id}/messages`);
  },
  sendMessage: async (id, text) => {
    return await httpClient.post(`/chats/${id}/messages`, { text });
  }
};
