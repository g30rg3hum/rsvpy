import nodemailer from "nodemailer";

// custom email design
export default async function sendVerificationRequest(params) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);

  const transporter = nodemailer.createTransport(provider.server);

  const result = await transporter.sendMail({
    to: identifier,
    from: provider.from,
    subject: "Login link for rsvpy",
    text: text({ url, host }),
    html: html({ url, host, theme }),
  });

  // NOTE: skipped concatenation of pending, not sure why doesn't exist.
  const failed = result.rejected.filter(Boolean);

  if (failed.length) {
    throw new Error("Email could not be sent.");
  }
}

function html(params) {
  const { url } = params;

  const primaryColour = "#2CCEE7";

  return `
    <html>
      <head>
        <meta charset="utf-8">
      </head>

      <body>
        <table width="100%" border="0" cellspacing="20" cellpadding="0">
          <tr>
            <td align="center">
              <img src="https://rsvpy.s3.eu-north-1.amazonaws.com/logo_black.png" alt="rsvpy logo" width="300" />
            </td>
          </tr>
          <tr>
            <td align="center">
              <p>You've recently signed up or requested to sign into <b>rsvpy</b>. Click on the following link to log in and manage your events.</p>
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 5px;" bgcolor="${primaryColour}">
                    <a href="${url}" target="_blank" style="font-size: 13px; font-family: Helvetica, Arial, sans-serif; text-decoration: none; border-radius: 5px; padding: 10px 30px; display: inline-block; font-weight: bold; color: black">Login</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function text({ url }) {
  return `Sign into rsvpy\n${url}\n\n`;
}
