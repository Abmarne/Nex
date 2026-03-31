import React from "react";

export function BackgroundGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vh] rounded-full bg-primary/10 blur-[150px]" />
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[70vh] rounded-full bg-secondary/10 blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vh] rounded-full bg-primary/5 blur-[150px]" />
    </div>
  );
}
