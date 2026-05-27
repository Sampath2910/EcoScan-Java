import React, { useState } from 'react'
import client from '../api/client'
import Navbar from '../components/Navbar'

const FAQ_ITEMS = [
  {
    q: 'How long does it take to get a response?',
    a: 'We aim to respond within 24-48 business hours. During peak periods it may take up to 3 business days.'
  },
  {
    q: 'Will my email be shared with third parties?',
    a: 'No. Your email and message are confidential and will never be shared without your explicit consent.'
  },
  {
    q: 'Can I get in touch for partnership opportunities?',
    a: 'Absolutely. Mention "partnership" in your message and it will be routed to our partnerships team.'
  },
  {
    q: 'What if I have a technical issue?',
    a: 'Describe the issue in detail and mention "bug report" so we can prioritize it accordingly.'
  },
]

const CONTACT_INFO = [
  { label: 'Support', email: 'support@ecoscan.com', note: 'General inquiries & user support' },
  { label: 'Business', email: 'partnerships@ecoscan.com', note: 'B2B, partnerships & sponsorships' },
  { label: 'Technical', email: 'tech@ecoscan.com', note: 'Bug reports & technical issues' },
]

const PROCESS_STEPS = [
  'Your message is received and stored securely',
  'Message routed to the appropriate department',
  'Response sent within 24-48 business hours',
  'Your message is archived for reference',
]

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      await client.post('/contact', form)
      setSuccess('Thank you! We will get back to you shortly.')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">

        <div className="page-header">
          <h1>Contact Us</h1>
          <p>Have a question or suggestion? We would love to hear from you.</p>
        </div>

        <div className="contact-layout">
          {/* Left — Form */}
          <div className="contact-form-card">
            <h3 className="contact-card-title">Send a Message</h3>
            {error   && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows="5"
                  placeholder="Tell us about your inquiry, feedback, or partnership opportunity..."
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right — Info */}
          <div className="contact-info-card">
            <div className="contact-info-block">
              <h4 className="contact-info-title">Contact Channels</h4>
              <div className="contact-email-list">
                {CONTACT_INFO.map((c, i) => (
                  <div key={i} className="contact-email-item">
                    <span className="contact-email-label">{c.label}</span>
                    <span className="contact-email-addr">{c.email}</span>
                    <span className="contact-email-note">{c.note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-info-block">
              <h4 className="contact-info-title">Office</h4>
              <p className="contact-address">EcoScan Headquarters<br />Hyderabad, Telangana, India</p>
            </div>

            <div className="contact-info-block">
              <h4 className="contact-info-title">What Happens Next</h4>
              <ul className="contact-process-list">
                {PROCESS_STEPS.map((step, i) => (
                  <li key={i} className="contact-process-item">
                    <span className="process-step-num">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions</p>
          </div>
          <div className="faq-grid">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="faq-item">
                <h4>{item.q}</h4>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
