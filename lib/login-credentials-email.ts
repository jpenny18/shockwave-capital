export function buildLoginCredentialsTemplate() {
  return {
    name: 'Login Credentials',
    subject: 'Challenge Login Details - Shockwave Capital',
    variables: ['firstName', 'platform', 'loginId', 'password', 'server'],
    body: `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Challenge Login Details - Shockwave Capital</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0;">
    <tr>
      <td bgcolor="#0FF1CE" align="center" style="padding: 30px 20px;">
        <h1 style="color: #0D0D0D; margin: 0; font-size: 28px;">Shockwave Capital</h1>
      </td>
    </tr>
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 20px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td bgcolor="#ffffff" style="padding: 40px; border-radius: 8px;">
              <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 0 0 20px 0;">Your Trading Challenge Details</h1>
              <p style="margin: 0 0 20px 0; color: #444;">Hello {{firstName}},</p>
              <p style="margin: 0 0 25px 0; color: #444;">Welcome to Shockwave Capital! Your trading challenge account has been successfully set up. Below are your login credentials and setup instructions.</p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td colspan="2" style="background: #0FF1CE; color: #1a1a1a; font-size: 18px; font-weight: 700; text-align: center; padding: 20px; border-radius: 8px 8px 0 0;">
                    Your Trading Account Credentials
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#fafafa" style="width: 35%; color: #1a1a1a; font-weight: 600; font-size: 14px; padding: 15px; border: 1px solid #E5E5E5;">Platform:</td>
                  <td style="color: #1a1a1a; font-weight: 600; font-family: monospace; font-size: 14px; background: rgba(15, 241, 206, 0.1); padding: 15px; border: 1px solid #E5E5E5;">{{platform}}</td>
                </tr>
                <tr>
                  <td bgcolor="#fafafa" style="width: 35%; color: #1a1a1a; font-weight: 600; font-size: 14px; padding: 15px; border: 1px solid #E5E5E5;">Login ID:</td>
                  <td style="color: #1a1a1a; font-weight: 600; font-family: monospace; font-size: 14px; background: rgba(15, 241, 206, 0.1); padding: 15px; border: 1px solid #E5E5E5;">{{loginId}}</td>
                </tr>
                <tr>
                  <td bgcolor="#fafafa" style="width: 35%; color: #1a1a1a; font-weight: 600; font-size: 14px; padding: 15px; border: 1px solid #E5E5E5;">Password:</td>
                  <td style="color: #1a1a1a; font-weight: 600; font-family: monospace; font-size: 14px; background: rgba(15, 241, 206, 0.1); padding: 15px; border: 1px solid #E5E5E5;">{{password}}</td>
                </tr>
                <tr>
                  <td bgcolor="#fafafa" style="width: 35%; color: #1a1a1a; font-weight: 600; font-size: 14px; padding: 15px; border: 1px solid #E5E5E5;">Server:</td>
                  <td style="color: #1a1a1a; font-weight: 600; font-family: monospace; font-size: 14px; background: rgba(15, 241, 206, 0.1); padding: 15px; border: 1px solid #E5E5E5;">{{server}}</td>
                </tr>
              </table>
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://shockwave-capital.com/dashboard/accounts" style="display: inline-block; background-color: #1a1a1a; color: #0FF1CE; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">OPEN MY ACCOUNTS</a>
              </div>
              <h3 style="color: #444; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">Getting Started</h3>
              <ol style="margin: 0; padding-left: 20px; color: #444;">
                <li style="margin-bottom: 12px;">Download and install the {{platform}} trading platform</li>
                <li style="margin-bottom: 12px;">Use the credentials above to log in</li>
                <li style="margin-bottom: 12px;">You can also copy these credentials from your My Accounts page</li>
                <li style="margin-bottom: 12px;">Review the challenge rules thoroughly</li>
                <li style="margin-bottom: 12px;">Start trading with your defined strategy</li>
              </ol>
              <p style="margin-top: 40px; margin-bottom: 0;">Best regards,</p>
              <p style="margin-top: 5px;"><strong>The Shockwave Capital Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function platformLabel(platform: string | undefined) {
  const value = (platform || '').toLowerCase();
  if (value.includes('4')) return 'MetaTrader 4';
  return 'MetaTrader 5';
}
