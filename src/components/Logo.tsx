import React from "react";
import Image from "next/image";
import iconImage from "../../public/icon.png";

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
          src={iconImage} 
          alt="Nex Logo"
          width={size}
          height={size}
          className="object-contain drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]"
          priority
        />
      </div>
      
      {showText && (
        <span className="font-black tracking-tighter text-2xl bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400 uppercase">
          Nex
        </span>
      )}
    </div>
  );
};

export default Logo;

