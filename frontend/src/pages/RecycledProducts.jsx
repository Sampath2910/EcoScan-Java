import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const IMPACT_STATS = [
  { value: '4,100+', label: 'kg Waste Recycled', icon: '♻️' },
  { value: '12', label: 'Partner Companies', icon: '🏢' },
  { value: '50+', label: 'Product Types', icon: '📦' },
  { value: '30%', label: 'Carbon Reduction', icon: '🌱' },
]

const PRODUCTS = [
  { 
    image: '🛋️', 
    company: 'GreenPlast Pvt Ltd',  
    wasteUsed: '1,200 kg', 
    wasteType: 'Plastic',
    products: 'Recycled Plastic Outdoor Furniture',
    productList: ['Garden Chairs', 'Patio Tables', 'Deck Benches', 'Planters', 'Storage Boxes'],
    description: 'Transform single-use plastic bottles into durable outdoor furniture. Each piece uses 80-120 recycled bottles. Weather-resistant, UV-protected, and maintenance-free.',
    wasteSource: 'PET & HDPE plastic bottles, food containers, packaging',
    specifications: 'Lightweight yet sturdy • Non-toxic finish • 10-year warranty • Colors: Black, Brown, Teak',
    color: '#3b82f6',
    impact: 'Saved 2,400 kg CO₂'
  },
  { 
    image: '📚', 
    company: 'EcoPaper Industries', 
    wasteUsed: '800 kg',    
    wasteType: 'Paper',
    products: 'Premium Recycled Paper Products',
    productList: ['Notebooks & Journals', 'Packaging Materials', 'File Folders', 'Business Cards', 'Kraft Bags'],
    description: 'High-quality paper made from 100% post-consumer waste. Suitable for writing, printing, and packaging. FSC certified and chlorine-free.',
    wasteSource: 'Old newspapers, magazines, office paper, cardboard boxes',
    specifications: 'GSM: 80-300 • Bright white finish • Acid-free • Sustainable sourcing',
    color: '#f59e0b',
    impact: 'Saved 12 trees'
  },
  { 
    image: '🏠', 
    company: 'GlassCycle Corp',      
    wasteUsed: '600 kg',    
    wasteType: 'Glass',
    products: 'Architectural & Decorative Glass',
    productList: ['Floor Tiles', 'Wall Panels', 'Countertops', 'Decorative Vessels', 'Terrazzo Sheets'],
    description: 'Crushed recycled glass creates stunning architectural elements. Each piece is unique with embedded color gradients and textures for modern home design.',
    wasteSource: 'Discarded glass bottles, jars, window panes, old drinking glasses',
    specifications: 'Sizes: Custom cuts available • Colors: Emerald, Amber, Clear, Mixed • Heat-resistant up to 350°C',
    color: '#06b6d4',
    impact: '100% recyclable'
  },
  { 
    image: '🏗️', 
    company: 'Metal Renew Ltd',      
    wasteUsed: '1,500 kg',   
    wasteType: 'Metal',
    products: 'Industrial & Construction Materials',
    productList: ['Reinforcement Rods', 'Steel Sheets', 'Fasteners', 'Structural Beams', 'Pipes & Fittings'],
    description: 'Premium quality metal materials from scrap metal recycling. Tested for strength and durability with full traceability. Meets international standards.',
    wasteSource: 'Scrap iron, steel cans, automotive waste, industrial metal scraps',
    specifications: 'Tensile strength: 400+ MPa • Full certifications • Zero mill scale • Custom grades available',
    color: '#8b5cf6',
    impact: '95% energy saved'
  },
  { 
    image: '👜', 
    company: 'Textile Revival Co', 
    wasteUsed: '400 kg',    
    wasteType: 'Fabric',
    products: 'Fashionable Upcycled Textiles',
    productList: ['Eco Handbags', 'T-Shirts & Apparel', 'Backpacks', 'Cushion Covers', 'Canvas Tote Bags'],
    description: 'Sustainable fashion using reclaimed textiles and deadstock fabrics. Each piece is handcrafted with ethical practices and premium finishing.',
    wasteSource: 'Discarded clothing, textile factory scraps, old bed linens, upholstery waste',
    specifications: 'Organic cotton blend • Water-based dyes • GOTS certified • Limited editions',
    color: '#ec4899',
    impact: 'Zero water waste'
  },
  { 
    image: '🪵', 
    company: 'TimberReuse Inc.',      
    wasteUsed: '2,000 kg',    
    wasteType: 'Wood',
    products: 'Premium Reclaimed Wood Products',
    productList: ['Flooring & Planking', 'Furniture Pieces', 'Decorative Beams', 'Cutting Boards', 'Wall Panels'],
    description: 'Beautifully aged reclaimed timber from old buildings and structures. Each piece has character and history. Ideal for rustic to modern interiors.',
    wasteSource: 'Salvaged building timber, old doors, warehouse pallets, railway sleepers',
    specifications: 'Species: Oak, Pine, Cedar, Teak • Moisture: 12-14% • Finishes: Natural, Matte, Varnished',
    color: '#10b981',
    impact: 'Saved 40 trees'
  },
]

