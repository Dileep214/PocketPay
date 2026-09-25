import apiClient from './apiClient';

export const jobService = {
  getJobs: async (params = {}) => {
    return await apiClient.get('/jobs', { params });
  },

  getJobById: async (id) => {
    return await apiClient.get(`/jobs/${id}`);
  },

  createJob: async (jobData) => {
    return await apiClient.post('/jobs', jobData);
  },

  updateJob: async (id, jobData) => {
    return await apiClient.put(`/jobs/${id}`, jobData);
  },

  updateJobStatus: async (id, status) => {
    return await apiClient.patch(`/jobs/${id}/status`, { status });
  },

  deleteJob: async (id) => {
    return await apiClient.delete(`/jobs/${id}`);
  },

  getMyJobs: async () => {
    return await apiClient.get('/jobs/employer/my-jobs');
  }
};
