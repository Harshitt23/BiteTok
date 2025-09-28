# Video Background Files

Place your video files in this directory to use them as background videos.

## Supported Formats:
- MP4 (recommended)
- WebM
- OGG

## File Structure:
```
public/
  videos/
    your-video.mp4
    another-video.webm
    etc.
```

## Usage:
1. Add your video files to this directory
2. Update the video source in `src/App.jsx`:
   ```jsx
   <source src="/videos/your-video.mp4" type="video/mp4" />
   ```

## Video Recommendations:
- Resolution: 1920x1080 or higher
- Format: MP4 (H.264 codec)
- Duration: 10-30 seconds for seamless looping
- File size: Keep under 10MB for web performance
