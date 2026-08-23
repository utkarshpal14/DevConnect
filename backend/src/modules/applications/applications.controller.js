const applicationsService = require('./applications.service');
const { successResponse } = require('../../utils/response.util');

class ApplicationsController {
  async apply(req, res, next) {
    try {
      const application = await applicationsService.applyForJob(req.user._id, req.body.jobId);
      return successResponse(res, 201, 'Application submitted', application);
    } catch (error) { next(error); }
  }

  async withdraw(req, res, next) {
    try {
      const application = await applicationsService.withdrawApplication(req.user._id, req.params.applicationId);
      return successResponse(res, 200, 'Application withdrawn successfully', application);
    } catch (error) { next(error); }
  }

  async mine(req, res, next) {
    try {
      return successResponse(res, 200, 'Applications retrieved successfully', await applicationsService.getMyApplications(req.user._id));
    } catch (error) { next(error); }
  }

  async applicants(req, res, next) {
    try {
      return successResponse(res, 200, 'Job applicants retrieved successfully', await applicationsService.getJobApplicants(req.user._id, req.params.jobId));
    } catch (error) { next(error); }
  }

  async updateStatus(req, res, next) {
    try {
      return successResponse(res, 200, 'Application status updated successfully', await applicationsService.updateStatus(req.user._id, req.params.applicationId, req.body.status));
    } catch (error) { next(error); }
  }
}

module.exports = new ApplicationsController();
