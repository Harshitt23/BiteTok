import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateFoodPartner = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const dragRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    video: null,
    tags: []
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  
  // Available tags
  const availableTags = [
    { id: 'vegan', label: 'Vegan', icon: '🌱', color: '#4CAF50' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥬', color: '#8BC34A' },
    { id: 'spicy', label: 'Spicy', icon: '🌶️', color: '#FF5722' },
    { id: 'gluten-free', label: 'Gluten Free', icon: '🌾', color: '#FF9800' },
    { id: 'dairy-free', label: 'Dairy Free', icon: '🥛', color: '#2196F3' },
    { id: 'keto', label: 'Keto', icon: '🥑', color: '#9C27B0' },
    { id: 'low-carb', label: 'Low Carb', icon: '🥗', color: '#00BCD4' },
    { id: 'protein-rich', label: 'High Protein', icon: '💪', color: '#E91E63' }
  ];
  
  // Mouse tracking for hover effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      container.style.setProperty('--mouse-x', `${x}%`);
      container.style.setProperty('--mouse-y', `${y}%`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleVideoFile(files[0]);
    }
  };

  const handleVideoFile = (file) => {
    if (file && file.type.startsWith('video/')) {
      setFormData(prev => ({
        ...prev,
        video: file
      }));
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setValidationErrors(prev => ({ ...prev, video: null }));
    } else {
      setValidationErrors(prev => ({ ...prev, video: 'Please select a valid video file' }));
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleVideoFile(file);
    }
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Food name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Food name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.video) {
      errors.video = 'Video is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsUploading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('video', formData.video);
      submitData.append('tags', JSON.stringify(formData.tags));
      
      const response = await axios.post('http://localhost:3000/api/food/create', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      console.log('Food item created successfully:', response.data);
      
      // Show success animation
      setShowSuccess(true);
      
      // Reset form after animation
      setTimeout(() => {
        setFormData({ name: '', description: '', video: null, tags: [] });
        setPreviewUrl(null);
        setShowSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error creating food item:', error);
      setValidationErrors({ submit: 'Failed to create food item. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className={`create-food-page ${theme}`}>
      <div className="create-food-container" ref={containerRef}>
        <div className="create-food-header">
          <h1>Create New Food Item</h1>
          <p>Add a new delicious item to your profile</p>
        </div>
        
        <form className="create-food-form" onSubmit={handleSubmit}>
          {/* Video Upload Section */}
          <div className="form-section">
            <label className="section-label">
              Food Video
              <span 
                className="tooltip-trigger"
                onMouseEnter={() => setShowTooltip('video')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                ℹ️
              </span>
              {showTooltip === 'video' && (
                <div className="tooltip">
                  Upload a mouth-watering video showcasing your dish. Best results with good lighting and close-up shots.
                </div>
              )}
            </label>
            <div 
              className={`video-upload-area ${isDragOver ? 'drag-over' : ''} ${validationErrors.video ? 'error' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              ref={dragRef}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="video/*"
                onChange={handleVideoChange}
                className="video-input"
                required
              />
              <div className="video-upload-placeholder">
                {previewUrl ? (
                  <div className="video-preview-container">
                    <video
                      src={previewUrl}
                      controls
                      className="video-preview"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <button 
                      type="button" 
                      className="remove-video-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl(null);
                        setFormData(prev => ({ ...prev, video: null }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📹</div>
                    <p>Drag & drop or click to upload video</p>
                    <span>MP4, MOV, AVI up to 100MB</span>
                    <div className="upload-animation"></div>
                  </div>
                )}
              </div>
              {validationErrors.video && (
                <div className="error-message">{validationErrors.video}</div>
              )}
            </div>
          </div>
          
          {/* Food Name Section */}
          <div className="form-section">
            <label className="section-label">
              Food Name
              <span 
                className="tooltip-trigger"
                onMouseEnter={() => setShowTooltip('name')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                ℹ️
              </span>
              {showTooltip === 'name' && (
                <div className="tooltip">
                  Choose a descriptive and appetizing name that makes customers want to try your dish.
                </div>
              )}
            </label>
            <div className="input-container">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter food name (e.g., Spicy Chicken Burger)"
                className={`food-input ${focusedField === 'name' ? 'focused' : ''} ${validationErrors.name ? 'error' : ''}`}
                required
              />
              {validationErrors.name && (
                <div className="error-message">{validationErrors.name}</div>
              )}
            </div>
          </div>
          
          {/* Description Section */}
          <div className="form-section">
            <label className="section-label">
              Description
              <span 
                className="tooltip-trigger"
                onMouseEnter={() => setShowTooltip('description')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                ℹ️
              </span>
              {showTooltip === 'description' && (
                <div className="tooltip">
                  Describe the ingredients, cooking method, and what makes this dish special. Be detailed and appetizing!
                </div>
              )}
            </label>
            <div className="input-container">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                placeholder="Describe your food item, ingredients, and what makes it special..."
                className={`food-textarea ${focusedField === 'description' ? 'focused' : ''} ${validationErrors.description ? 'error' : ''}`}
                rows="4"
                required
              />
              {validationErrors.description && (
                <div className="error-message">{validationErrors.description}</div>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="form-section">
            <label className="section-label">
              Tags
              <span 
                className="tooltip-trigger"
                onMouseEnter={() => setShowTooltip('tags')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                ℹ️
              </span>
              {showTooltip === 'tags' && (
                <div className="tooltip">
                  Select relevant tags to help customers find your dish based on dietary preferences and characteristics.
                </div>
              )}
            </label>
            <div className="tags-container">
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  className={`tag-btn ${formData.tags.includes(tag.id) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag.id)}
                  style={{ '--tag-color': tag.color }}
                >
                  <span className="tag-icon">{tag.icon}</span>
                  <span className="tag-label">{tag.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className={`submit-btn ${isUploading ? 'uploading' : ''}`}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating...
                </>
              ) : (
                <>
                  <span className="btn-icon">✨</span>
                  Create Food Item
                </>
              )}
            </button>
            {validationErrors.submit && (
              <div className="error-message submit-error">{validationErrors.submit}</div>
            )}
          </div>
        </form>

        {/* Success Animation */}
        {showSuccess && (
          <div className="success-animation">
            <div className="success-content">
              <div className="success-icon">🎉</div>
              <h3>Food Item Created!</h3>
              <p>Your delicious dish has been added to the menu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateFoodPartner;