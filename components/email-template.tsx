import * as React from 'react';

interface EmailTemplateProps {
  email: string;
  name?: string;
  type?: 'welcome' | 'unsubscribe';
}

export function generateEmailHtml({ email, name, type = 'welcome' }: EmailTemplateProps) {
  const isWelcome = type === 'welcome';
  const displayName = name || 'Friend';

  // Professional colors from the Logo
  const brandTeal = '#12A19A';
  const brandNavy = '#090D31';
  const brandOrange = '#FF921E';
  const textGray = '#475569';
  const bgGray = '#f1f5f9';

  return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${brandNavy}; padding: 40px 20px; margin: 0; width: 100%;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #090D31; border-radius: 32px; overflow: hidden; border: 1px solid rgba(18, 161, 154, 0.2); box-shadow: 0 40px 100px rgba(0,0,0,0.5);">
        
        <!-- Premium Header Area -->
        <div style="padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); background: linear-gradient(180deg, rgba(18, 161, 154, 0.05) 0%, transparent 100%);">
          <div style="margin-bottom: 24px;">
            <!-- Using CID for embedded image -->
            <img src="cid:jblogo" alt="JustBook Logo" style="height: 60px; width: auto; display: block; margin: 0 auto;" />
          </div>
          <div style="height: 3px; width: 60px; background: linear-gradient(90deg, ${brandTeal}, ${brandOrange}); margin: 0 auto;"></div>
        </div>

        <!-- Body Content -->
        <div style="padding: 60px 50px;">
          ${isWelcome ? `
            <div style="text-align: center; margin-bottom: 40px;">
              <span style="background-color: rgba(18, 161, 154, 0.1); color: ${brandTeal}; padding: 8px 20px; border-radius: 100px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
                Waitlist Confirmed
              </span>
              <h1 style="color: #FFFFFF; font-size: 32px; font-weight: 800; line-height: 1.2; margin: 24px 0 0;">
                Welcome to the Inner Circle, ${displayName}! 🚀
              </h1>
            </div>
            
            <p style="color: #94a3b8; font-size: 17px; line-height: 1.8; margin-bottom: 30px;">
              You’ve just taken the first step toward reclaiming your time. We’ve registered <strong>${email}</strong> for exclusive early access to Zambia's premier booking platform.
            </p>

            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.05); padding: 35px; border-radius: 24px; margin-bottom: 40px;">
              <h3 style="color: ${brandTeal}; font-size: 18px; font-weight: 800; margin: 0 0 12px;">The JustBook Mission</h3>
              <p style="color: #cbd5e1; font-size: 15px; margin: 0; line-height: 1.7;">
                We are building more than an app; we're building a future where physical queues are a thing of the past. From barbers to clinics, your next session is just a tap away.
              </p>
            </div>

            <div style="text-align: center;">
              <a href="#" style="display: inline-block; background: linear-gradient(90deg, ${brandTeal}, #0e847e); color: #FFFFFF; padding: 18px 45px; border-radius: 15px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 10px 20px rgba(18, 161, 154, 0.3);">
                Explore the Vision
              </a>
            </div>
          ` : `
            <div style="text-align: center; margin-bottom: 40px;">
              <span style="background-color: rgba(255, 146, 30, 0.1); color: ${brandOrange}; padding: 8px 20px; border-radius: 100px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
                Opt-Out Successful
              </span>
              <h1 style="color: #FFFFFF; font-size: 32px; font-weight: 800; line-height: 1.2; margin: 24px 0 0;">
                We're Sorry to See You Go
              </h1>
            </div>
            
            <p style="color: #94a3b8; font-size: 17px; line-height: 1.8; margin-bottom: 30px;">
              Hello ${displayName}, this is a official confirmation that <strong>${email}</strong> has been removed from the JustBook waitlist.
            </p>

            <div style="background: rgba(255, 255, 255, 0.02); border: 1px dashed rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
              <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.6;">
                You will no longer receive updates about our beta launch. If this was a mistake, you are always welcome back.
              </p>
            </div>
          `}
        </div>

        <!-- Footer -->
        <div style="padding: 50px 40px; text-align: center; background-color: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05);">
          <p style="color: #cbd5e1; font-weight: 700; font-size: 15px; margin-bottom: 20px;">
            Bridging Excellence & Convenience
          </p>
          <div style="margin-bottom: 30px;">
             <a href="#" style="color: ${brandTeal}; text-decoration: none; margin: 0 15px; font-size: 13px; font-weight: 600;">Website</a>
             <a href="#" style="color: ${brandTeal}; text-decoration: none; margin: 0 15px; font-size: 13px; font-weight: 600;">Twitter</a>
             <a href="#" style="color: ${brandTeal}; text-decoration: none; margin: 0 15px; font-size: 13px; font-weight: 600;">Instagram</a>
          </div>
          <p style="color: #475569; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
            &copy; 2026 JUSTBOOK LTD. LUSAKA, ZAMBIA
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-bottom: 40px;">
        <p style="color: #475569; font-size: 11px;">
          You received this email because of your interest in JustBook.
        </p>
      </div>
    </div>
  `;
}
