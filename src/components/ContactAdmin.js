import React from 'react';
import { Link } from 'react-router-dom';

export default function ContactAdmin() {
    const email = "shashikant.888.v@gmail.com";
    const subject = "Account Request - [Your Name]";
    const body = `Hi Admin,

I would like to request an account for TaskFlux.

Full Name: [Your Name]
Role Requested: [Manager / Employee]
Reason/Context: [Briefly explain why you need an account or who referred you]

Thanks,
[Your Name]`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '700px', margin: '40px auto', textAlign: 'center', padding: '40px' }}>
                <h2 style={{ fontSize: '32px', marginBottom: '10px', color: '#333' }}>Get in Touch</h2>
                <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
                    Need an account or have a question? We're here to help! Choose your preferred way to connect.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                    {/* Email Card */}
                    <div style={{
                        background: '#f8f9fa',
                        padding: '30px',
                        borderRadius: '16px',
                        transition: 'transform 0.2s',
                        border: '1px solid #e9ecef'
                    }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '40px', marginBottom: '15px' }}>📧</div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Email Support</h3>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                            Send us a direct request with your details. We usually respond within 24 hours.
                        </p>
                        <a
                            href={mailtoLink}
                            style={{
                                display: 'inline-block',
                                background: '#667eea',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                boxShadow: '0 4px 6px rgba(102, 126, 234, 0.25)'
                            }}
                        >
                            Send Email Request
                        </a>
                    </div>

                    {/* LinkedIn Card */}
                    <div style={{
                        background: '#f8f9fa',
                        padding: '30px',
                        borderRadius: '16px',
                        transition: 'transform 0.2s',
                        border: '1px solid #e9ecef'
                    }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '40px', marginBottom: '15px' }}>💼</div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Connect on LinkedIn</h3>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                            Reach out professionally. Let's connect and discuss your access needs.
                        </p>
                        <a
                            href="https://www.linkedin.com/in/shashikantvishwakarma404"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                background: '#0077b5',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                boxShadow: '0 4px 6px rgba(0, 119, 181, 0.25)'
                            }}
                        >
                            View Profile
                        </a>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '30px' }}>
                    <Link to="/login" style={{ color: '#666', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span>←</span> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
