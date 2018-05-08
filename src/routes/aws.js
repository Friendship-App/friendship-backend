import { getSignedUrl } from '../handlers/aws';

const aws = [
  /*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
  {
    method: 'GET',
    path: '/sign-s3',
    handler: getSignedUrl,
  },
];
export default aws;

export const routes = server => server.route(aws);
