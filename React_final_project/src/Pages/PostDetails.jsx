import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "@/api";

export default function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await APIClient.get(`/posts/${postId}`);
        setPost(res.data);

        // Fetch author info
        const userRes = await APIClient.get(`/users/${res.data.userId}`);
        const avatarFileName = userRes.data.avatar;

        setAuthor({
          name: userRes.data.name,
          avatar: avatarFileName
            ? `http://localhost:3000/uploads/${avatarFileName}`
            : "/default-avatar.png",
        });
      } catch (err) {
        console.error("Failed to fetch post or author:", err);
        alert("Failed to load post details");
      }
    };

    fetchPost();
  }, [postId]);

  const handleBack = () => {
    navigate("/posts");
  };

  if (!post) return <p className="text-center mt-5">Loading...</p>;

  const fakeCreatedAt = new Date(Date.now() - post.id * 3600000);
  const formattedDate = fakeCreatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <button className="btn btn-primary" onClick={handleBack}>
          <i class="bi bi-arrow-left me-2"></i>Back to Posts
        </button>
      </div>

      <div className="card shadow-sm p-4">
        <h2 className="mb-3">{post.title}</h2>
        <p className="text-muted">{post.content}</p>

        {/* Author Info */}
        {author && (
          <div className="d-flex align-items-center mt-4 mb-4">
            <img
              src={author.avatar}
              alt="Author avatar"
              className="rounded-circle me-3"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <div>
              <strong className="text-primary">{author.name}</strong>
              <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
                Posted on {formattedDate}
              </p>
            </div>
          </div>
        )}

        <hr className="my-4" />
        <h4 className="mb-3">Sections</h4>

        {post.sections && post.sections.length > 0 ? (
          post.sections.map((section, index) => (
            <div key={index} className="mb-4 p-3 border rounded bg-light">
              <h5 className="mb-2 text-dark">{section.title}</h5>
              <p className="mb-0">{section.body}</p>
            </div>
          ))
        ) : (
          <p className="text-muted">No sections available.</p>
        )}
      </div>
    </div>
  );
}
