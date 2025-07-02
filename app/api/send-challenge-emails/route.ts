import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { type, email, name, challengeType, step, accountSize, currentDrawdown, adminEmail, breachType, maxDrawdown, dailyDrawdown, warningType } = data;

    let subject = '';
    let customerHtml = '';
    let adminSubject = '';
    let adminHtml = '';

    switch (type) {
      case 'pass':
        subject = `Congratulations! You've Passed Your Shockwave Capital ${challengeType === 'standard' ? 'Standard' : 'Instant'} Challenge ${step || ''}`;
        customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="background-color: #0D0D0D; padding: 20px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
              <h1 style="color: #0FF1CE; margin: 0; font-size: 24px;">Congratulations! 🎉</h1>
            </div>
            
            <div style="margin-bottom: 30px;">
              <p>Hello ${name},</p>
              <p>We're thrilled to inform you that you've successfully passed your ${challengeType === 'standard' ? 'Standard' : 'Instant'} Challenge ${step || ''}!</p>
              <p>Your trading performance has met all the required objectives, demonstrating excellent risk management and trading discipline.</p>
            </div>
            
            <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
              <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Challenge Details</h2>
              <p style="margin-bottom: 5px;"><strong>Challenge Type:</strong> ${challengeType === 'standard' ? 'Shockwave Standard' : 'Shockwave Instant'} ${step || ''}</p>
              <p style="margin-bottom: 5px;"><strong>Account Size:</strong> $${accountSize?.toLocaleString() || 'N/A'}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px;">Next Steps</h2>
              ${challengeType === 'standard' && step === 'Step 1' ? `
                <p>You're now ready to proceed to Step 2 of the Standard Challenge. We'll be in touch shortly with your new account credentials.</p>
              ` : `
                <p>You've completed the challenge! Our team will review your account and contact you within 24-48 hours regarding your funded account setup.</p>
              `}
            </div>
            
            <div style="margin-bottom: 30px;">
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              <p style="margin-bottom: 0;">Best regards,</p>
              <p style="margin-top: 5px;"><strong>The Shockwave Capital Team</strong></p>
            </div>
            
            <div style="background-color: #0D0D0D; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #999;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Shockwave Capital. All rights reserved.</p>
            </div>
          </div>
        `;
        adminSubject = `Challenge Passed: ${email} - ${challengeType} ${step || ''}`;
        adminHtml = `<p>User ${email} has passed their ${challengeType} challenge ${step || ''}. Account size: $${accountSize?.toLocaleString() || 'N/A'}</p>`;
        break;

      case 'fail':
        // Determine breach details
        let breachDetails = '';
        let breachSpecifics = '';
        
        if (breachType === 'maxDrawdown' || maxDrawdown > (challengeType === 'standard' ? 15 : 12)) {
          breachDetails = 'Maximum Drawdown Limit';
          breachSpecifics = `<li><strong style="color: #dc3545;">Your Maximum Drawdown:</strong> ${maxDrawdown?.toFixed(2) || 'N/A'}%</li>
                            <li><strong>Maximum Allowed:</strong> ${challengeType === 'standard' ? '15%' : '12%'}</li>`;
        } else if (breachType === 'dailyDrawdown' || dailyDrawdown > (challengeType === 'standard' ? 8 : 4)) {
          breachDetails = 'Daily Drawdown Limit';
          breachSpecifics = `<li><strong style="color: #dc3545;">Your Daily Drawdown:</strong> ${dailyDrawdown?.toFixed(2) || 'N/A'}%</li>
                            <li><strong>Maximum Allowed:</strong> ${challengeType === 'standard' ? '8%' : '4%'}</li>`;
        } else if (breachType === 'both') {
          breachDetails = 'Multiple Trading Limits';
          breachSpecifics = `<li><strong style="color: #dc3545;">Your Maximum Drawdown:</strong> ${maxDrawdown?.toFixed(2) || 'N/A'}% (Limit: ${challengeType === 'standard' ? '15%' : '12%'})</li>
                            <li><strong style="color: #dc3545;">Your Daily Drawdown:</strong> ${dailyDrawdown?.toFixed(2) || 'N/A'}% (Limit: ${challengeType === 'standard' ? '8%' : '4%'})</li>`;
        } else {
          breachDetails = 'Trading Objectives';
          breachSpecifics = '<li>Please review your account for specific details</li>';
        }
        
        subject = `❌ Challenge Failed: Your Shockwave Capital ${challengeType === 'standard' ? 'Standard' : 'Instant'} Challenge`;
        customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="background-color: #dc3545; padding: 20px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">❌ Challenge Failed</h1>
            </div>
            
            <div style="margin-bottom: 30px; padding: 20px; background-color: #f8d7da; border: 2px solid #f5c6cb; border-radius: 5px;">
              <p style="margin: 0 0 10px 0;"><strong>Hello ${name},</strong></p>
              <p style="margin: 0; color: #721c24;">We regret to inform you that your ${challengeType === 'standard' ? 'Standard' : 'Instant'} Challenge has been terminated due to breaching the <strong>${breachDetails}</strong>.</p>
            </div>
            
            <div style="margin-bottom: 30px; background-color: #fff5f5; padding: 20px; border-radius: 5px; border-left: 4px solid #dc3545;">
              <h2 style="color: #dc3545; font-size: 18px; margin-bottom: 15px;">Breach Details</h2>
              <ul style="margin: 0; padding-left: 20px;">
                ${breachSpecifics}
              </ul>
            </div>
            
            <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
              <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Challenge Information</h2>
              <p style="margin-bottom: 5px;"><strong>Challenge Type:</strong> ${challengeType === 'standard' ? 'Shockwave Standard' : 'Shockwave Instant'}</p>
              <p style="margin-bottom: 5px;"><strong>Account Size:</strong> $${accountSize?.toLocaleString() || 'N/A'}</p>
              <p style="margin-bottom: 5px;"><strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">FAILED</span></p>
            </div>
            
            <div style="margin-bottom: 30px; background-color: #d4edda; padding: 20px; border-radius: 5px; border: 1px solid #c3e6cb;">
              <h2 style="color: #155724; font-size: 18px; margin-bottom: 15px;">🎯 Don't Give Up!</h2>
              <p style="margin: 0 0 15px 0;">Many successful traders don't pass on their first attempt. Learn from this experience and come back stronger!</p>
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://shockwave-capital.com/challenges" style="display: inline-block; background-color: #0FF1CE; color: #0D0D0D; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get 50% OFF with code "ACTFAST"</a>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">*Offer expires in 24 hours</p>
              </div>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Tips for Your Next Attempt</h2>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Review your risk management strategy</li>
                <li>Consider using smaller position sizes</li>
                <li>Set stop losses to protect your capital</li>
                <li>Focus on consistency over large profits</li>
                <li>Practice proper money management techniques</li>
              </ul>
            </div>
            
            <div style="margin-bottom: 30px;">
              <p>Our support team is here to help you succeed. If you have questions about what went wrong or need guidance for your next attempt, please don't hesitate to reach out.</p>
              <p style="margin-bottom: 0;">Best regards,</p>
              <p style="margin-top: 5px;"><strong>The Shockwave Capital Team</strong></p>
            </div>
            
            <div style="background-color: #0D0D0D; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #999;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Shockwave Capital. All rights reserved.</p>
            </div>
          </div>
        `;
        adminSubject = `Challenge Failed: ${email} - ${challengeType} (${breachDetails})`;
        adminHtml = `<p>User ${email} has failed their ${challengeType} challenge due to ${breachDetails}. Account size: $${accountSize?.toLocaleString() || 'N/A'}</p>
                     <p>Max DD: ${maxDrawdown?.toFixed(2) || 'N/A'}%, Daily DD: ${dailyDrawdown?.toFixed(2) || 'N/A'}%</p>`;
        break;

      case 'drawdown-warning':
        subject = `⚠️ Drawdown Warning: Your Shockwave Capital Challenge`;
        customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="background-color: #0D0D0D; padding: 20px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
              <h1 style="color: #FFA500; margin: 0; font-size: 24px;">⚠️ Drawdown Warning</h1>
            </div>
            
            <div style="margin-bottom: 30px;">
              <p>Hello ${name},</p>
              <p>This is an important notification regarding your ${challengeType === 'standard' ? 'Standard' : 'Instant'} Challenge account.</p>
              <p><strong>Your account has reached a ${currentDrawdown?.toFixed(2) || 'N/A'}% drawdown.</strong></p>
            </div>
            
            <div style="margin-bottom: 30px; background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #FFA500;">
              <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Risk Management Alert</h2>
              <p>You're approaching the maximum drawdown limits for your challenge:</p>
              <ul>
                <li>Maximum Drawdown Limit: ${challengeType === 'standard' ? '15%' : '12%'}</li>
                <li>Daily Drawdown Limit: ${challengeType === 'standard' ? '8%' : '4%'}</li>
              </ul>
              <p><strong>Exceeding these limits will result in challenge failure.</strong></p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px;">Recommended Actions</h2>
              <ul>
                <li>Consider reducing your position sizes</li>
                <li>Review and adjust your risk management strategy</li>
                <li>Take a break to reassess market conditions</li>
                <li>Focus on preserving capital over aggressive profit targets</li>
              </ul>
            </div>
            
            <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 20px; border-radius: 5px; text-align: center;">
              <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">💡 Fresh Start Available</h2>
              <p style="margin-bottom: 20px;">Want to start over with a clean slate? You can reset your account at a heavily discounted price!</p>
              <div style="margin-bottom: 15px;">
                <span style="background-color: #ff6b6b; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                  Save up to 80% on Account Reset
                </span>
              </div>
              <a href="https://shockwave-capital.com/reset" style="display: inline-block; background-color: #0FF1CE; color: #0D0D0D; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 10px;">
                Reset My Account Now
              </a>
              <p style="margin-top: 15px; font-size: 12px; color: #666; font-style: italic;">
                Get fresh account credentials within minutes • Same challenge objectives • Clean drawdown
              </p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <p>Remember, successful trading is about long-term consistency, not short-term gains.</p>
              <p style="margin-bottom: 0;">Best regards,</p>
              <p style="margin-top: 5px;"><strong>The Shockwave Capital Team</strong></p>
            </div>
            
            <div style="background-color: #0D0D0D; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #999;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Shockwave Capital. All rights reserved.</p>
            </div>
          </div>
        `;
        adminSubject = `Drawdown Warning Sent: ${email} - ${currentDrawdown?.toFixed(2)}%`;
        adminHtml = `<p>Drawdown warning sent to ${email}. Current drawdown: ${currentDrawdown?.toFixed(2)}%. Challenge type: ${challengeType}, Account size: $${accountSize?.toLocaleString() || 'N/A'}</p>`;
        break;

      case 'funded-pass':
        subject = `🎉 Welcome to Your Funded Account - $${accountSize?.toLocaleString() || 'N/A'}`;
        customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="background-color: #0D0D0D; padding: 20px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
              <h1 style="color: #0FF1CE; margin: 0; font-size: 24px;">Welcome to Your Funded Account! 🎉</h1>
            </div>
            
            <div style="margin-bottom: 30px;">
              <p>Hello ${name},</p>
              <p>Congratulations! You've successfully completed all challenge phases and earned your funded account.</p>
              <p>Your $${accountSize?.toLocaleString() || 'N/A'} funded account is now active and ready for trading.</p>
            </div>
            
            <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
              <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Funded Account Rules</h2>
              <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                <li><strong>Maximum Drawdown:</strong> 15% from initial balance</li>
                <li><strong>Daily Drawdown:</strong> 8% maximum per day</li>
                <li><strong>Risk Limit:</strong> Maximum 2% risk on open positions at any time</li>
                <li><strong>Important:</strong> Daily drawdown exceeding 2% indicates risking more than allowed (violation)</li>
                <li><strong>Profit Split:</strong> Keep 80% of your profits</li>
                <li><strong>Trading Days:</strong> No minimum requirement, trade at your own pace</li>
              </ul>
            </div>
            
            <div style="margin-bottom: 30px; background-color: #e8f5e9; padding: 20px; border-radius: 5px; border: 1px solid #c8e6c9;">
              <h2 style="color: #2e7d32; font-size: 18px; margin-bottom: 15px;">Key Points to Remember</h2>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Trade conservatively to protect your funded status</li>
                <li>The 2% risk limit is strictly enforced - violations result in immediate termination</li>
                <li>Request payouts anytime you're in profit</li>
                <li>Continue using the same login credentials</li>
              </ul>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px;">Next Steps</h2>
              <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Review the funded account rules carefully</li>
                <li>Continue trading with your existing account</li>
                <li>Request your first payout when ready</li>
                <li>Contact support if you have any questions</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://shockwave-capital.com/dashboard" style="display: inline-block; background-color: #0FF1CE; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Dashboard</a>
            </div>
            
            <div style="margin-bottom: 30px;">
              <p>We're excited to see your continued success as a funded trader!</p>
              <p style="margin-bottom: 0;">Best regards,</p>
              <p style="margin-top: 5px;"><strong>The Shockwave Capital Team</strong></p>
            </div>
            
            <div style="background-color: #0D0D0D; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #999;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Shockwave Capital. All rights reserved.</p>
            </div>
          </div>
        `;
        adminSubject = `Funded Account Activated: ${email} - $${accountSize?.toLocaleString() || 'N/A'}`;
        adminHtml = `<p>User ${email} has been granted a funded account. Account size: $${accountSize?.toLocaleString() || 'N/A'}</p>`;
        break;

      case 'funded-fail':
        subject = `Your Funded Account Has Been Terminated`;
        
        let fundedBreachDetails = '';
        if (breachType === 'maxDrawdown') {
          fundedBreachDetails = `You exceeded the maximum drawdown limit of 15% (current: ${maxDrawdown?.toFixed(2)}%).`;
        } else if (breachType === 'riskViolation') {
          fundedBreachDetails = `You violated the risk management rule by exceeding the maximum 2% total risk exposure allowed across all open trades at any time. Your loss of ${dailyDrawdown?.toFixed(2)}% confirms this violation.`;
        } else {
          fundedBreachDetails = `You violated multiple rules: Maximum drawdown limit exceeded (${maxDrawdown?.toFixed(2)}%, limit: 15%) and risk management violation by exceeding the maximum 2% total risk exposure allowed across all open trades (loss: ${dailyDrawdown?.toFixed(2)}%).`;
        }
        
        customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="background-color: #0D0D0D; padding: 20px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
              <h1 style="color: #FF4444; margin: 0; font-size: 24px;">Funded Account Terminated</h1>
            </div>
            
            <div style="margin-bottom: 30px;">
              <p>Hello ${name},</p>
              <p>We regret to inform you that your funded account ($${accountSize?.toLocaleString()}) has been terminated due to rule violations.</p>
            </div>
            
            <div style="margin-bottom: 30px; background-color: #fee; padding: 15px; border-radius: 5px; border-left: 4px solid #f44;">
              <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Violation Details</h2>
              <p style="margin: 0; color: #666;">${fundedBreachDetails}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px;">Funded Account Rules Reminder</h2>
              <ul style="color: #666; line-height: 1.8;">
                <li><strong>Maximum Drawdown:</strong> 15% from initial balance</li>
                <li><strong>Daily Drawdown:</strong> 8% maximum per day</li>
                <li><strong>Risk Management:</strong> Maximum 2% total risk exposure spread across all open trades at any time</li>
                <li><strong>Important:</strong> Any loss of 2% or more constitutes a risk management violation</li>
              </ul>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px;">What's Next?</h2>
              <p>While this funded account has been terminated, you can:</p>
              <ul style="color: #666; line-height: 1.8;">
                <li>Start a new challenge to earn another funded account</li>
                <li>Purchase a new funded account at the same capital level you were funded at (or above) and maintain your funded trader status!</li>
                <li>Review your trading strategy to better manage risk</li>
                <li>Contact support if you have questions about the violation</li>
              </ul>
            </div>
            
            <div style="margin-bottom: 30px; background-color: #0FF1CE10; border: 2px solid #0FF1CE; border-radius: 10px; padding: 20px; text-align: center;">
              <h2 style="color: #0FF1CE; font-size: 20px; margin-bottom: 15px;">🚀 Keep Your Funded Status!</h2>
              <p style="color: #333; font-size: 16px; margin-bottom: 15px;">
                <strong>Special Offer:</strong> Purchase a new funded account at the same capital level you were funded at (or above) and maintain your funded trader status!
              </p>s
              <div>
                <a href="https://www.shockwave-capital.com/once-funded-stay-funded" style="display: inline-block; background-color: #0FF1CE; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 10px;">
                  Get New Funded Account
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
              <a href="https://www.shockwave-capital.com/once-funded-stay-funded" style="display: inline-block; background-color: #0FF1CE; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get New Funded Account</a>
            </div>
            
            <div style="margin-top: 40px;">
              <p style="margin-bottom: 0;">Best regards,</p>
              <p style="margin-top: 5px;"><strong>The Shockwave Capital Team</strong></p>
            </div>
            
            <div style="background-color: #0D0D0D; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #999; margin-top: 40px;">
              <p style="margin-bottom: 5px;">© ${new Date().getFullYear()} Shockwave Capital. All rights reserved.</p>
              <p style="margin: 0;">This is an automated email, please do not reply.</p>
            </div>
          </div>
        `;
        adminSubject = `Funded Account Terminated: ${email} - ${breachType}`;
        adminHtml = `<p>Funded account terminated for ${email}. Breach type: ${breachType}, Max DD: ${maxDrawdown?.toFixed(2)}%, Daily DD: ${dailyDrawdown?.toFixed(2)}%</p>`;
        break;

      case 'funded-drawdown-warning':
        const fundedWarningSubject = warningType === 'approaching-max' 
          ? 'Warning: Approaching Maximum Drawdown Limit'
          : 'Warning: Approaching Risk Limit Violation';
        
        const fundedWarningDetails = warningType === 'approaching-max'
          ? `Your current drawdown is ${currentDrawdown?.toFixed(2)}%, approaching the 15% maximum limit.`
          : `Your current risk exposure is approaching the 2% limit. Remember, if your daily drawdown exceeds 2%, it means you're risking more than allowed.`;
        
        subject = fundedWarningSubject;
        customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="background-color: #0D0D0D; padding: 20px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
              <h1 style="color: #FFA500; margin: 0; font-size: 24px;">Risk Warning</h1>
            </div>
            
            <div style="margin-bottom: 30px;">
              <p>Hello ${name},</p>
              <p>This is an important risk management alert for your funded account ($${accountSize?.toLocaleString()}).</p>
            </div>
            
            <div style="margin-bottom: 30px; background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
              <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Warning Details</h2>
              <p style="margin: 0; color: #666;">${fundedWarningDetails}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px;">Immediate Action Required</h2>
              <ul style="color: #666; line-height: 1.8;">
                <li>Review and close any high-risk positions</li>
                <li>Reduce your position sizes immediately</li>
                <li>Consider hedging your current exposure</li>
                <li>Take a break from trading if necessary</li>
              </ul>
            </div>
            
            <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
              <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">Funded Account Rules</h3>
              <ul style="color: #666; line-height: 1.6; margin: 0;">
                <li>Maximum Drawdown: 15%</li>
                <li>Daily Drawdown: 8% maximum</li>
                <li>Risk Limit: 2% maximum on open positions</li>
                <li>Violation: Daily drawdown exceeding 2% (indicates risking more than 2%)</li>
              </ul>
            </div>
            
            <div style="margin-top: 40px;">
              <p>Stay disciplined and protect your funded account.</p>
              <p style="margin-bottom: 0;">Best regards,</p>
              <p style="margin-top: 5px;"><strong>The Shockwave Capital Team</strong></p>
            </div>
            
            <div style="background-color: #0D0D0D; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #999; margin-top: 40px;">
              <p style="margin-bottom: 5px;">© ${new Date().getFullYear()} Shockwave Capital. All rights reserved.</p>
              <p style="margin: 0;">This is an automated risk management notification.</p>
            </div>
          </div>
        `;
        adminSubject = `Funded Account Warning: ${email} - ${warningType}`;
        adminHtml = `<p>Funded account warning sent to ${email}. Warning type: ${warningType}, Current drawdown: ${currentDrawdown?.toFixed(2)}%</p>`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    // Send customer email
    const customerResult = await resend.emails.send({
      from: 'support@shockwave-capital.com',
      to: email,
      subject,
      html: customerHtml
    });

    // Send admin notification
    const adminResult = await resend.emails.send({
      from: 'support@shockwave-capital.com',
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml
    });

    return NextResponse.json({ 
      success: true, 
      customerEmailId: customerResult.data?.id,
      adminEmailId: adminResult.data?.id
    });
  } catch (error) {
    console.error('Error sending challenge emails:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
} 