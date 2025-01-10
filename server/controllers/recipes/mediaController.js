// server/controllers/recipes/mediaController.js
const s3Client = require('../../config/s3Config');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const pool = require('../../config/db');

const MediaController = {
    uploadMainImage: async (req, res) => {
        try {
          if (!req.file) {
            return res.status(400).json({
              success: false,
              message: 'No file uploaded',
              data: null
            });
          }
      
          const fileName = `drafts/${req.params.id}/media/main/${Date.now()}-${req.file.originalname}`;
          
          const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
          });
      
          await s3Client.send(command);
          const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      
          res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
              url: fileUrl
            }
          });
        } catch (error) {
          console.error('Error uploading main image:', error);
          res.status(500).json({
            success: false,
            message: error.message,
            data: null
          });
        }
    },

    uploadMainImageNoUser: async (req, res) => {
        try {
          if (!req.file) {
            return res.status(400).json({
              success: false,
              message: 'No file uploaded',
              data: null
            });
          }
      
          // Note the different path for non-draft uploads
          const fileName = `media/temp/${Date.now()}-${req.file.originalname}`;
          
          const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
          });
      
          await s3Client.send(command);
          const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      
          res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
              url: fileUrl
            }
          });
        } catch (error) {
          console.error('Error uploading main image:', error);
          res.status(500).json({
            success: false,
            message: error.message,
            data: null
          });
        }
    },

    uploadAdditionalImages: async (req, res) => {
        try {
          const { id: draftId } = req.params;
          const userId = req.user.id;
      
          if (!req.files || req.files.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No files uploaded'
            });
          }
      
          const uploadPromises = req.files.map(async (file) => {
            const fileName = `drafts/${draftId}/media/additional/${Date.now()}-${file.originalname}`;
            
            const command = new PutObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: fileName,
              Body: file.buffer,
              ContentType: file.mimetype
            });
      
            await s3Client.send(command);
            return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
          });
      
          const urls = await Promise.all(uploadPromises);
      
          // Update the draft in database with the new additional image URLs
          const result = await pool.query(
            `UPDATE recipe_drafts 
             SET media = jsonb_set(
               COALESCE(media, '{}'::jsonb),
               '{additionalImages}',
               (media->>'additionalImages')::jsonb || $1::jsonb
             ),
             updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND user_id = $3
             RETURNING *`,
            [JSON.stringify(urls), draftId, userId]
          );
      
          if (result.rows.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'Draft not found or unauthorized'
            });
          }
      
          res.status(200).json({
            success: true,
            data: { urls },
            message: 'Additional images uploaded successfully'
          });
        } catch (error) {
          console.error('Error uploading additional images:', error);
          res.status(500).json({
            success: false,
            message: 'Error uploading files',
            error: error.message
          });
        }
    },

    uploadAdditionalImagesNoUser: async (req, res) => {
        try {
          if (!req.files || req.files.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No files uploaded'
            });
          }
      
          const uploadPromises = req.files.map(async (file) => {
            const fileName = `media/temp/additional/${Date.now()}-${file.originalname}`;
            
            const command = new PutObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: fileName,
              Body: file.buffer,
              ContentType: file.mimetype
            });
      
            await s3Client.send(command);
            return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
          });
      
          const urls = await Promise.all(uploadPromises);
      
          res.status(200).json({
            success: true,
            data: { urls },
            message: 'Additional images uploaded successfully'
          });
        } catch (error) {
          console.error('Error uploading additional images:', error);
          res.status(500).json({
            success: false,
            message: 'Error uploading files',
            error: error.message
          });
        }
    },

    uploadInstructionImage: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }
    
            // Generate a unique filename
            const fileName = `instructions/${Date.now()}-${req.file.originalname}`;
            
            // Upload to S3
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            });
    
            await s3Client.send(command);
    
            // Generate the URL for the uploaded image
            const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    
            res.status(200).json({
                success: true,
                data: { url: fileUrl },
                message: 'File uploaded successfully'
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).json({
                success: false,
                message: 'Error uploading file',
                error: error.message
            });
        }
    },  
};

module.exports = MediaController;
