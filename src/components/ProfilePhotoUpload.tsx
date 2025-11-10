import { useState } from "react";
import { Camera, User, Upload, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProfilePhotoUploadProps {
  entityId: string;
  entityType?: "HCP" | "HCO";
  currentPhotoUrl?: string;
  onPhotoUpdate: (url: string | null) => void;
  size?: "sm" | "md" | "lg";
}

export function ProfilePhotoUpload({
  entityId,
  entityType = "HCP",
  currentPhotoUrl,
  onPhotoUpdate,
  size = "lg"
}: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20"
  };

  const iconSizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };

  const IconComponent = entityType === "HCP" ? User : Building2;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload photos",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${entityId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      setPreviewUrl(publicUrl);
      onPhotoUpdate(publicUrl);
      setIsDialogOpen(false);

      toast({
        title: "Success",
        description: "Profile photo uploaded successfully",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (currentPhotoUrl) {
        // Extract file path from URL
        const urlParts = currentPhotoUrl.split('/profile-photos/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage
            .from('profile-photos')
            .remove([filePath]);
        }
      }

      setPreviewUrl(null);
      onPhotoUpdate(null);
      setIsDialogOpen(false);

      toast({
        title: "Success",
        description: "Profile photo removed",
      });
    } catch (error: any) {
      console.error('Remove error:', error);
      toast({
        title: "Failed to remove photo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <div className={`${sizeClasses[size]} rounded-full bg-primary/10 flex items-center justify-center overflow-hidden`}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <IconComponent className={`${iconSizeClasses[size]} text-primary`} />
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="h-5 w-5 text-white" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile Photo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <IconComponent className="h-16 w-16 text-primary" />
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <label className="flex-1">
              <Button
                variant="outline"
                className="w-full"
                disabled={uploading}
                asChild
              >
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Photo"}
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>
            
            {previewUrl && (
              <Button
                variant="destructive"
                onClick={handleRemovePhoto}
                disabled={uploading}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Recommended: Square image, max 5MB
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
