import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, endpoints } from '../../config/api';
import { useTheme } from '../../contexts/ThemeContext';

const Saved = () => {
  const { theme } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await apiClient.get(endpoints.savedFood);
        if (alive) setItems(data.foodItems || []);
      } catch (err) {
        if (alive) setError(err.uiMessage || 'Could not load saved items.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const unsave = async (id) => {
    try {
      await apiClient.post(endpoints.save(id));
      setItems((prev) => prev.filter((it) => it._id !== id));
    } catch {
      /* leave item in place on failure */
    }
  };

  return (
    <div className={`page ${theme}`} style={{ minHeight: '100vh', padding: '24px' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: 0 }}>🔖 Saved</h1>
          <Link to="/home" className="btn secondary">← Back to feed</Link>
        </div>

        {loading ? (
          <div className="loading-container"><div className="loading-spinner" /><p>Loading saved items…</p></div>
        ) : error ? (
          <p className="auth-error">{error}</p>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.8 }}>
            <div style={{ fontSize: '3rem' }}>🍽️</div>
            <h3>Nothing saved yet</h3>
            <p>Tap the bookmark on any reel to save it for later.</p>
            <Link to="/home" className="btn">Explore the feed</Link>
          </div>
        ) : (
          <div className="saved-grid">
            {items.map((item) => (
              <div key={item._id} className="saved-card">
                <video className="saved-thumb" src={item.video} muted playsInline preload="metadata" />
                <div className="saved-info">
                  <h3>{item.name}</h3>
                  <p className="saved-partner">{item.foodPartner?.businessName || 'BiteTok'}</p>
                  <button className="btn secondary" onClick={() => unsave(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
