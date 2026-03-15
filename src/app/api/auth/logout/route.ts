import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Removed the parameter entirely
export async function POST() { 
  const supabase = await createClient()
  
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}