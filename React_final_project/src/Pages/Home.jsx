import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/custom.css";

export default function Home() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="home-page">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        fade
        interval={3000}
        controls={true}
        indicators={true}
        className="hero-carousel"
      >
        <Carousel.Item>
          <div className="carousel-slide slide-1">
            <div className="carousel-content">
              <h3>Welcome to CodexShare</h3>
              <p>Where ideas find their voice.</p>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-slide slide-2">
            <div className="carousel-content">
              <h3>Empowering Readers & Writers</h3>
              <p>Share your stories, inspire the world.</p>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-slide slide-3">
            <div className="carousel-content">
              <h3>Join Our Community</h3>
              <p>Create. Discover. Connect.</p>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>

      <section className="about-section">
        <div className="container">
          <h2>About</h2>
          <p className="lead">
            CodexShare is a modern blogging platform built for passionate
            writers and curious readers. Whether you're here to publish your
            stories, explore diverse ideas, or connect with creators — this is
            your space.
          </p>
        </div>
      </section>

      <section className="creator-section">
        <div className="container">
          <div className="creator-grid">
            <div className="creator-avatar">
              <img
                src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2dyYW1tZXJzfGVufDB8fDB8fHww"
                alt="Creator"
              />
            </div>
            <div className="creator-bio">
              <h3>
                Meet the <span>Creator</span>
              </h3>
              <p>
                Hi, I'm <strong>Ahmed</strong> — a front-end developer with a
                passion for clean design and meaningful content. This blog
                platform was built as part of my React learning journey.
              </p>
              <p>
                Feel free to explore the posts, share your thoughts, and enjoy
                the experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>What You Can Do Here</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-pencil-square"></i>
              </div>
              <h5>Write Posts</h5>
              <p>
                Share your thoughts and stories with our intuitive post editor.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-search"></i>
              </div>
              <h5>Explore Content</h5>
              <p>
                Discover diverse topics and connect with like-minded readers.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-person-circle"></i>
              </div>
              <h5>Your Profile</h5>
              <p>Customize your personal space and manage your publications.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
