import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIClient } from "@/api";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

export default function NewPost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [sectionTitle, setSectionTitle] = useState("");
    const [sectionBody, setSectionBody] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);

    const navigate = useNavigate();

    const authStore = localStorage.getItem("auth-store");
    let token = null;
    let userId1 = null;

    if (authStore) {
        const parsed = JSON.parse(authStore);
        token = parsed.state?.token || null;
        if (token) {
            const decoded = jwtDecode(token);
            userId1 = decoded.id;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = userId1;

        const postData = {
            title,
            content,
            userId,
            sections: [
                {
                    title: sectionTitle,
                    body: sectionBody,
                },
            ],
        };

        try {
            await APIClient.post("/posts", postData);
            toast.success("Post created successfully!");
            navigate("/user-posts");
        } catch (err) {
            console.error("Failed to create post:", err);
            toast.error("Failed to create post");
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <h2 className="mb-4">Create New Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Title</label>
                    <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Content</label>
                    <textarea className="form-control" rows="4" style={{ resize: "none", width: "100%", height: "100px" }} value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Section Title</label>
                    <input className="form-control" value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Section Body</label>
                    <textarea className="form-control" rows="4" style={{ resize: "none", width: "100%", height: "150px" }} value={sectionBody} onChange={(e) => setSectionBody(e.target.value)} required />
                </div>
                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-success">Create Post</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCancelModal(true)}>Cancel</button>
                </div>
            </form>

            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Creation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to cancel and leave this page?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>No</Button>
                    <Button variant="danger" onClick={() => navigate("/user-posts")}>Yes, Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
