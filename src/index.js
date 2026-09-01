const COOKIE_NAME = "generator_auth";

function loginPage(error = "") {
  return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generator Engineering Hub | Login</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      background:
        radial-gradient(circle at top, #17283c, #07111d 55%, #03070c);
      color: white;
    }

    .login-box {
      width: 390px;
      max-width: calc(100% - 30px);
      padding: 40px;
      border-radius: 18px;
      background: rgba(12, 25, 40, 0.96);
      border: 1px solid #263d56;
      box-shadow: 0 25px 70px rgba(0,0,0,.55);
      text-align: center;
    }

    .lock {
      font-size: 48px;
      margin-bottom: 15px;
    }

    h1 {
      margin: 0 0 8px;
      font-size: 25px;
    }

    p {
      color: #9db0c5;
      margin-bottom: 28px;
    }

    input {
      width: 100%;
      padding: 15px;
      border: 1px solid #334b64;
      border-radius: 9px;
      background: #091522;
      color: white;
      font-size: 16px;
      outline: none;
    }

    input:focus {
      border-color: #3285ff;
    }

    button {
      width: 100%;
      margin-top: 14px;
      padding: 15px;
      border: 0;
      border-radius: 9px;
      background: #2675e8;
      color: white;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }

    button:hover {
      background: #3988fb;
    }

    .error {
      color: #ff6161;
      margin: 15px 0 0;
    }

    .footer {
      margin-top: 25px;
      font-size: 12px;
      color: #61758b;
    }
  </style>
</head>

<body>

  <div class="login-box">

    <div class="lock">🔐</div>

    <h1>Generator Engineering Hub</h1>

    <p>Authorized Access Only</p>

    <form method="POST" action="/__login">

      <input
        type="password"
        name="password"
        placeholder="Enter access password"
        autocomplete="current-password"
        required
      >

      <button type="submit">
        Access Website
      </button>

    </form>

    ${error ? `<div class="error">${error}</div>` : ""}

    <div class="footer">
      Protected Engineering Knowledge Base
    </div>

  </div>

</body>
</html>
`, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-store"
    }
  });
}


export default {

  async fetch(request, env) {

    const url = new URL(request.url);

    const cookie = request.headers.get("Cookie") || "";

    const authenticated =
      cookie.includes(`${COOKIE_NAME}=yes`);


    // LOGIN REQUEST
    if (
      url.pathname === "/__login" &&
      request.method === "POST"
    ) {

      const formData = await request.formData();

      const password = formData.get("password");


      if (password === env.SITE_PASSWORD) {

        return new Response(null, {
          status: 302,

          headers: {
            "Location": "/",

            "Set-Cookie":
              `${COOKIE_NAME}=yes; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`
          }
        });

      }


      return loginPage("Incorrect password.");

    }


    // NOT AUTHENTICATED
    if (!authenticated) {

      return loginPage();

    }


    // AUTHENTICATED
    return env.ASSETS.fetch(request);

  }

};
