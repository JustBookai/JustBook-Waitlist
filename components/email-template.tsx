import * as React from 'react';

interface EmailTemplateProps {
  email: string;
}

export function EmailTemplate({ email }: EmailTemplateProps) {
  return (
    <div style={{
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#f4f7f9',
      padding: '40px 0',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#090D31',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Header/Logo */}
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#090D31',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h1 style={{
            color: '#12A19A',
            fontSize: '28px',
            fontWeight: '800',
            margin: '0',
            letterSpacing: '1px'
          }}>JUSTBOOK</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            The Future of Service Booking
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '40px', backgroundColor: '#FFFFFF' }}>
          <h2 style={{
            color: '#090D31',
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            You're Officially on the List!
          </h2>

          <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.7', marginBottom: '25px' }}>
            Hello,
          </p>

          <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.7', marginBottom: '25px' }}>
            We've successfully registered <strong>{email}</strong> for the JustBook early access waitlist. We are thrilled to have you with us as we build Zambia's first truly multiplatform booking solution.
          </p>

          <div style={{
            backgroundColor: '#12A19A',
            padding: '25px',
            borderRadius: '12px',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <p style={{ fontSize: '18px', fontWeight: '600', margin: '0' }}>
              Why JustBook?
            </p>
            <p style={{ fontSize: '14px', marginTop: '10px', opacity: '0.9', lineHeight: '1.5' }}>
              We're eliminating physical queues. Soon, you'll be able to book your sessions with preferred service providers and walk in right at your appointed time.
            </p>
          </div>

          <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.7', marginBottom: '25px' }}>
            We'll keep you updated on our progress and notify you the moment we're ready for our beta launch.
          </p>

          <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.7', marginBottom: '40px' }}>
            Thank you for being part of this journey.
          </p>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '25px', textAlign: 'center' }}>
            <p style={{ color: '#090D31', fontWeight: '700', fontSize: '16px', margin: '0' }}>
              The JustBook Team
            </p>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '5px' }}>
              Lusaka, Zambia
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '30px',
          textAlign: 'center',
          backgroundColor: '#090D31'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', margin: '0 10px', fontSize: '13px' }}>Twitter</a>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', margin: '0 10px', fontSize: '13px' }}>LinkedIn</a>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', margin: '0 10px', fontSize: '13px' }}>Instagram</a>
          </div>
          <p style={{ color: '#4b5563', fontSize: '11px', margin: '0' }}>
            &copy; 2026 JustBook Ltd. All rights reserved.
          </p>
          <p style={{ color: '#4b5563', fontSize: '11px', marginTop: '5px' }}>
            You received this email because you signed up for the JustBook waitlist.
          </p>
        </div>
      </div>
    </div>
  );
}
