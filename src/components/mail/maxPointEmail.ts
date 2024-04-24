const maxPointEmail = function (
  maxPoint: string,
  eventSlug: string,
  eventTitle: string
) {
  const html = `
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <title>Reset your Password</title>
      <link
        href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700"
        rel="stylesheet" media="screen">
      <style>
        .hover-underline:hover {
          text-decoration: underline !important;
        }

        .logo {
          padding: 0px !important;
          margin: 10px !important;
          width: 190px;
          height: 100% !important;
          object-fit: contain;
          object-position: center;
        }


        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ping {

          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes pulse {
          50% {
            opacity: .5;
          }
        }

        @keyframes bounce {

          0%,
          100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }

          50% {
            transform: none;
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        @media (max-width: 600px) {
          .sm-px-24 {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }

          .sm-py-32 {
            padding-top: 32px !important;
            padding-bottom: 32px !important;
          }

          .sm-w-full {
            width: 100% !important;
          }
        }
      </style>
    </head>

    <body
      style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; --bg-opacity: 1; background-color: #eceff1;">
      <div style="display: none;">
        Thanks for partnering with us on ${eventTitle}! As a reminder, our volunteer point system has a pre-calculated maximum point value for each opportunity.
        This ensures fairness and recognizes the impact of various tasks. The maximum point value for each role in ${eventTitle} is
      </div>
      <div role="article" aria-roledescription="email" aria-label="Reset your Password" lang="en">
        <table style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; width: 100%;" width="100%"
          cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center"
              style="--bg-opacity: 1; background-color: #eceff1; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif;">
              <table class="sm-w-full" style="font-family: 'Montserrat',Arial,sans-serif; width: 600px;" width="600"
                cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td class="sm-py-32 sm-px-24"
                    style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; padding: 48px; text-align: center;"
                    align="center">
                    <a href=""
                        style="border: 0; max-width: 100%; line-height: 100%; vertical-align: middle;">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" class="sm-px-24" style="font-family: 'Montserrat',Arial,sans-serif;">
                    <table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%" cellpadding="0"
                      cellspacing="0" role="presentation">
                      <tr>
                        <td class="sm-px-24"
                          style="--bg-opacity: 1; background-color: #ffffff;  border-radius: 4px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 14px; line-height: 24px; padding: 48px; text-align: left; --text-opacity: 1; color: #626262;"
                           align="left">
                          <center>
                            <img src='https://eejii.vercel.app/images/home/foundation_logo.jpg' alt='logo' style="width: 170px !important;" class="logo"/>
                          </center>
                          <p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hey there,</p>

                          <p style="margin: 0 0 24px;">
                            Thanks for partnering with us on <strong>${eventTitle}!</strong> As a reminder, our volunteer point system has a pre-calculated maximum point value for each opportunity.
                            This ensures fairness and recognizes the impact of various tasks. The maximum point value for each role in <strong>${eventTitle}</strong> is
                          </p>

                          <p style="display: block; font-weight: 600; font-size: 32px; line-height: 100%; margin-bottom: 24px; --text-opacity: 1; color: #000000; text-decoration: none;">${maxPoint}</p>
                          <p style="margin-top: 24px">
                            When assigning points to volunteers after the event, please keep this maximum in mind. <a href="http://localhost:3000/p/events/${eventSlug}" target="_blank">Go to event</a>.
                          </p>
                          <table style="font-family: 'Montserrat',Arial,sans-serif;" cellpadding="0" cellspacing="0"
                            role="presentation">
                            <tr>
                              <td
                                style="mso-padding-alt: 16px 24px; --bg-opacity: 1; background-color: #7367f0;  border-radius: 4px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif;">

                              </td>
                            </tr>
                          </table>

                          <table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%"
                            cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td
                                style="font-family: 'Montserrat',Arial,sans-serif; padding-top: 32px; padding-bottom: 32px;">
                                <div
                                  style="--bg-opacity: 1; background-color: #eceff1; height: 1px; line-height: 1px;">
                                  &zwnj;</div>
                              </td>
                            </tr>
                          </table>
                          <p style="margin: 0 0 16px;">
                            Needing some additional support? Please contact us at
                            <a href="mailto:infoeejii@gmail.mn" class="hover-underline"
                              style="--text-opacity: 1; color: #7367f0;  text-decoration: none;">infoeejii@gmail.mn</a>.
                          </p>
                          <p style="margin: 0 0 16px;">Thanks, <br>The Eejii.org Support Team</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family: 'Montserrat',Arial,sans-serif; height: 20px;" height="20"></td>
                      </tr>
                      <tr>
                        <td style="font-family: 'Montserrat',Arial,sans-serif; height: 16px;" height="16"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </body>

    </html>`;
  const text = `Eejii.org, A max point to assign to your volunteers for ${eventTitle} Volunteering Event was calculated.`;
  return {
    html: html,
    text: text,
  };
};

export default maxPointEmail;
