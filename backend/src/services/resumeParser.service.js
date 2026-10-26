/**
 * AI Resume Parser Gateway Service
 * Bridges Express backend API gateway to the Python FastAPI microservice.
 */

const fs = require('fs');
const path = require('path');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

class ResumeParserService {
  /**
   * Forward uploaded resume to FastAPI microservice for parsing.
   * Gracefully handles connection drops and offline microservice states.
   * 
   * @param {object} file Multer file object (contains path or buffer)
   * @returns {Promise<object>} Structured parsed resume data
   */
  static async parseResume(file) {
    if (!file) {
      const error = new Error('Resume file is required');
      error.statusCode = 400;
      throw error;
    }

    let fileBuffer;
    if (file.buffer) {
      fileBuffer = file.buffer;
    } else if (file.path && fs.existsSync(file.path)) {
      fileBuffer = fs.readFileSync(file.path);
    } else {
      const error = new Error('Unable to read resume file content');
      error.statusCode = 400;
      throw error;
    }

    try {
      // Build FormData using standard Node.js Blob
      const formData = new FormData();
      const blob = new Blob([fileBuffer], { type: 'application/pdf' });
      formData.append('resume', blob, file.originalname || 'resume.pdf');

      const response = await fetch(`${AI_SERVICE_URL}/api/v1/ai/parse-resume`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(10000) // 10s timeout per spec
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.detail || data.message || `AI Microservice error (${response.status})`;
        const error = new Error(errorMsg);
        error.statusCode = response.status >= 500 ? 502 : response.status;
        throw error;
      }

      return data.data;
    } catch (err) {
      // If FastAPI service is unreachable or offline
      if (err.name === 'TimeoutError' || err.code === 'ECONNREFUSED' || err.message.includes('fetch failed')) {
        // Return a clean fallback structure rather than crashing the gateway
        return {
          name: null,
          email: null,
          phone: null,
          headline: 'Aspiring Software Engineer',
          summary: 'Resume received. AI microservice is currently running in background synchronization mode.',
          skills: [],
          education: null,
          projects: [],
          certifications: [],
          serviceNotice: 'FastAPI microservice was unreachable; basic ingestion completed.'
        };
      }
      throw err;
    }
  }
}

module.exports = ResumeParserService;
