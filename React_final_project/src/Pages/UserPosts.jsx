import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { APIClient } from "@/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../styles/UserPosts.css";

export default function UserPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  useEffect(() => {
    const authStore = localStorage.getItem("auth-store");
    if (authStore) {
      const parsed = JSON.parse(authStore);
      const token = parsed.state?.token;
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserId(decoded.id);
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await APIClient.get("/posts");
        setPosts(response.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    fetchPosts();
  }, []);

  const handleCreate = () => {
    navigate("/posts/create");
  };

  const handleView = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const confirmDelete = (postId) => {
    setPostIdToDelete(postId);
    setShowConfirmModal(true);
  };

  const deletePost = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth-store"))?.state
        ?.token;

      await APIClient.delete(`/posts/${postIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prev) => prev.filter((post) => post.id !== postIdToDelete));
      toast.success("Post deleted successfully!", { position: "top-right" });
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.error("Failed to delete post", { position: "top-right" });
    } finally {
      setShowConfirmModal(false);
      setPostIdToDelete(null);
    }
  };

  const filteredPosts = posts.filter((post) => post.userId === userId);

  return (
    <div className="user-posts-container">
      <ToastContainer />
      <div className="posts-header">
        <h2>My Posts</h2>
        <button className="create-post-btn" onClick={handleCreate}>
          <i className="bi bi-plus-lg"></i> Create New Post
        </button>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-journal-text"></i>
          <p>You haven't created any posts yet</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-content">
                <h3>{post.title}</h3>
                <p className="post-excerpt">
                  {post.content.length > 100
                    ? post.content.slice(0, 100) + "..."
                    : post.content}
                </p>
              </div>
              <div className="post-actions">
                <button
                  className="action-btn view-btn"
                  onClick={() => handleView(post.id)}
                >
                  <i className="bi bi-eye"></i> View
                </button>
                <button
                  className="action-btn edit-btn"
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                >
                  <i className="bi bi-pencil"></i> Edit
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => confirmDelete(post.id)}
                >
                  <i className="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
        className="delete-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-warning">
            <i className="bi bi-exclamation-triangle"></i>
            <p>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
            className="cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={deletePost}
            className="confirm-delete-btn"
          >
            Delete Post
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
