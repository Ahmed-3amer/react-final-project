import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { APIClient } from "@/api";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

export default function EditPost() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [sectionTitle, setSectionTitle] = useState("");
    const [sectionBody, setSectionBody] = useState("");
    const [sectionId, setSectionId] = useState(null); 

    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await APIClient.get(`/posts/${postId}`);
                const post = response.data;

                setTitle(post.title);
                setContent(post.content);

                if (post.sections && post.sections.length > 0) {
                    const firstSection = post.sections[0];
                    setSectionId(firstSection.id);
                    setSectionTitle(firstSection.title);
                    setSectionBody(firstSection.body);
                }
            } catch (err) {
                console.error("Failed to load post:", err);
                toast.error("Error loading post data");
            }
        };

        fetchPost();
    }, [postId]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedPost = {
            title,
            content,
            sections: [
                {
                    id: sectionId,
                    title: sectionTitle,
                    body: sectionBody,
                },
            ],
        };

        try {
            await APIClient.put(`/posts/${postId}`, updatedPost);
            toast.success("Post updated successfully!");
            navigate("/user-posts");
        } catch (err) {
            console.error("Failed to update post:", err);
            toast.error("Failed to update post");
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <h2 className="mb-4">Edit Post</h2>
            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    <label>Title</label>
                    <input
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Content</label>
                    <textarea
                        className="form-control"
                        rows="4"
                        style={{ resize: "none", width: "100%", height: "100px" }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Section Title</label>
                    <input
                        className="form-control"
                        value={sectionTitle}
                        onChange={(e) => setSectionTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Section Body</label>
                    <textarea
                        className="form-control"
                        rows="4"
                        style={{ resize: "none", width: "100%", height: "150px" }}
                        value={sectionBody}
                        onChange={(e) => setSectionBody(e.target.value)}
                        required
                    />
                </div>
                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">
                        Update Post
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowCancelModal(true)}
                    >
                        Cancel
                    </button>
                </div>
            </form>

            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Editing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to cancel and leave this page?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                        No
                    </Button>
                    <Button variant="danger" onClick={() => navigate("/user-posts")}>
                        Yes, Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
