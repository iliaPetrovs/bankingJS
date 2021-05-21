// The Auth0 client, initialized in configureClient()
let auth0 = null;

/**
 * Starts the authentication flow
 */
const login = async (targetUrl) => {
  try {
    console.log("Logging in", targetUrl);

    const options = {
      redirect_uri: window.location.origin
    };

    if (targetUrl) {
      options.appState = { targetUrl };
    }

    await auth0.loginWithRedirect(options);
  } catch (err) {
    console.log("Log in failed", err);
  }
};

const banking = async () => {
  try {
    const accessToken = await auth0.getTokenSilently();
    console.log(accessToken);
    console.log(auth0.getUser());
    var ul = document.getElementById("appendThis");
    var div = document.createElement("div");
    const response = fetch("http://localhost:8080/banking/", {
      method: "GET",
      crossDomain: true,
      headers: {
        Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9BeUh4NDdmaHgzS3VMM0Jzc2NNdyJ9.eyJpc3MiOiJodHRwczovL2lsaWFwZXRyb3ZzLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiIwOUNqYWFVandBTWdkV3diSGdzek4zWmV5OUwzRjR6cUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9iYW5raW5nIiwiaWF0IjoxNjIxNjAyNzI1LCJleHAiOjE2MjE2ODkxMjUsImF6cCI6IjA5Q2phYVVqd0FNZ2RXd2JIZ3N6TjNaZXk5TDNGNHpxIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.a6o1qpeT_qjIl6DFDpMDqeuL2rPrVRN3Njg7FIfT4DbFIp0Ehy4hMkJA6eigJytpbQs8McXmM55Epmj_QF6az9R8OicYAd71A4Ju3ODCFEm8-EVnepXxhVbnvHedFHnfxpYamyMxUlXd1--e-mrGJM-aIYGLKp442gf8RLVT29Nai3ZVeu9Na4hG06MYloOdb8DnJPCNmZKbNzkvlUgA1mAqM1bAUtuGH1NiXNuHZ7_zzxW6HaXeiOtB-TeZ-aeTqdQ9bRFrckMf0DayOQKxepuR6Sd8mtEH87kCefSF78BHcVdFJJ9cxuFtVur1za0tPo0n8AqVkDWiO6SjeqtWVA`,
      },
    })
      .then((response) => response.clone().json())
      .then((data) => {
        console.log(data);
        div.innerHTML = JSON.stringify(data);
        ul.appendChild(div);
      });
  } catch (exception) {
    return exception;
  }
};

const moneySend = (e) => {
  e.preventDefault();
}

const viewBalance = async () => {
  const accessToken = await auth0.getTokenSilently();
  console.log(accessToken);
  var ul = document.getElementById("view-balance");
  var div = document.createElement("div");
  const response = fetch("http://localhost:8080/banking/", {
    method: "GET",
    crossDomain: true,
    headers: {
      Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9BeUh4NDdmaHgzS3VMM0Jzc2NNdyJ9.eyJpc3MiOiJodHRwczovL2lsaWFwZXRyb3ZzLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiIwOUNqYWFVandBTWdkV3diSGdzek4zWmV5OUwzRjR6cUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9iYW5raW5nIiwiaWF0IjoxNjIxNjAyNzI1LCJleHAiOjE2MjE2ODkxMjUsImF6cCI6IjA5Q2phYVVqd0FNZ2RXd2JIZ3N6TjNaZXk5TDNGNHpxIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.a6o1qpeT_qjIl6DFDpMDqeuL2rPrVRN3Njg7FIfT4DbFIp0Ehy4hMkJA6eigJytpbQs8McXmM55Epmj_QF6az9R8OicYAd71A4Ju3ODCFEm8-EVnepXxhVbnvHedFHnfxpYamyMxUlXd1--e-mrGJM-aIYGLKp442gf8RLVT29Nai3ZVeu9Na4hG06MYloOdb8DnJPCNmZKbNzkvlUgA1mAqM1bAUtuGH1NiXNuHZ7_zzxW6HaXeiOtB-TeZ-aeTqdQ9bRFrckMf0DayOQKxepuR6Sd8mtEH87kCefSF78BHcVdFJJ9cxuFtVur1za0tPo0n8AqVkDWiO6SjeqtWVA`,
    },
  }).then((response) => response.clone().json())
  .then((data) => {
    console.log(data);
    div.innerHTML = JSON.stringify(data);
    ul.appendChild(div);
  })
  // div.innerHTML = "This is a balance";
  // ul.appendChild(div);
}

/**
 * Executes the logout flow
 */
const logout = () => {
  try {
    console.log("Logging out");
    auth0.logout({
      returnTo: window.location.origin
    });
  } catch (err) {
    console.log("Log out failed", err);
  }
};

/**
 * Retrieves the auth configuration from the server
 */
const fetchAuthConfig = () => fetch("/auth_config.json");

/**
 * Initializes the Auth0 client
 */
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    audience: config.audience 
  });
};

/**
 * Checks to see if the user is authenticated. If so, `fn` is executed. Otherwise, the user
 * is prompted to log in
 * @param {*} fn The function to execute if the user is logged in
 */
const requireAuth = async (fn, targetUrl) => {
  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    return fn();
  }

  return login(targetUrl);
};

// Will run when page finishes loading
window.onload = async () => {
  await configureClient();

  // If unable to parse the history hash, default to the root URL
  if (!showContentFromUrl(window.location.pathname)) {
    showContentFromUrl("/");
    window.history.replaceState({ url: "/" }, {}, "/");
  }

  const bodyElement = document.getElementsByTagName("body")[0];

  // Listen out for clicks on any hyperlink that navigates to a #/ URL
  bodyElement.addEventListener("click", (e) => {
    if (isRouteLink(e.target)) {
      const url = e.target.getAttribute("href");

      if (showContentFromUrl(url)) {
        e.preventDefault();
        window.history.pushState({ url }, {}, url);
      }
    }
  });

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    console.log("> User is authenticated");
    window.history.replaceState({}, document.title, window.location.pathname);
    updateUI();
    return;
  }

  console.log("> User not authenticated");

  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");

  if (shouldParseResult) {
    console.log("> Parsing redirect");
    try {
      const result = await auth0.handleRedirectCallback();

      if (result.appState && result.appState.targetUrl) {
        showContentFromUrl(result.appState.targetUrl);
      }

      console.log("Logged in!");
    } catch (err) {
      console.log("Error parsing redirect:", err);
    }

    window.history.replaceState({}, document.title, "/");
  }

  updateUI();
};
