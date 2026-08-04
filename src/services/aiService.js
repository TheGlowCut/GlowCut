import { apiClient } from './apiClient';

export const aiService = {
  /**
   * Analyze face and hair characteristics from an uploaded image.
   * @param {File} imageFile - The image file to analyze
   * @returns {Promise<Object>} Analysis result containing face and hair data
   */
  analyzeImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const { data } = await apiClient.post('/ai/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },

  /**
   * Get hairstyle recommendations based on user characteristics.
   * @param {Object} params - Characteristics (e.g. face_shape, hair_length, etc.)
   * @returns {Promise<Object>} Recommendations
   */
  getRecommendations: async (params) => {
    const { data } = await apiClient.post('/ai/recommendations', params);
    return data;
  },

  /**
   * Generate AI virtual try-on image.
   * @param {File} imageFile - The user image
   * @param {string} hairstyleName - Name of the hairstyle to try on
   * @param {string} [promptHint] - Optional extra prompt hint
   * @returns {Promise<Object>} Try-on result
   */
  tryOn: async (imageFile, hairstyleName, promptHint) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('hairstyleName', hairstyleName);
    if (promptHint) {
      formData.append('promptHint', promptHint);
    }

    const { data } = await apiClient.post('/ai/try-on', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },
};
