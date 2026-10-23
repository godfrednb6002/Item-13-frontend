import React from 'react';
import { REVIEWS } from '../data';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="section-head-wrap text-center">
        <div className="glass-pill section-chip">
          <Star size={14} className="text-amber" fill="currentColor" />
          <span>Loved By Cinephiles & Foodies</span>
        </div>
        <h2 className="section-heading">Verified Flavor Enthusiasts</h2>
        <p className="section-subtext">
          Hear what cinema directors, sommeliers, and everyday snackers say about the POPNSIZZLE experience.
        </p>
      </div>

      <div className="testimonials-grid">
        {REVIEWS.map((rev) => (
          <div key={rev.id} className="testimonial-card glass-panel">
            <Quote className="quote-icon" size={28} />
            <p className="testimonial-text">"{rev.comment}"</p>

            <div className="testimonial-user-row">
              <img
                src={rev.avatar}
                alt={rev.author}
                className="user-avatar"
              />
              <div className="user-info">
                <div className="user-name-line">
                  <span className="user-name">{rev.author}</span>
                  <CheckCircle2 size={15} className="verified-icon" />
                </div>
                <span className="user-role">{rev.role}</span>
              </div>
              <div className="user-stars">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={13} className="star-filled" fill="currentColor" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
