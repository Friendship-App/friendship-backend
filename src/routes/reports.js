import { merge } from 'lodash';
import Joi from 'joi';

import { getAuthWithScope } from '../utils/auth';
import {
  getReports,
  getReport,
  CreateReport,
  UpdateReport,
  delReport,
  getTotalReports
} from '../handlers/reports';

const validateReportId = {
  validate: {
    params: {
      reportId: Joi.number()
        .integer()
        .required(),
    },
  },
};

const validateReportFields = {
  validate: {
    payload: {
      userId: Joi.number()
        .integer()
        .required(),
      description: Joi.string(),
      reported_by: Joi.number()
        .integer()
        .required(),
    },
  },
};

const reports = [
  // Get a list of all reports
  {
    method: 'GET',
    path: '/report/{startIndex}',
    config: getAuthWithScope('admin'),
    handler: getReports,
  },
  {
    method: 'GET',
    path: '/getTotalReports',
    config: getAuthWithScope('admin'),
    handler: getTotalReports,
  },
  // Get info about a specific reports
  {
    method: 'GET',
    path: '/reports/{reportId}',
    config: merge({}, validateReportId, getAuthWithScope('admin')),
    handler: getReport,
  },
  // Register new reports
  {
    method: 'POST',
    path: '/reports',
    config: merge({}, validateReportFields, getAuthWithScope('user')),
    handler: CreateReport,
  },
  // Delete a reports, admin only
  {
    method: 'DELETE',
    path: '/reports/{reportId}',
    config: merge({}, validateReportId, getAuthWithScope('admin')),
    handler: delReport,
  },
  // Update reports, admin only
  {
    method: 'PATCH',
    path: '/reports/{reportId}',
    config: merge({}, validateReportFields, getAuthWithScope('admin')),
    handler: UpdateReport,
  },
];

export default reports;

// Here we register the routes
export const routes = server => server.route(reports);