const PROCESS_STEPS = [
  { step: '1', title: 'Collection', desc: 'Waste is collected from homes and businesses' },
  { step: '2', title: 'Sorting', desc: 'Materials are sorted by type and quality' },
  { step: '3', title: 'Processing', desc: 'Advanced recycling transforms waste into raw materials' },
  { step: '4', title: 'Manufacturing', desc: 'New products are created with recycled content' },
]

export default function RecycledProducts() {
  return (
    <div className="page products-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="products-hero">
        <div className="products-hero-content">
          <div className="hero-badge">
            <span>🔄</span>
            Circular Economy
          </div>
          <h1 className="products-hero-title">
            From Waste to <span className="highlight">Wonders</span>
          </h1>
          <p className="products-hero-subtitle">
            Discover amazing products created from recycled materials. 
            Every purchase supports a sustainable future and reduces landfill waste.
          </p>
          <div className="hero-actions">
            <Link to="/directory" className="btn-primary btn-large">
              <span>🏢</span>
              Find Recyclers
            </Link>
            <Link to="/upload" className="btn-outline btn-large">
              <span>📷</span>
              Start Recycling
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="impact-section">
        <div className="impact-grid">
          {IMPACT_STATS.map((stat, i) => (
            <div key={i} className="impact-card">
              <div className="impact-icon">{stat.icon}</div>
              <div className="impact-value">{stat.value}</div>
              <div className="impact-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-showcase">
        <div className="page-content">
          <div className="section-header">
            <h2>Featured Recycled Products</h2>
            <p>Quality products made from materials you helped recycle</p>
          </div>
          
          <div className="products-grid-enhanced">
            {PRODUCTS.map((p, i) => (
              <div key={i} className="product-card-enhanced" style={{'--card-color': p.color}}>
                <div className="product-card-header">
                  <div className="product-icon-large" style={{fontSize: '3rem'}}>{p.image}</div>
                  <div className="product-waste-badge" style={{'--badge-color': p.color}}>
                    {p.wasteType}
                  </div>
                </div>
                
                <div className="product-card-body">
                  <h3 className="product-company">{p.company}</h3>
                  <h4 className="product-title">{p.products}</h4>
                  <p className="product-description">{p.description}</p>
                  
                  <div className="product-details-grid">
                    <div className="detail-box">
                      <h5>📦 What We Make:</h5>
                      <ul className="product-list">
                        {p.productList.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="detail-box">
                      <h5>♻️ Waste Source:</h5>
                      <p className="small-text">{p.wasteSource}</p>
                    </div>
                    
                    <div className="detail-box">
                      <h5>⚙️ Specifications:</h5>
                      <p className="small-text">{p.specifications}</p>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">📊</span>
                      <span className="detail-text">{p.wasteUsed} waste processed</span>
                    </div>
                  </div>
                </div>
                
                <div className="product-card-footer">
                  <div className="impact-badge-small" style={{'--badge-bg': p.color}}>
                    <span>🌍</span>
                    {p.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="page-content">
          <div className="section-header light">
            <h2>The Recycling Journey</h2>
            <p>How your waste becomes valuable products</p>
          </div>
          
          <div className="process-steps">
            {PROCESS_STEPS.map((s, i) => (
              <div key={i} className="process-step">
                <div className="step-circle">{s.step}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="products-cta">
        <div className="cta-content">
          <div className="cta-icon">🌟</div>
          <h2>Be Part of the Solution</h2>
          <p>Join thousands of users who are making a difference through responsible recycling</p>
          <Link to="/upload" className="btn-primary btn-large">
            <span>🚀</span>
            Start Your Recycling Journey
          </Link>
        </div>
      </section>
    </div>
  )
}
