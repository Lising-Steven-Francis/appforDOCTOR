export function html(params: {
  url: string;
  host: string;
  otp: string;
  theme?: { brandColor?: string; buttonText?: string };
}) {
  const { url, host, otp, theme } = params;
  const escapedHost = host.replace(/\./g, "&#8203;.");
  const brandColor = theme?.brandColor || "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme?.buttonText || "#fff",
  };

  return `
  <body style="background: ${color.background};">
    <table width="100%" border="0" cellspacing="10" cellpadding="0"
      style="background: ${color.mainBackground}; max-width: 550px; margin: auto; border-radius: 20px;
             box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">

      <tr>
        <td align="center" style="background-color: #bf0505;border-top-left-radius: 10px;
border-top-right-radius: 10px;">
          <img src="${process.env.EMAIL_BANNER_LOGO}" alt="${process.env.EMAIL_BANNER_LOGO_ALT}"
            style="background-color: #ffffff!important; max-width: 100%; height: auto; display: block; margin: 20px auto;">
        </td>
      </tr>

      <tr>
        <td align="center"
          style="padding: 50px 20px; font-size: 1.375rem; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          Sign in to <strong>${escapedHost}</strong>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding: 20px;">
          <p style="font-size: 1rem; color: ${color.text}; font-family: Helvetica, Arial, sans-serif;">
            You recently requested to sign in to your account. Click the button below to continue:
          </p>
          <a href="${url}" target="_blank"
            style="font-size: 1.125rem; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none;
                   border-radius: 5px; padding: 10px 25px; border: 1px solid ${color.buttonBorder}; background-color: ${color.buttonBackground};
                   display: inline-block; font-weight: bold;">
            Sign in
          </a>
          <p style="margin: 40px; font-size: 0.875rem; color: #555; font-family: Helvetica, Arial, sans-serif;">
            Or use this One-Time Password (OTP):
          </p>
          <h2>
            <strong style="font-size: 1.25rem; letter-spacing: 0.3rem; border: 1px solid #555; padding: 5px;">
              ${otp}
            </strong>
          </h2>
        </td>
      </tr>

      <tr style="background-color: ${color.buttonBackground};">
        <td align="center"
          style="padding: 20px; font-size: 0.875rem; font-family: Helvetica, Arial, sans-serif; color: #fff;border-bottom-left-radius: 10px;
border-bottom-right-radius: 10px;">
          If you did not request this email, no further action is required. You can safely ignore this message.
          <br><br>
          For security, this link and OTP will expire in ${process.env.EMAIL_TOKEN_EXPIRES_MINUTES} minutes.
        </td>
      </tr>

    </table>
  </body>
  `;
}

export function text({ url, host, otp }: { url: string; host: string; otp: string }) {
  return `Sign in to ${host}\n${url}\n\nOTP: ${otp}\nIf you did not request this, you can safely ignore it.`;
}
