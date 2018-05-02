import Boom from 'boom';
import aws from 'aws-sdk';

const S3_BUCKET = 'friendship-app';
aws.config.region = 'eu-central-1';

export const getSignedUrl = (request, reply) => {
  const s3 = new aws.S3();
  const fileName = request.query['file-name'];
  const fileType = request.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return reply(Boom.internal(err));
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    };
    reply(JSON.stringify(returnData));
  });
};
