import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const Home = () => {
  const { theme } = useTheme();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [foodVideos, setFoodVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [heartAnimations, setHeartAnimations] = useState([]);

  // Fetch food items from backend
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/food/', {
          withCredentials: true
        });
        
        if (response.data && response.data.foodItems) {
          // Remove duplicates and filter out test items
          const uniqueItems = response.data.foodItems.filter((item, index, self) => 
            index === self.findIndex(t => t.name === item.name && t.description === item.description) &&
            !item.name.toLowerCase().includes('test')
          );
          
          // Transform backend data to match frontend format
          const transformedVideos = uniqueItems.map((item, index) => ({
            id: item._id,
            videoUrl: item.video,
            title: item.name,
            description: item.description,
            restaurantName: item.foodPartner?.businessName || 'Unknown Restaurant',
            likes: Math.floor(Math.random() * 3000) + 500,
            comments: Math.floor(Math.random() * 300) + 50
          }));
          
          // Add static videos to show alongside API videos
          const staticVideos = [
            {
              id: 'static-1',
              videoUrl: '/videos/vertical/3139863-hd_1080_1920_30fps.mp4',
              title: 'Burger with White Sauce Indian Style pasta',
              description: 'Juicy burger served with creamy Indian-style white sauce pasta, a perfect fusion of rich flavors and comfort.',
              restaurantName: 'Spice Garden Restaurant',
              likes: 1250,
              comments: 89
            },
            {
              id: 'static-2',
              videoUrl: '/videos/vertical/3709159-uhd_2160_4096_25fps.mp4',
              title: 'Pancakes with Honey',
              description: 'Fluffy golden pancakes drizzled with sweet honey for a simple, classic treat.',
              restaurantName: 'Delhi Darbar',
              likes: 2100,
              comments: 156
            },
            {
              id: 'static-3',
              videoUrl: '/videos/vertical/4058071-uhd_2160_4096_25fps.mp4',
              title: 'Spaghetti',
              description: 'Classic spaghetti tossed in rich, flavorful sauce for a wholesome and comforting meal.',
              restaurantName: 'Italiano Kitchen',
              likes: 890,
              comments: 67
            },
            {
              id: 'static-4',
              videoUrl: '/videos/vertical/4725784-hd_1080_1920_25fps.mp4',
              title: 'Pancakes',
              description: 'Soft, fluffy pancakes served warm for a light and delicious treat.',
              restaurantName: 'Sweet Dreams Cafe',
              likes: 3200,
              comments: 234
            },
            {
              id: 'static-5',
              videoUrl: '/videos/vertical/10200320-hd_2160_3840_25fps.mp4',
              title: 'Veg Biryani/Pulao',
              description: 'Flavorful rice cooked with vegetables and spices, often served with a side of yogurt or raita.',
              restaurantName: 'Ariz Biryani Valley',
              likes: 1850,
              comments: 142
            },
            {
              id: 'static-6',
              videoUrl: '/videos/vertical/10977367-hd_1080_1920_30fps.mp4',
              title: 'Naan Preparing',
              description: 'Freshly prepared naan, soft and fluffy, straight going into tandoor.',
              restaurantName: 'Ramu Kitchen',
              likes: 980,
              comments: 78
            },
            {
              id: 'static-7',
              videoUrl: '/videos/vertical/7141505-uhd_2160_4096_30fps.mp4',
              title: 'Chocolate Pancakes',
              description: 'Rich, fluffy chocolate pancakes topped with a touch of sweetness for the perfect indulgence.',
              restaurantName: 'Choco Heaven',
              likes: 2750,
              comments: 198
            },
            {
              id: 'static-8',
              videoUrl: '/videos/vertical/8844427-uhd_2160_3840_30fps.mp4',
              title: 'Homemade Laddoo',
              description: 'Soft, chewy laddoos made with flour, sugar, and ghee for a sweet and satisfying treat.',
              restaurantName: 'Homemade Sweets',
              likes: 3200,
              comments: 267
            }
          ];
          
          // Combine API videos with static videos
          const combinedVideos = [...transformedVideos, ...staticVideos];
          setFoodVideos(combinedVideos);
          
          // Initialize likes and comments state
          const initialLikes = {};
          const initialComments = {};
          combinedVideos.forEach(video => {
            initialLikes[video.id] = video.likes;
            initialComments[video.id] = video.comments;
          });
          setLikes(initialLikes);
          setComments(initialComments);
        }
      } catch (error) {
        console.error('Error fetching food items:', error);
        setError('Failed to load food items');
        
        // Fallback to sample data if API fails
        const fallbackVideos = [
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
            title: 'Spaghetti',
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
            title: 'Veg Biryani/Pulao',
            description: 'Flavorful rice cooked with vegetables and spices, often served with a side of yogurt or raita.',
            restaurantName: 'Ariz Biryani Valley',
            likes: 1850,
            comments: 142
          },
          {
            id: 6,
            videoUrl: '/videos/vertical/10977367-hd_1080_1920_30fps.mp4',
            title: 'Naan Preparing',
            description: 'Freshly prepared naan, soft and fluffy, straight going into tandoor.',
            restaurantName: 'Ramu Kitchen',
            likes: 980,
            comments: 78
          },
          {
            id: 7,
            videoUrl: '/videos/vertical/7141505-uhd_2160_4096_30fps.mp4',
            title: 'Chocolate Pancakes',
            description: 'Rich, fluffy chocolate pancakes topped with a touch of sweetness for the perfect indulgence.',
            restaurantName: 'Choco Heaven',
            likes: 2750,
            comments: 198
          },
          {
            id: 8,
            videoUrl: '/videos/vertical/8844427-uhd_2160_3840_30fps.mp4',
            title: 'Homemade Laddoo',
            description: 'Soft, chewy laddoos made with flour, sugar, and ghee for a sweet and satisfying treat.',
            restaurantName: 'Homemade Sweets',
            likes: 3200,
            comments: 267
          }
        ];
        setFoodVideos(fallbackVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

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

  // Handle like button
  const handleLike = (videoId) => {
    setLikes(prev => ({
      ...prev,
      [videoId]: prev[videoId] + 1
    }));

    // Create heart animation
    const heartId = Date.now() + Math.random();
    const newHeart = {
      id: heartId,
      videoId: videoId,
      x: Math.random() * 300 + 100, // Random x position across video width
      y: Math.random() * 200 + 100  // Random y position in middle area of video
    };

    setHeartAnimations(prev => [...prev, newHeart]);

    // Remove heart after animation completes
    setTimeout(() => {
      setHeartAnimations(prev => prev.filter(heart => heart.id !== heartId));
    }, 2000);
  };

  // Handle comment button
  const handleComment = (videoId) => {
    setComments(prev => ({
      ...prev,
      [videoId]: prev[videoId] + 1
    }));
  };

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

  // Show loading state
  if (loading) {
    return (
      <div className={`reel-container ${theme}`} style={{
        position: 'relative'
      }}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading delicious food videos...</p>
        </div>
      </div>
    );
  }

  // Show error state if no videos available
  if (foodVideos.length === 0) {
    return (
      <div className={`reel-container ${theme}`} style={{
        position: 'relative'
      }}>
        <div className="error-container">
          <div className="error-icon">🍽️</div>
          <h3>No food videos available</h3>
          <p>{error || 'Check back later for delicious content!'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`reel-container ${theme}`} ref={containerRef} onScroll={handleScroll}>
      {foodVideos.map((video, index) => (
        <div key={video.id} className="reel-video-container" style={{ position: 'relative' }}>
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
              objectFit: 'contain'
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
            </div>
            
          {/* Transparent Like and Comment Buttons - Outside overlay */}
          <div style={{
            position: 'absolute',
            right: '20px',
            bottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            zIndex: 10,
            pointerEvents: 'auto'
          }}>
            {/* Like Button */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              minWidth: '50px'
            }}
            onClick={() => handleLike(video.id)}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            >
              <span style={{
                fontSize: '20px',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}>❤️</span>
              <span style={{
                color: 'white',
                fontSize: '10px',
                fontWeight: '600',
                marginTop: '3px',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}>
                {likes[video.id] || video.likes}
              </span>
              </div>

            {/* Comment Button */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              minWidth: '50px'
            }}
            onClick={() => handleComment(video.id)}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            >
              <span style={{
                fontSize: '20px',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}>💬</span>
              <span style={{
                color: 'white',
                fontSize: '10px',
                fontWeight: '600',
                marginTop: '3px',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}>
                {comments[video.id] || video.comments}
              </span>
            </div>
          </div>

          {/* Heart Animations */}
          {heartAnimations
            .filter(heart => heart.videoId === video.id)
            .map(heart => (
              <div
                key={heart.id}
                style={{
                  position: 'absolute',
                  left: `${heart.x}px`,
                  top: `${heart.y}px`,
                  fontSize: '48px',
                  color: '#ff6b6b',
                  pointerEvents: 'none',
                  zIndex: 20,
                  animation: 'heartFloat 2s ease-out forwards',
                  textShadow: '0 4px 8px rgba(0,0,0,0.8)'
                }}
              >
                ❤️
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Home;