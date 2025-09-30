import React, { useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateFoodPartner = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    video: null
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        video: file
      }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.video) {
      alert('Please fill in all fields and select a video');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('video', formData.video);
      
      const response = await axios.post('http://localhost:3000/api/food/create', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      console.log('Food item created successfully:', response.data);
      alert('Food item created successfully!');
      
      // Reset form
      setFormData({ name: '', description: '', video: null });
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error creating food item:', error);
      alert('Failed to create food item. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className={`create-food-page ${theme}`}>
      <div className="create-food-container">
        <div className="create-food-header">
          <h1>Create New Food Item</h1>
          <p>Add a new delicious item to your restaurant menu</p>
        </div>
        
        <form className="create-food-form" onSubmit={handleSubmit}>
          {/* Video Upload Section */}
          <div className="form-section">
            <label className="section-label">Food Video</label>
            <div className="video-upload-area">
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
                  <video
                    src={previewUrl}
                    controls
                    className="video-preview"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📹</div>
                    <p>Click to upload video</p>
                    <span>MP4, MOV, AVI up to 100MB</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Food Name Section */}
          <div className="form-section">
            <label className="section-label">Food Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter food name (e.g., Spicy Chicken Burger)"
              className="food-input"
              required
            />
          </div>
          
          {/* Description Section */}
          <div className="form-section">
            <label className="section-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your food item, ingredients, and what makes it special..."
              className="food-textarea"
              rows="4"
              required
            />
          </div>
          
          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isUploading}
            >
              {isUploading ? 'Creating...' : 'Create Food Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFoodPartner;