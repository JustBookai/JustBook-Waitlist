import * as React from 'react';

interface EmailTemplateProps {
  email: string;
  type?: 'welcome' | 'unsubscribe';
}

export function generateEmailHtml({ email, type = 'welcome' }: EmailTemplateProps) {
  const isWelcome = type === 'welcome';

  // Professional colors from the app
  const brandTeal = '#12A19A';
  const brandNavy = '#090D31';
  const brandOrange = '#FF921E';
  const textGray = '#475569';
  const bgGray = '#f8fafc';

  return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${bgGray}; padding: 40px 20px; margin: 0; width: 100%;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(9, 13, 49, 0.08); border: 1px solid rgba(0, 0, 0, 0.05);">
        
        <!-- Header -->
        <div style="padding: 40px 20px; text-align: center; background-color: ${brandNavy}; background-image: linear-gradient(135deg, #090D31 0%, #0d144a 100%);">
          <div style="margin-bottom: 10px;">
            <span style="color: ${brandTeal}; fontSize: 32px; font-weight: 800; letter-spacing: -1px;">JustBook</span>
          </div>
          <div style="height: 2px; width: 40px; background-color: ${brandOrange}; margin: 15px auto 0;"></div>
        </div>

        <!-- Content Section -->
        <div style="padding: 50px 40px;">
          ${isWelcome ? `
            <h1 style="color: ${brandNavy}; font-size: 28px; font-weight: 800; line-height: 1.2; margin: 0 0 20px; text-align: center;">
              Welcome to the Future of Booking! 🚀
            </h1>
            
            <p style="color: ${textGray}; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
              Hello there,
            </p>
            
            <p style="color: ${textGray}; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">
              We've successfully secured your spot on the <strong>JustBook</strong> waitlist for <span style="color: ${brandNavy}; font-weight: 600;">${email}</span>. You're now officially in line to experience a wait-free Zambia.
            </p>

            <div style="background-color: rgba(18, 161, 154, 0.05); border-left: 4px solid ${brandTeal}; padding: 30px; border-radius: 16px; margin-bottom: 35px;">
              <p style="color: ${brandNavy}; font-size: 18px; font-weight: 700; margin: 0 0 10px;">
                What's Next?
              </p>
              <p style="color: ${textGray}; font-size: 15px; margin: 0; line-height: 1.6;">
                We'll notify you the moment we launch our multiplatform application. No more physical queues—just digital precision.
              </p>
            </div>
          ` : `
            <h1 style="color: ${brandNavy}; font-size: 28px; font-weight: 800; line-height: 1.2; margin: 0 0 20px; text-align: center;">
              We're Sorry to See You Go
            </h1>
            
            <p style="color: ${textGray}; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
              This is a confirmation that <strong>${email}</strong> has been removed from the JustBook waitlist.
            </p>

            <div style="background-color: rgba(255, 146, 30, 0.05); border-left: 4px solid ${brandOrange}; padding: 30px; border-radius: 16px; margin-bottom: 35px;">
              <p style="color: ${brandNavy}; font-size: 15px; margin: 0; line-height: 1.6;">
                You won't receive any more updates from us regarding early access. If this was a mistake, you can always sign up again on our website.
              </p>
            </div>
          `}

          <div style="border-top: 1px solid #f1f5f9; padding-top: 30px; margin-top: 10px;">
            <p style="color: ${brandNavy}; font-weight: 700; font-size: 16px; margin: 0;">
              The JustBook Team
            </p>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 5px;">
              Zambia's Premier SAAS Multiplatform
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 40px; text-align: center; background-color: #fcfcfd; border-top: 1px solid #f8fafc;">
          <p style="color: ${brandNavy}; font-weight: 600; font-size: 14px; margin-bottom: 15px;">
            Bridging Service Excellence & Convenience
          </p>
          <div style="margin-bottom: 20px;">
             <a href="#" style="color: ${brandTeal}; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 600;">Website</a>
             <a href="#" style="color: ${brandTeal}; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 600;">LinkedIn</a>
             <a href="#" style="color: ${brandTeal}; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 600;">Instagram</a>
          </div>
          <p style="color: #cbd5e1; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
            &copy; 2026 JustBook Ltd. All rights reserved.
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 25px;">
        <p style="color: #94a3b8; font-size: 12px;">
          You received this email because you interacted with the JustBook waitlist.
        </p>
      </div>
    </div>
  `;
}
