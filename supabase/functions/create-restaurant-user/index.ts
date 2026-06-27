declare const Deno: any;

// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();

    console.log("BODY:", body);

    const {
      email,
      password,
      full_name,
      phone,
      restaurant_id,
      role_id,
    } = body;

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const serviceRoleKey =
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      );

    if (!supabaseUrl) {
      return new Response(
        JSON.stringify({
          source: "env",
          error: "SUPABASE_URL missing",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    if (!serviceRoleKey) {
      return new Response(
        JSON.stringify({
          source: "env",
          error:
            "SUPABASE_SERVICE_ROLE_KEY missing",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        serviceRoleKey
      );

    const {
      data: authData,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.createUser(
        {
          email,
          password,
          email_confirm: true,
        }
      );

    if (authError) {
      return new Response(
        JSON.stringify({
          source: "auth.createUser",
          error: authError.message,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    const authUserId =
      authData.user.id;

    const {
      data: insertData,
      error: insertError,
    } = await supabaseAdmin
      .from("restaurant_users")
      .insert({
        auth_user_id:
          authUserId,
        restaurant_id,
        role_id,
        full_name,
        phone,
        email,
        active: true,
      })
      .select();

    if (insertError) {
      return new Response(
        JSON.stringify({
          source:
            "restaurant_users.insert",
          error:
            insertError.message,
          details:
            insertError.details,
          hint:
            insertError.hint,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        auth_user_id:
          authUserId,
        restaurant_user:
          insertData,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        source: "catch",
        error:
          err?.message ||
          String(err),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }
    );
  }
});