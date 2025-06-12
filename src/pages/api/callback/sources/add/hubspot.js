export default async function handler(req, res) {
  const { code, state, error } = req.query;

  if (error) {
    // OAuth error, redirect with error
    const errorParams = new URLSearchParams({ error }).toString();
    return res.redirect(`/error?${errorParams}`);
  }

  try {
    // Parse the state parameter
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const { workspaceSlug, sourceName } = stateData;

    // Here you would typically:
    // 1. Exchange the code for access tokens using HubSpot's API
    // 2. Store the tokens securely
    // 3. Create initial connection record in your database
    
    // For now, we'll redirect to the app router page with the auth code
    // The app router page will handle the rest of the flow
    const redirectUrl = new URL(`/${workspaceSlug}/sources/add/hubspot`, process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`);
    redirectUrl.searchParams.set('code', code);
    redirectUrl.searchParams.set('state', state);

    return res.redirect(redirectUrl.toString());
  } catch (err) {
    console.error('OAuth callback error:', err);
    return res.redirect('/error?error=invalid_state');
  }
}