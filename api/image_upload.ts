import { supabaseAnonKey, supabaseUrl } from "@/config/config";
import { createClient } from "@supabase/supabase-js";
import { File } from "expo-file-system";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadFileToSupabase(
  file: any,
  bucket: string,
  path: string,
) {
  try {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    // Get mime type from file object
    const mimeType =
      file.mimeType ||
      file.type ||
      `image/${file.name?.split(".").pop()?.toLowerCase()}`;

    if (!allowedTypes.includes(mimeType)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, and JPG are allowed.",
      );
    }

    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    const fileSize = file.size || file.fileSize || 0;

    if (fileSize > maxSize) {
      throw new Error("File size exceeds the 5MB limit.");
    }

    // Read file using the new File class from expo-file-system
    let fileData;

    if (file.uri) {
      // Create a File instance from the URI
      const fileInstance = new File(file.uri);

      // Read as bytes (Uint8Array) - most efficient for Supabase
      fileData = await fileInstance.bytes();
    } else {
      // If it's already a File object (web), use it directly
      fileData = file;
    }

    // Upload file to Supabase
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, fileData, {
        upsert: true,
        contentType: mimeType,
      });

    if (uploadError) {
      throw new Error("Failed to upload image: " + uploadError.message);
    }

    // Get public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
