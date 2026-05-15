import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectsAPI = {
  generate: async (prompt: string, templateId?: number, style?: string, industry?: string) => {
    const response = await api.post('/api/projects/generate', {
      prompt,
      template_id: templateId,
      style,
      industry,
    });
    return response.data;
  },
  
  list: async () => {
    const response = await api.get('/api/projects/');
    return response.data;
  },
  
  get: async (id: number) => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },
  
  export: async (id: number) => {
    const response = await api.get(`/api/projects/${id}/export`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const templatesAPI = {
  list: async () => {
    const response = await api.get('/api/templates/');
    return response.data;
  },
  
  get: async (id: number) => {
    const response = await api.get(`/api/templates/${id}`);
    return response.data;
  },
};

export default api;
