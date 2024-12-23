const s3Service = require('./s3Service');

const mediaCleanupService = {
  cleanupTempImages: async () => {
    try {
      const objects = await s3Service.listObjects('media/temp');
      if (!objects.Contents?.length) return;

      const now = new Date();
      const oldObjects = objects.Contents.filter(obj => {
        const age = now.getTime() - obj.LastModified.getTime();
        return age > (24 * 60 * 60 * 1000); // 24 hours
      });

      if (oldObjects.length > 0) {
        const keys = oldObjects.map(obj => obj.Key);
        await s3Service.deleteMultipleObjects(keys);
      }
    } catch (error) {
      console.error('Error cleaning up temp images:', error);
    }
  },

  cleanupDraftImages: async (draftId, mediaUrls = []) => {
    try {
      const keys = mediaUrls.map(url => url.split('.com/')[1]);
      if (keys.length > 0) {
        await s3Service.deleteMultipleObjects(keys);
      }
    } catch (error) {
      console.error('Error cleaning up draft images:', error);
      throw error;
    }
  },

  moveMediaToPermanentStorage: async (media) => {
    try {
      const newMedia = { mainImage: null, additionalImages: [] };

      // Move main image if exists
      if (media.mainImage) {
        const oldKey = media.mainImage.split('.com/')[1];
        if (oldKey.includes('temp/')) {
          const newKey = oldKey.replace('media/temp/', 'media/permanent/');
          await s3Service.moveObject(oldKey, newKey);
          newMedia.mainImage = media.mainImage.replace('media/temp/', 'media/permanent/');
        } else {
          newMedia.mainImage = media.mainImage; // Keep existing permanent URL
        }
      }

      // Move additional images if they exist
      if (media.additionalImages?.length > 0) {
        const movedUrls = await Promise.all(
          media.additionalImages.map(async (url) => {
            const oldKey = url.split('.com/')[1];
            if (oldKey.includes('temp/')) {
              const newKey = oldKey.replace('media/temp/', 'media/permanent/');
              await s3Service.moveObject(oldKey, newKey);
              return url.replace('media/temp/', 'media/permanent/');
            }
            return url; // Keep existing permanent URL
          })
        );
        newMedia.additionalImages = movedUrls;
      }

      return newMedia;
    } catch (error) {
      console.error('Error moving media to permanent storage:', error);
      throw new Error('Failed to move media files to permanent storage');
    }
  }
};

module.exports = mediaCleanupService;