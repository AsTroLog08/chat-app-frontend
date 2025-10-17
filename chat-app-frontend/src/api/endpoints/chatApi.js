import httpClient from "../httpClient";

export const chatApi = {
  createChat: async (chatData) => {
    const response = await httpClient.post("/chats", chatData);
    return response;
  },
  getChats: async (search) => {
    const params = {};
    if (search) params.q = search;
    const response = await httpClient.get("/chats", { params });
    return response.data; 
  },
  getChat: async (id) => {
    return await   httpClient.get(`/chats/${id}`,);
  },
  deleteChat: async (id) => {
    return await httpClient.delete(`/chats/${id}`,); 
  },
  updateChat: async (id, data) => {

    return await httpClient.put(`/chats/${id}`, data);
  }
};
