import apiClient from './apiClient';

const emitApplicationChanged = (jobId) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pocketpay:application-changed', {
      detail: { jobId }
    }));
  }
};

export const applicationService = {
  applyToJob: async (jobId, workerNote = '') => {
    const response = await apiClient.post(`/applications/jobs/${jobId}/apply`, { workerNote });
    emitApplicationChanged(jobId);
    return response;
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
