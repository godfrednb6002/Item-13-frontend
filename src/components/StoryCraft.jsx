import React from 'react';
import { Leaf, Flame, Sparkles, Truck, Award, ShieldCheck } from 'lucide-react';

export default function StoryCraft() {
  const craftSteps = [
    {
      icon: <Flame size={24} className="text-amber" />,
      title: 'Mushroom Kernel Architecture',
      desc: 'We strictly source dense, non-GMO mushroom kernels that puff into round spheres instead of flaky butterflies—holding maximum glaze and seasoning.',
    },
    {
      icon: <Sparkles size={24} className="text-purple" />,
      title: 'Cold-Pressed Botanicals',
      desc: 'No synthetic flavor enhancers or artificial coloring. Our sodas and teas are made from real Japanese yuzu, wild handpicked berries, and Ethiopian single-origin coffee.',
    },
    {
      icon: <ShieldCheck size={24} className="text-emerald" />,
      title: 'Small Batch Kettle Precision',
      desc: 'Every batch is popped in small copper kettles at exact temperatures, guaranteeing an unbroken crisp crunch and zero unpopped bitter remnants.',
    },
  ];

  return (
    <section id="story" className="story-section">
      <div className="story-container glass-panel">
        <div className="story-header text-center">
          <span className="badge-tag badge-emerald">Pure Craft Philosophy</span>
          <h2 className="story-title">Crafting the Modern Movie & Lounge Bite</h2>
          <p className="story-subtitle">
            Say goodbye to greasy, over-salted cinema popcorn and syrupy sodas. We created
            POPNSIZZLE for those who appreciate elevated culinary craft in everyday treats.
          </p>
        </div>

        <div className="craft-grid">
          {craftSteps.map((step, index) => (
            <div key={index} className="craft-card glass-pill">
              <div className="craft-icon-circle">{step.icon}</div>
              <h3 className="craft-card-title">{step.title}</h3>
              <p className="craft-card-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Live Metrics Counter Bar */}
        <div className="metrics-strip glass-pill">
          <div className="metric-box">
            <span className="metric-number">100%</span>
            <span className="metric-label">Organic Non-GMO Corn</span>
          </div>
          <div className="metric-separator" />
          <div className="metric-box">
            <span className="metric-number">&lt; 80 cal</span>
            <span className="metric-label">Per Cold Soda Serving</span>
          </div>
          <div className="metric-separator" />
          <div className="metric-box">
            <span className="metric-number">4.9 / 5</span>
            <span className="metric-label">Customer Flavor Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}
