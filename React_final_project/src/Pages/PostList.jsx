import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIClient } from "@/api";
import "../styles/posts-style.css";

export default function AllPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await APIClient.get("/posts");
        const rawPosts = response.data;

        const enrichedPosts = await Promise.all(
          rawPosts.map(async (post) => {
            try {
              const userRes = await APIClient.get(`/users/${post.userId}`);
              const avatarFileName = userRes.data.avatar;

              const fullAvatarURL = avatarFileName
                ? `http://localhost:3000/uploads/${avatarFileName}`
                : "/default-avatar.png";

              return {
                ...post,
                author: {
                  name: userRes.data.name,
                  avatar: fullAvatarURL,
                },
                createdAt: new Date().toISOString(),
              };
            } catch {
              return {
                ...post,
                author: {
                  name: "Unknown",
                  avatar: "/default-avatar.png",
                },
                createdAt: new Date().toISOString(),
              };
            }
          })
        );

        setPosts(enrichedPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleView = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const formatDate = (dateStr) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  return (
    <div className="all-posts-container">
      <div className="posts-header">
        <h2>Community Posts</h2>
        <p>Discover stories from our community</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-journal-text"></i>
          <p>No posts available yet</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-content">
                <div className="post-header">
                  <h3>{post.title}</h3>
                  <button 
                    className="view-btn"
                    onClick={() => handleView(post.id)}
                  >
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
                <p className="post-excerpt">
                  {post.content.length > 120
                    ? post.content.slice(0, 120) + "..."
                    : post.content}
                </p>
              </div>
              
              <div className="post-footer">
                <div className="author-info">
                  <img 
                    src={post.author?.avatar} 
                    alt={post.author?.name} 
                    className="author-avatar"
                  />
                  <div>
                    <span className="author-name">{post.author?.name}</span>
                    <span className="post-date">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}