import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        error:
          'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).',
      },
      { status: 500 }
    )
  }

  // 1. Create an initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Create the Supabase client
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
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
  const currentPath = request.nextUrl.pathname;
  const isAuthRoute = currentPath.startsWith('/auth');
  const isHomePage = currentPath === '/';

  // 5. Protection Logic
  
  if (!user) {
    // If NO user exists, and they are trying to access a route that ISN'T 
    // the home page and ISN'T an auth page -> Redirect to Login
    if (!isHomePage && !isAuthRoute) {
      const loginUrl = new URL('/auth/login', request.url)
      // Optional: Add a redirect param to send them back where they came from
      loginUrl.searchParams.set('redirectedFrom', currentPath)
      return NextResponse.redirect(loginUrl)
    }
  } else {
    // If USER exists and trying to access Login/Register -> Redirect to Dashboard
    if (isAuthRoute) {
       return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // Notice we do NOT redirect if they visit the home page (/). 
    // They are free to view it while logged in.
  }

  return response
}

export const config = {
  // Matcher ignoring static files
  matcher: ['/((?!_next/static|_next/data|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}