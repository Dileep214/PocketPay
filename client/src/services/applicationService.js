import apiClient from './apiClient';

export const applicationService = {
  applyToJob: async (jobId, workerNote = '') => {
    return await apiClient.post(`/applications/jobs/${jobId}/apply`, { workerNote });
  },

  getMyApplications: async () => {
    return await apiClient.get('/applications/worker/my-applications');
  },

  withdrawApplication: async (id) => {
    return await apiClient.delete(`/applications/${id}/withdraw`);
  },

  getJobApplications: async (jobId) => {
    return await apiClient.get(`/applications/jobs/${jobId}`);
  },

  updateCandidateStatus: async (applicationId, status, employerNotes = '') => {
    return await apiClient.patch(`/applications/${applicationId}/status`, {
      status,
      employerNotes
    });
  }
};
