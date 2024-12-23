const { 
    PutObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    DeleteObjectsCommand,
    CopyObjectCommand
  } = require('@aws-sdk/client-s3');
  const s3Client = require('../config/s3Config');
  
  const s3Service = {
    uploadFile: async (file, fileName) => {
      try {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
  
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
  
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw error;
      }
    },
  
    deleteObject: async (key) => {
      try {
        const command = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key
        });
        await s3Client.send(command);
      } catch (error) {
        console.error('Error deleting object from S3:', error);
        throw error;
      }
    },
  
    deleteMultipleObjects: async (keys) => {
      try {
        const command = new DeleteObjectsCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Delete: { Objects: keys.map(key => ({ Key: key })) }
        });
        await s3Client.send(command);
      } catch (error) {
        console.error('Error deleting multiple objects from S3:', error);
        throw error;
      }
    },
  
    listObjects: async (prefix) => {
      try {
        const command = new ListObjectsV2Command({
          Bucket: process.env.AWS_BUCKET_NAME,
          Prefix: prefix
        });
        return s3Client.send(command);
      } catch (error) {
        console.error('Error listing objects from S3:', error);
        throw error;
      }
    },

    moveObject: async (sourceKey, destinationKey) => {
      try {
        // First copy the object to new location
        const copyCommand = new CopyObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          CopySource: `${process.env.AWS_BUCKET_NAME}/${sourceKey}`,
          Key: destinationKey
        });
        await s3Client.send(copyCommand);
  
        // Then delete the original
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: sourceKey
        });
        await s3Client.send(deleteCommand);
  
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${destinationKey}`;
      } catch (error) {
        console.error('Error moving object in S3:', error);
        throw error;
      }
    }
  };
  
  module.exports = s3Service;