import React, { useState, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageUploadProps {
  onImageCapture: (imageData: string, imageFile: File) => void;
  isLoading?: boolean;
  onBack?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageCapture, isLoading, onBack }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      onImageCapture(base64Data, file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {onBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="mb-8 flex items-center text-gray-600 hover:text-purple-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </motion.button>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
          dragActive
            ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
            : 'border-gray-300 bg-gradient-to-br from-white to-gray-50 hover:border-orange-400 hover:bg-orange-25 hover:shadow-xl'
        } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-4 left-4 w-6 h-6 bg-orange-300 rounded-full"
          />
          <motion.div
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-4 right-4 w-4 h-4 bg-pink-300 rounded-full"
          />
        </div>
        
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: dragActive ? 1.2 : isHovering ? 1.1 : 1,
              rotate: dragActive ? 10 : 0
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ImageIcon className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
          
          <motion.h3 
            animate={{ y: dragActive ? -5 : 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-3"
          >
            Upload Your Pet's Photo
          </motion.h3>
          <p className="text-gray-600 mb-8 text-lg">
            Take a new photo or choose from your gallery
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              disabled={isLoading}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Camera className="w-5 h-5 mr-3" />
              </motion.div>
              Take Photo
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              disabled={isLoading}
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Upload className="w-5 h-5 mr-3" />
              </motion.div>
              Upload File
            </motion.button>
          </div>
          
          {dragActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-orange-600 font-semibold"
            >
              Drop your photo here! 📸
            </motion.div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInput}
          className="hidden"
        />
      </motion.div>
    </div>
  );
};

export default ImageUpload;