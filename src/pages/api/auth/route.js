import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}/`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}/`)
      } else {
        return NextResponse.redirect(`${origin}/`)
      }
    }
  }
  
  // Return to error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
