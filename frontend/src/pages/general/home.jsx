import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, endpoints } from '../../config/api';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const PAGE_LIMIT = 8;

const FILTER_TAGS = ['vegan', 'vegetarian', 'spicy', 'gluten-free', 'keto', 'dessert'];

// Bundled sample reels shown only when the (unfiltered) backend feed is empty.
const DEMO_REELS = [
  { _id: 'demo-1', video: '/videos/vertical/3139863-hd_1080_1920_30fps.mp4', name: 'Burger & White Sauce Pasta', description: 'Juicy burger with creamy Indian-style white sauce pasta.', foodPartner: { businessName: 'Spice Garden', city: 'Pune' }, likeCount: 1250, commentCount: 89, saveCount: 0, isDemo: true },
  { _id: 'demo-2', video: '/videos/vertical/3709159-uhd_2160_4096_25fps.mp4', name: 'Pancakes with Honey', description: 'Fluffy golden pancakes drizzled with sweet honey.', foodPartner: { businessName: 'Delhi Darbar', city: 'Delhi' }, likeCount: 2100, commentCount: 156, saveCount: 0, isDemo: true },
  { _id: 'demo-3', video: '/videos/vertical/4058071-uhd_2160_4096_25fps.mp4', name: 'Spaghetti', description: 'Classic spaghetti tossed in rich, flavorful sauce.', foodPartner: { businessName: 'Italiano Kitchen', city: 'Mumbai' }, likeCount: 890, commentCount: 67, saveCount: 0, isDemo: true },
  { _id: 'demo-4', video: '/videos/vertical/10200320-hd_2160_3840_25fps.mp4', name: 'Veg Biryani', description: 'Flavorful rice cooked with vegetables and spices.', foodPartner: { businessName: 'Ariz Biryani Valley', city: 'Hyderabad' }, likeCount: 1850, commentCount: 142, saveCount: 0, isDemo: true },
  { _id: 'demo-5', video: '/videos/vertical/7141505-uhd_2160_4096_30fps.mp4', name: 'Chocolate Pancakes', description: 'Rich, fluffy chocolate pancakes with a touch of sweetness.', foodPartner: { businessName: 'Choco Heaven', city: 'Pune' }, likeCount: 2750, commentCount: 198, saveCount: 0, isDemo: true },
  { _id: 'demo-6', video: '/videos/vertical/8844427-uhd_2160_3840_30fps.mp4', name: 'Homemade Laddoo', description: 'Soft laddoos made with flour, sugar, and ghee.', foodPartner: { businessName: 'Homemade Sweets', city: 'Jaipur' }, likeCount: 3200, commentCount: 267, saveCount: 0, isDemo: true },
];

