import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const Home = () => {
  const { theme } = useTheme();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Sample food videos data - using vertical videos from public/videos/vertical folder
  const foodVideos = [
    {
      id: 1,
      videoUrl: '/videos/vertical/3139863-hd_1080_1920_30fps.mp4',
      title: 'Burger with White Sauce Indian Style pasta',
      description: 'Juicy burger served with creamy Indian-style white sauce pasta, a perfect fusion of rich flavors and comfort.',
      restaurantName: 'Spice Garden Restaurant',
      likes: 1250,
      comments: 89
    },
    {
      id: 2,
      videoUrl: '/videos/vertical/3709159-uhd_2160_4096_25fps.mp4',
      title: 'Pancakes with Honey',
      description: 'Fluffy golden pancakes drizzled with sweet honey for a simple, classic treat.',
      restaurantName: 'Delhi Darbar',
      likes: 2100,
      comments: 156
    },
    {
      id: 3,
      videoUrl: '/videos/vertical/4058071-uhd_2160_4096_25fps.mp4',
      title: 'sphagetti',
      description: 'Classic spaghetti tossed in rich, flavorful sauce for a wholesome and comforting meal.',
      restaurantName: 'Italiano Kitchen',
      likes: 890,
      comments: 67
    },
    {
      id: 4,
      videoUrl: '/videos/vertical/4725784-hd_1080_1920_25fps.mp4',
      title: 'Pancakes',
      description: 'Soft, fluffy pancakes served warm for a light and delicious treat.',
      restaurantName: 'Sweet Dreams Cafe',
      likes: 3200,
      comments: 234
    },
    {
      id: 5,
      videoUrl: '/videos/vertical/10200320-hd_2160_3840_25fps.mp4',
      title: 'Veg biriyani/Pulao',
      description: 'Flavorful rice cooked with vegetables and spices, often served with a side of yogurt or raita.',
      restaurantName: 'Ariz Biryani Valley',
      likes: 1850,
      comments: 142
    },
    {
      id: 6,
      videoUrl: '/videos/vertical/10977367-hd_1080_1920_30fps.mp4',
      title: 'Naam preparing ',
      description: 'Freshly prepared naan, soft and fluffy , straight going into tandoor.',
      restaurantName: 'Ramu kitchen',
      likes: 980,
      comments: 78
    },
    {
      id: 7,
      videoUrl: '/videos/vertical/7141505-uhd_2160_4096_30fps.mp4',
      title: 'Choclate Pancakes',
      description: 'Rich, fluffy chocolate pancakes topped with a touch of sweetness for the perfect indulgence.',
      restaurantName: 'Choco heaven',
      likes: 2750,
      comments: 198
    },
    {
      id: 8,
      videoUrl: '/videos/vertical/8844427-uhd_2160_3840_30fps.mp4',
      title: 'Home made Laddoo',
      description: 'Soft, chewy laddos made with flour, sugar, and ghee for a sweet and satisfying treat.',
      restaurantName: 'Home made sweets',
      likes: 3200,
      comments: 267
    }
  ];

  const handleScroll = (e) => {
    if (isScrolling) return;
    
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const videoHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / videoHeight);
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < foodVideos.length) {
      setCurrentVideoIndex(newIndex);
    }
  };

  const scrollToVideo = (index) => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    const container = containerRef.current;
    if (container) {
      const videoHeight = window.innerHeight;
      container.scrollTo({
        top: index * videoHeight,
        behavior: 'smooth'
      });
    }
    
    setTimeout(() => setIsScrolling(false), 500);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    
    if (isScrolling) return;
    
    const direction = e.deltaY > 0 ? 1 : -1;
    const newIndex = currentVideoIndex + direction;
    
    if (newIndex >= 0 && newIndex < foodVideos.length) {
      scrollToVideo(newIndex);
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const touchEndY = touch.clientY;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      const direction = diff > 0 ? 1 : -1;
      const newIndex = currentVideoIndex + direction;
      
      if (newIndex >= 0 && newIndex < foodVideos.length) {
        scrollToVideo(newIndex);
      }
    }
  };

  const [touchStartY, setTouchStartY] = useState(0);

  // Debug: Log video URLs
  useEffect(() => {
    console.log('Food videos:', foodVideos);
    foodVideos.forEach(video => {
      console.log(`Video ${video.id}: ${video.videoUrl}`);
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [currentVideoIndex, isScrolling]);

  return (
    <div className={`reel-container ${theme}`} ref={containerRef} onScroll={handleScroll}>
      {/* Debug info */}
      <div style={{ position: 'fixed', top: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px', zIndex: 9999 }}>
        Current Video: {currentVideoIndex + 1} / {foodVideos.length}
        <br />
        URL: {foodVideos[currentVideoIndex]?.videoUrl}
      </div>
      
      {foodVideos.map((video, index) => (
        <div key={video.id} className="reel-video-container">
          <video
            className="reel-video"
            autoPlay
            loop
            muted
            playsInline
            style={{ 
              display: index === currentVideoIndex ? 'block' : 'none',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              console.error(`Video ${video.id} failed to load:`, e);
              console.error('Video URL:', video.videoUrl);
            }}
            onLoadStart={() => {
              console.log(`Loading video ${video.id}:`, video.videoUrl);
            }}
            onCanPlay={() => {
              console.log(`Video ${video.id} can play:`, video.videoUrl);
            }}
            onLoadedData={() => {
              console.log(`Video ${video.id} loaded data:`, video.videoUrl);
            }}
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Overlay */}
          <div className="video-overlay">
            {/* Restaurant Info */}
            <div className="restaurant-info">
              <h3 className="restaurant-name">{video.restaurantName}</h3>
              <h2 className="food-title">{video.title}</h2>
              <p className="food-description">
                {video.description.length > 120 
                  ? `${video.description.substring(0, 120)}...` 
                  : video.description
                }
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="visit-store-btn">
                Visit Store
              </button>
            </div>
            
            {/* Video Stats */}
            <div className="video-stats">
              <div className="stat-item">
                <span className="stat-icon">❤️</span>
                <span className="stat-count">{video.likes}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💬</span>
                <span className="stat-count">{video.comments}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;