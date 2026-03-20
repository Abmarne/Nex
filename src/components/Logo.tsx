import React from "react";
import Image from "next/image";
import logoImage from "../../public/logo.png";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 32, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className="relative flex items-center justify-center overflow-hidden" 
        style={{ width: size, height: size, minWidth: size }}
      >
        <Image 
          src={logoImage} 
          alt="QueueEase Logo"
          width={size}
          height={size}
          className="object-cover shadow-sm rounded-xl"
          priority
        />
      </div>
      
      {showText && (
        <span className="font-black tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
          QueueEase
        </span>
      )}
    </div>
  );
};

export default Logo;
