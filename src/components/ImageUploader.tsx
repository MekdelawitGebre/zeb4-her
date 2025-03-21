
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { File, Loader2 } from "lucide-react";
import { handleImageSelection } from '@/utils/imageUpload';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  buttonText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded, 
  buttonText = "Upload Image" 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    
    try {
      handleImageSelection(e, (url) => {
        onImageUploaded(url);
        // toast({
        //   title: "Image Uploaded",
        //   description: "Your image has been uploaded successfully",
        // });
        setIsUploading(false);
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your image",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <File className="mr-2 h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>
    </div>
  );
};

export default ImageUploader;
