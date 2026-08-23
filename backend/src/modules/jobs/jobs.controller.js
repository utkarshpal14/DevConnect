const jobsService = require('./jobs.service');
const { successResponse } = require('../../utils/response.util');

class JobsController {
  async create(req, res, next) {
    try { return successResponse(res, 201, 'Job created successfully', await jobsService.createJob(req.user._id, req.body)); } catch (error) { next(error); }
  }

  async list(req, res, next) {
    try { return successResponse(res, 200, 'Jobs retrieved successfully', await jobsService.listJobs(req.query)); } catch (error) { next(error); }
  }

  async getOne(req, res, next) {
    try {
      const job = await jobsService.getJob(req.params.jobId);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
      return successResponse(res, 200, 'Job retrieved successfully', job);
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const job = await jobsService.updateJob(req.user._id, req.params.jobId, req.body);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
      return successResponse(res, 200, 'Job updated successfully', job);
    } catch (error) { next(error); }
  }

  async remove(req, res, next) {
    try {
      const job = await jobsService.deleteJob(req.user._id, req.params.jobId);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
      return successResponse(res, 200, 'Job deleted successfully', job);
    } catch (error) { next(error); }
  }

  async close(req, res, next) {
    try {
      const job = await jobsService.closeJob(req.user._id, req.params.jobId);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
      return successResponse(res, 200, 'Job closed successfully', job);
    } catch (error) { next(error); }
  }
}

module.exports = new JobsController();
