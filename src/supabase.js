import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Add Supabase storage upload function
export const uploadImageToSupabase = async (file) => {
  try {
    const fileName = `items/${Date.now()}_${file.name}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from("items")
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("items")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Supabase upload error:", error);
    throw error;
  }
};
