import React from 'react';

function GoogleSignInButton() {
  return (
    <>
      <div id="g_id_onload"
     data-client_id="266223769834-v2mqkr1l8igtr5934bnu0lvclmosfl6f.apps.googleusercontent.com"
     data-context="signin"
     data-ux_mode="redirect"
     data-login_uri="https://hdhpocotckesuowltwtk.supabase.co/auth/v1/callback"
     data-callback="handleSignInWithGoogle"
     data-auto_prompt="false"
     data-use_fedcm_for_prompt="true"
     >
    </div>

<div class="g_id_signin"
     data-type="standard"
     data-shape="pill"
     data-theme="outline"
     data-text="signin_with"
     data-size="large"
     data-logo_alignment="left">
</div>

    </>
  );
}

export default GoogleSignInButton;