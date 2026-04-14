import { withRetry, defaultShouldRetry } from '../utils/retryUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    return data;
  }
  if (!response.ok) {
    throw new Error('API request failed');
  }
  return response.text();
}

// API service object
export const api = {
  // Start a new interview
  async startInterview(formData) {
    const result = await withRetry(
      async () => {
        const response = await fetch(`${API_BASE_URL}/interview/start`, {
          method: 'POST',
          body: formData,
        });
        return handleResponse(response);
      },
      {
        maxRetries: 3,
        shouldRetry: defaultShouldRetry,
      }
    );
    return result;
  },

  // Submit an answer
  async submitAnswer(sessionId, answerText) {
    const result = await withRetry(
      async () => {
        const response = await fetch(`${API_BASE_URL}/interview/answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId, answerText }),
        });
        return handleResponse(response);
      },
      {
        maxRetries: 3,
        shouldRetry: defaultShouldRetry,
      }
    );
    return result;
  },

  // Finalize interview (PATCH /interview/:id)
  async finalizeInterview(sessionId) {
    const result = await withRetry(
      async () => {
        const response = await fetch(`${API_BASE_URL}/interview/${sessionId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return handleResponse(response);
      },
      {
        maxRetries: 2,
        shouldRetry: defaultShouldRetry,
      }
    );
    return result;
  },

  // Get all candidates
  async getCandidates() {
    const result = await withRetry(
      async () => {
        const response = await fetch(`${API_BASE_URL}/candidates`);
        return handleResponse(response);
      },
      {
        maxRetries: 3,
        shouldRetry: defaultShouldRetry,
      }
    );
    return result;
  },
};

export default api;
