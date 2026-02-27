import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <h1 className="gradient-text">About HALLOW</h1>
        <p className="subtitle">Redefining the modern shopping experience.</p>
      </section>

      {/* Mission Section */}
      <section className="about-content">
        <div className="mission-grid">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>
              At <strong>HALLOW</strong>, we believe that quality products should be accessible, 
              stylish, and delivered with a seamless digital experience. We aren't just an 
              e-commerce platform; we are a curated collection of what's trending, 
              designed for the modern individual.
            </p>
          </div>
          <div className="mission-image">
             {/* Replace with a nice lifestyle image */}
             <div className="image-placeholder"></div>
          </div>
        </div>
      </section>

      {/* Features/Values Section */}
      <section className="about-values">
        <div className="value-card">
          <div className="icon">🚀</div>
          <h3>Fast Delivery</h3>
          <p>Get your favorite products delivered to your doorstep in record time.</p>
        </div>
        <div className="value-card">
          <div className="icon">💎</div>
          <h3>Premium Quality</h3>
          <p>Every item in our catalog is hand-picked and verified for excellence.</p>
        </div>
        <div className="value-card">
          <div className="icon">🔒</div>
          <h3>Secure Payments</h3>
          <p>Shop with confidence using our 2FA-protected authentication and secure checkout.</p>
        </div>
      </section>
    </div>
  );
}