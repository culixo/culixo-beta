import api from '@/lib/axios';

interface APIErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  request?: unknown;
  message?: string;
}

export const mediaService = {
  uploadInstructionImage: async (file: File): Promise<string> => {
    try {
      console.log('Starting upload with file:', file.name);
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.request({
        method: 'POST',
        url: '/recipes/upload-instruction-image',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response && response.data && response.data.url) {
        return response.data.url;
      }

      throw new Error('Invalid response format from server');
    } catch (error: unknown) {
      console.error('Full error object:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as APIErrorResponse;
        throw new Error(apiError.response?.data?.message || 'Server error occurred');
      } else if (error && typeof error === 'object' && 'request' in error) {
        throw new Error('No response received from server');
      } else if (error instanceof Error) {
        throw new Error(error.message || 'Error uploading image');
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  },

  uploadMainImage: async (file: File, draftId?: string): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const endpoint = draftId 
        ? `/recipes/drafts/${draftId}/media/main`
        : '/recipes/media/main';

      const response = await api.request({
        method: 'POST',
        url: endpoint,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data.url;
    } catch (error: unknown) {
      console.error('Full error object:', error);
      throw error;
    }
  },

  uploadAdditionalImages: async (files: File[], draftId?: string): Promise<string[]> => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const endpoint = draftId 
        ? `/recipes/drafts/${draftId}/media/additional`
        : '/recipes/media/additional';

      const response = await api.request({
        method: 'POST',
        url: endpoint,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data.urls;
    } catch (error: unknown) {
      console.error('Error uploading additional images:', error);
      throw error;
    }
  }
};