
import { supabase } from "@/integrations/supabase/client";

/**
 * Calls the admin-create-user edge function to create a new user.
 * @param {Object} userData
 * @param {string} userData.username
 * @param {string} userData.email
 * @param {string} userData.password
 * @param {string} userData.role
 * @returns {Promise<{success: boolean; user?: any; error?: string}>}
 */
export async function createSupabaseUser({
  username,
  email,
  password,
  role,
}: {
  username: string;
  email: string;
  password: string;
  role: string;
}): Promise<{ success: boolean; user?: any; error?: string }> {
  // Get the logged-in user's session to get their access token
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { success: false, error: "Not authenticated" };
  }

  const response = await fetch(
    "https://pqbhfgcocvcellvvqyoc.supabase.co/functions/v1/admin-create-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ username, email, password, role }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return { success: false, error: data?.error || "Failed to create user" };
  }

  return { success: true, user: data.user };
}
