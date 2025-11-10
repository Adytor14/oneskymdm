import { useState } from "react";
import { User, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  entityId: string;
  entityType: "HCP" | "HCO";
  onPhotoUpdate?: (photoUrl: string | null) => void;
}

export const ProfilePhotoUpload = ({
  currentPhotoUrl,
  entityId,
  entityType,
  onPhotoUpdate,
}: ProfilePhotoUploadProps) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(currentPhotoUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to upload photos");
        return;
      }

      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${entityType}-${entityId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-photos").getPublicUrl(uploadData.path);

      setPhotoUrl(publicUrl);
      onPhotoUpdate?.(publicUrl);
      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!photoUrl) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to remove photos");
        return;
      }

      // Extract file path from URL
      const urlParts = photoUrl.split("/profile-photos/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];

        const { error } = await supabase.storage.from("profile-photos").remove([filePath]);

        if (error) throw error;
      }

      setPhotoUrl(null);
      onPhotoUpdate?.(null);
      toast.success("Profile photo removed");
    } catch (error) {
      console.error("Error removing photo:", error);
      toast.error("Failed to remove photo");
    }
  };

  return (
    <div className="relative group">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="h-10 w-10 text-primary" />
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <label htmlFor="photo-upload" className="cursor-pointer">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:text-white"
              disabled={isUploading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4" />
              </span>
            </Button>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />

          {photoUrl && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:text-white"
              onClick={handleRemovePhoto}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
          <div className="text-white text-xs">Uploading...</div>
        </div>
      )}
    </div>
  );
};
