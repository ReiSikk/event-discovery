import React from 'react';

function GoogleSignInButton() {
  return (
    <>
   <div id="g_id_onload"
     data-client_id="266223769834-v2mqkr1l8igtr5934bnu0lvclmosfl6f.apps.googleusercontent.com"
     data-context="signup"
     data-ux_mode="redirect"
     data-login_uri="https://hdhpocotckesuowltwtk.supabase.co/auth/v1/callback"
     data-callback="handleSignInWithGoogle"
     data-auto_prompt="false">
</div>

<div class="g_id_signin googleBtn"
     data-type="standard"
     data-shape="pill"
     data-theme="outline"
     data-text="continue_with"
     data-size="large"
     data-logo_alignment="left">
</div>
    </>
  );
}

export default GoogleSignInButton;