const formatCount = (n = 0) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0)}k` : `${n}`;

const Reel = ({ item, active, onLike, onSave, onOpenComments, onVisitStore }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [active]);

  return (
    <div className="reel-video-container" data-id={item._id} style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        className="reel-video"
        src={item.video}
        loop
        muted
        playsInline
        preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />

      <div className="video-overlay">
        <div className="restaurant-info">
          <h3 className="restaurant-name">{item.foodPartner?.businessName || 'BiteTok'}</h3>
          <h2 className="food-title">{item.name}</h2>
          {item.description && (
            <p className="food-description">
              {item.description.length > 120 ? `${item.description.slice(0, 120)}…` : item.description}
            </p>
          )}
          {item.tags?.length > 0 && (
            <div className="reel-tags">
              {item.tags.slice(0, 3).map((t) => (
                <span key={t} className="reel-tag">#{t}</span>
              ))}
            </div>
          )}
        </div>
        <div className="action-buttons">
          <button className="visit-store-btn" onClick={() => onVisitStore(item)}>Visit Store</button>
        </div>
      </div>

      <div className="reel-rail">
        <button className={`rail-btn ${item.liked ? 'active' : ''}`} onClick={() => onLike(item)} aria-label="Like">
          <span className="rail-icon">{item.liked ? '❤️' : '🤍'}</span>
          <span className="rail-count">{formatCount(item.likeCount)}</span>
        </button>
        <button className="rail-btn" onClick={() => onOpenComments(item)} aria-label="Comments">
          <span className="rail-icon">💬</span>
          <span className="rail-count">{formatCount(item.commentCount)}</span>
        </button>
        <button className={`rail-btn ${item.saved ? 'active' : ''}`} onClick={() => onSave(item)} aria-label="Save">
          <span className="rail-icon">{item.saved ? '🔖' : '📑'}</span>
          <span className="rail-count">{formatCount(item.saveCount)}</span>
        </button>
      </div>
    </div>
  );
};

const StoreModal = ({ partner, onClose }) => {
  if (!partner) return null;
  const fullAddress = [partner.address, partner.city].filter(Boolean).join(', ');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${partner.businessName} ${fullAddress}`
  )}`;
  return (
    <div className="comments-backdrop" onClick={onClose}>
      <div className="store-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comments-header">
          <span>{partner.businessName}</span>
          <button className="comments-close" onClick={onClose}>✕</button>
        </div>
        <div className="store-body">
          {fullAddress && <p>📍 {fullAddress}</p>}
          {partner.phone && (
            <p>📞 <a href={`tel:${partner.phone}`}>{partner.phone}</a></p>
          )}
          <a className="btn" href={mapsUrl} target="_blank" rel="noreferrer">Open in Google Maps</a>
        </div>
      </div>
    </div>
  );
};

const CommentsPanel = ({ food, onClose, onPosted }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await apiClient.get(endpoints.comments(food._id));
        if (alive) setComments(data.comments || []);
      } catch {
        if (alive) setError('Could not load comments.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [food._id]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    setError('');
    try {
      const { data } = await apiClient.post(endpoints.comments(food._id), { text });
      setComments((prev) => [data.comment, ...prev]);
      setText('');
      onPosted?.();
    } catch (err) {
      setError(err.response?.status === 401 ? 'Please log in to comment.' : err.uiMessage);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="comments-backdrop" onClick={onClose}>
      <div className="comments-panel" onClick={(e) => e.stopPropagation()}>
        <div className="comments-header">
          <span>Comments</span>
          <button className="comments-close" onClick={onClose}>✕</button>
        </div>
        <div className="comments-list">
          {loading ? (
            <p className="comments-empty">Loading…</p>
          ) : comments.length === 0 ? (
            <p className="comments-empty">No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="comment-item">
                <strong>{c.user?.fullName || 'User'}</strong>
                <p>{c.text}</p>
              </div>
            ))
          )}
        </div>
        <form className="comments-form" onSubmit={submit}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment…" maxLength={500} />
          <button type="submit" disabled={posting}>{posting ? '…' : 'Post'}</button>
        </form>
        {error && <p className="comments-error">{error}</p>}
      </div>
    </div>
  );
};

const Home = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, isPartner, logout } = useAuth();
  const containerRef = useRef(null);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [usingDemo, setUsingDemo] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [tag, setTag] = useState('');

  const [toast, setToast] = useState('');
  const [commentsFor, setCommentsFor] = useState(null);
  const [storeFor, setStoreFor] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }, []);

  // Debounce the search box into the applied query.
  useEffect(() => {
    const t = setTimeout(() => setAppliedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // (Re)load page 1 whenever filters change.
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get(endpoints.feed, {
          params: { page: 1, limit: PAGE_LIMIT, search: appliedSearch || undefined, tag: tag || undefined },
        });
        if (!alive) return;
        let feed = data.foodItems || [];
        let demo = false;
        if (feed.length === 0 && !appliedSearch && !tag) {
          feed = DEMO_REELS;
          demo = true;
        }
        setItems(feed);
        setUsingDemo(demo);
        setPage(1);
        setHasMore(demo ? false : data.hasMore);
        setActiveId(feed[0]?._id ?? null);
      } catch {
        if (!alive) return;
        if (!appliedSearch && !tag) {
          setItems(DEMO_REELS);
          setUsingDemo(true);
          setActiveId(DEMO_REELS[0]._id);
          setError('Could not reach the server — showing sample reels.');
        } else {
          setItems([]);
          setError('Could not load results.');
        }
        setHasMore(false);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [appliedSearch, tag]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || usingDemo) return;
    setLoadingMore(true);
    const next = page + 1;
    try {
      const { data } = await apiClient.get(endpoints.feed, {
        params: { page: next, limit: PAGE_LIMIT, search: appliedSearch || undefined, tag: tag || undefined },
      });
      setItems((prev) => [...prev, ...(data.foodItems || [])]);
      setPage(next);
      setHasMore(data.hasMore);
    } catch {
      /* keep what we have */
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, usingDemo, page, appliedSearch, tag]);

  // Drive autoplay + prefetch from which reel is centered.
  useEffect(() => {
    const root = containerRef.current;
    if (!root || items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActiveId(entry.target.getAttribute('data-id'));
          }
        });
      },
      { root, threshold: [0.6] }
    );
    root.querySelectorAll('.reel-video-container').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // Load the next page when nearing the end.
  useEffect(() => {
    if (!activeId) return;
    const idx = items.findIndex((it) => it._id === activeId);
    if (idx >= 0 && idx >= items.length - 2) loadMore();
  }, [activeId, items, loadMore]);

  const requireLogin = (err) => {
    if (err.response?.status === 401) {
      showToast('Please log in to continue');
      setTimeout(() => navigate('/user/login'), 800);
      return true;
    }
    return false;
  };

  const handleLike = async (item) => {
    if (item.isDemo) return showToast('Log in and explore real reels to interact');
    setItems((prev) =>
      prev.map((it) =>
        it._id === item._id ? { ...it, liked: !it.liked, likeCount: it.likeCount + (it.liked ? -1 : 1) } : it
      )
    );
    try {
      const { data } = await apiClient.post(endpoints.like(item._id));
      setItems((prev) =>
        prev.map((it) => (it._id === item._id ? { ...it, liked: data.liked, likeCount: data.likeCount } : it))
      );
    } catch (err) {
      setItems((prev) =>
        prev.map((it) => (it._id === item._id ? { ...it, liked: item.liked, likeCount: item.likeCount } : it))
      );
      if (!requireLogin(err)) showToast(err.uiMessage);
    }
  };

  const handleSave = async (item) => {
    if (item.isDemo) return showToast('Log in and explore real reels to interact');
    try {
      const { data } = await apiClient.post(endpoints.save(item._id));
      setItems((prev) =>
        prev.map((it) => (it._id === item._id ? { ...it, saved: data.saved, saveCount: data.saveCount } : it))
      );
      showToast(data.saved ? 'Saved' : 'Removed from saved');
    } catch (err) {
      if (!requireLogin(err)) showToast(err.uiMessage);
    }
  };

  const openComments = (item) => {
    if (item.isDemo) return showToast('Log in and explore real reels to interact');
    setCommentsFor(item);
  };

  return (
    <>
      {/* Top bar: brand, search, filters, account */}
      <div className="feed-topbar">
        <span className="feed-brand">🍽️ BiteTok</span>
        <input
          className="feed-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dishes or restaurants…"
        />
        <div className="feed-account">
          {isAuthenticated ? (
            <>
              {isPartner ? (
                <button className="feed-link" onClick={() => navigate('/food-partner/home')}>Dashboard</button>
              ) : (
                <button className="feed-link" onClick={() => navigate('/saved')}>Saved</button>
              )}
              <button className="feed-link" onClick={async () => { await logout(); showToast('Logged out'); }}>
                Logout
              </button>
            </>
          ) : (
            <button className="feed-link" onClick={() => navigate('/user/login')}>Log in</button>
          )}
        </div>
      </div>

      <div className="feed-filters">
        {FILTER_TAGS.map((t) => (
          <button
            key={t}
            className={`filter-chip ${tag === t ? 'active' : ''}`}
            onClick={() => setTag((cur) => (cur === t ? '' : t))}
          >
            #{t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={`reel-container ${theme}`} style={{ position: 'relative' }}>
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading delicious food reels…</p>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className={`reel-container ${theme}`} style={{ position: 'relative' }}>
          <div className="error-container">
            <div className="error-icon">🍽️</div>
            <h3>{appliedSearch || tag ? 'No matching reels' : 'No food reels yet'}</h3>
            <p>{error || (appliedSearch || tag ? 'Try a different search or filter.' : 'Check back soon!')}</p>
          </div>
        </div>
      ) : (
        <div className={`reel-container ${theme}`} ref={containerRef}>
          {items.map((item) => (
            <Reel
              key={item._id}
              item={item}
              active={item._id === activeId}
              onLike={handleLike}
              onSave={handleSave}
              onOpenComments={openComments}
              onVisitStore={(it) => setStoreFor(it.foodPartner)}
            />
          ))}
          {loadingMore && (
            <div className="reel-loadmore"><div className="loading-spinner" /></div>
          )}
        </div>
      )}

      {commentsFor && (
        <CommentsPanel
          food={commentsFor}
          onClose={() => setCommentsFor(null)}
          onPosted={() =>
            setItems((prev) =>
              prev.map((it) => (it._id === commentsFor._id ? { ...it, commentCount: it.commentCount + 1 } : it))
            )
          }
        />
      )}

      {storeFor && <StoreModal partner={storeFor} onClose={() => setStoreFor(null)} />}

      {toast && <div className="reel-toast">{toast}</div>}
    </>
  );
};

export default Home;
