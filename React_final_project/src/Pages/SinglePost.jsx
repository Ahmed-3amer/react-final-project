import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "@/api";

export default function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await APIClient.get(`/posts/${postId}`);
        setPost(response.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        alert("Failed to load post details");
      }
    };

    fetchPost();
  }, [postId]);

  const handleBack = () => {
    navigate("/posts");
  };

  if (!post) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <div className="container mt-5 position-relative">
      <div
        className="position-fixed top-0 start-0 w-100 bg-white shadow-sm d-flex justify-content-start align-items-center p-3"
        style={{ zIndex: 1000 }}
      >
        <button className="btn" onClick={handleBack}>
          ⬅ Back to Posts
        </button>
      </div>

      <div className="mt-5 pt-5">
        <h2>{post.title}</h2>
        <p className="text-muted">{post.content}</p>

        <hr />
        <h4>Sections</h4>
        {post.sections && post.sections.length > 0 ? (
          post.sections.map((section, index) => (
            <div key={index} className="mb-3">
              <h5>{section.title}</h5>
              <p>{section.body}</p>
              <hr />
            </div>
          ))
        ) : (
          <p>No sections available.</p>
        )}
      </div>
    </div>
  );
}
