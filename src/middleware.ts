import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Create an initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Create the Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // This updates the cookie on the request object
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          // This updates the cookie on the response object
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 3. Refresh the session if needed
  const { data: { user } } = await supabase.auth.getUser()

  // 4. Define paths
  // Add '/auth' to catch all auth related routes (login, register, callback)
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isPublicRoute = ['/auth/login', '/auth/register', '/auth/callback'].some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // 5. Protection Logic
  
  // If NO user and trying to access a protected route -> Redirect to Login
  if (!user && !isAuthRoute) {
    const loginUrl = new URL('/auth/login', request.url)
    // Optional: Add a redirect param to send them back where they came from
    loginUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If USER exists and trying to access Login/Register -> Redirect to Home
  if (user && isAuthRoute) {
     return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  // Matcher ignoring static files
  matcher: ['/((?!_next/static|_next/data|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}