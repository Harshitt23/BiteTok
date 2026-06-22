const multer = require('multer');

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

const uploadVideo = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) return cb(null, true);
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only video files are allowed'));
    },
});

module.exports = { uploadVideo, MAX_FILE_SIZE };
