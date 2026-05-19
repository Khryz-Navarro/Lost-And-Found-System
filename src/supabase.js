import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isSupabaseConfigured(url, key) {
  if (!url || !key) return false;
  if (url.includes("your_supabase") || key.includes("your_supabase")) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const isSupabaseReady = isSupabaseConfigured(supabaseUrl, supabaseKey);

export const supabase = isSupabaseReady
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const uploadImageToSupabase = async (file) => {
  if (!supabase) {
    throw new Error(
      "Image upload is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env."
    );
  }

  try {
    const fileName = `items/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("items")
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("items")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Supabase upload error:", error);
    throw error;
  }
};
