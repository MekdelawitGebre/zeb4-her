
// Mock image upload functionality
// In a real application, this would communicate with a backend or storage service
export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate upload delay
    setTimeout(() => {
      // Create a local URL for the uploaded file
      const objectUrl = URL.createObjectURL(file);
      console.log("Image uploaded:", file.name);
      resolve(objectUrl);
    }, 1500);
  });
};

// Helper function to handle file input change
export const handleImageSelection = (
  event: React.ChangeEvent<HTMLInputElement>,
  callback: (url: string) => void
) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  
  const file = files[0];
  if (!file.type.startsWith('image/')) {
    console.error('File is not an image');
    return;
  }
  
  uploadImage(file).then(callback);
};
