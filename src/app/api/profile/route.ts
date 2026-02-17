import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      fullName,
      email,
      avatar,
      bio,
      skills,
      github,
      linkedin,
      location,
      website,
    } = body;

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id,
        full_name: fullName,
        email,
        avatar_url: avatar,
        bio,
        skills,
        github_url: github,
        linkedin_url: linkedin,
        location,
        website,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("id");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
