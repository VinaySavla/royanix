/**
 * Utility functions for image compression and validation
 */

export const compressImage = (file, maxSizeKB = 250, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions to maintain aspect ratio
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 600;
      
      let { width, height } = img;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // For PNG files with transparency, preserve transparency
      const isPNG = file.type === 'image/png';
      let format = isPNG ? 'image/png' : 'image/jpeg';
      
      if (isPNG) {
        // Clear canvas with transparent background for PNG
        ctx.clearRect(0, 0, width, height);
      } else {
        // Fill with white background for JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      
      // Draw image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Try different quality levels until we get under maxSizeKB
      let currentQuality = quality;
      let compressedDataUrl;
      
      if (isPNG) {
        // PNG doesn't support quality parameter, try reducing dimensions instead
        compressedDataUrl = canvas.toDataURL('image/png');
        
        // If PNG is too large, try converting to JPEG with white background
        if (getBase64SizeKB(compressedDataUrl) > maxSizeKB) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
          format = 'image/jpeg';
          
          while (getBase64SizeKB(compressedDataUrl) > maxSizeKB && currentQuality > 0.1) {
            currentQuality -= 0.1;
            compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
          }
        }
      } else {
        compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
        
        while (getBase64SizeKB(compressedDataUrl) > maxSizeKB && currentQuality > 0.1) {
          currentQuality -= 0.1;
          compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
        }
      }
      
      if (getBase64SizeKB(compressedDataUrl) > maxSizeKB) {
        reject(new Error(`Unable to compress image below ${maxSizeKB}KB`));
      } else {
        resolve(compressedDataUrl);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    
    // Convert file to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const getBase64SizeKB = (base64String) => {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
  
  // Calculate size in bytes, then convert to KB
  const sizeInBytes = (base64Data.length * 3) / 4;
  return sizeInBytes / 1024;
};

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please use JPEG, PNG, or WebP images.');
  }
  
  // Check original file size (10MB limit before compression)
  const maxOriginalSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxOriginalSize) {
    throw new Error('Original file size too large. Please use an image smaller than 10MB.');
  }
  
  return true;
};

/**
 * Compress multiple images and return as an object
 */
export const compressMultipleImages = async (files, maxSizeKB = 250, quality = 0.8) => {
  const results = {};
  
  if (files.primary) {
    validateImageFile(files.primary);
    results.image = await compressImage(files.primary, maxSizeKB, quality);
  }
  
  if (files.secondary) {
    validateImageFile(files.secondary);
    results.secondaryImage = await compressImage(files.secondary, maxSizeKB, quality);
  }
  
  return results;
};

/**
 * Check if image has transparency (for PNG files)
 */
export const hasTransparency = (imageDataUrl) => {
  return imageDataUrl.startsWith('data:image/png');
};
