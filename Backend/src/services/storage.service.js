const ImageKit = require('imagekit');
const env = require('../config/env');

const imagekit = new ImageKit({
    publicKey: env.IMAGEKIT_PUBLIC_KEY,
    privateKey: env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Uploads a video buffer to ImageKit.
 * @param {Buffer} buffer raw file bytes
 * @param {string} fileName unique file name
 * @returns {Promise<{url: string, thumbnailUrl: string, fileId: string}>}
 */
async function uploadVideo(buffer, fileName) {
    const result = await imagekit.upload({
        file: buffer,
        fileName,
        folder: '/bitetok/videos',
        useUniqueFileName: true,
    });

    return {
        url: result.url,
        thumbnailUrl: result.thumbnailUrl || '',
        fileId: result.fileId,
    };
}

async function deleteFile(fileId) {
    if (!fileId) return;
    try {
        await imagekit.deleteFile(fileId);
    } catch (err) {
        // Non-fatal: log and move on so DB cleanup isn't blocked by CDN errors.
        console.error('ImageKit deleteFile failed:', err.message);
    }
}

module.exports = { uploadVideo, deleteFile };
