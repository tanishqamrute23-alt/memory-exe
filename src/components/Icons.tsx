import React from "react";

// Original early-2000s styled icons (drawn cleanly in SVG)

export const MyComputerIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Monitor Outer Frame */}
    <rect x="6" y="6" width="36" height="26" rx="2" fill="#D4D0C8" stroke="#808080" strokeWidth="2" />
    <rect x="9" y="9" width="30" height="20" fill="#000080" />
    {/* Screen content reflection / retro grid */}
    <path d="M12 12H36V26H12V12Z" fill="#1084D0" fillOpacity="0.8" />
    <rect x="14" y="14" width="8" height="6" fill="#00FFFF" opacity="0.6" />
    <rect x="24" y="14" width="12" height="2" fill="#FFFFFF" opacity="0.7" />
    <rect x="24" y="18" width="8" height="2" fill="#FFFFFF" opacity="0.5" />
    {/* Power light LED */}
    <circle cx="38" cy="30" r="1" fill="#00FF00" />
    {/* Monitor Stand */}
    <path d="M18 32H30L34 38H14L18 32Z" fill="#B0B0B0" stroke="#808080" strokeWidth="1" />
    <rect x="12" y="38" width="24" height="4" fill="#D4D0C8" stroke="#404040" strokeWidth="1" />
  </svg>
);

export const RecycleBinIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Bin Rim */}
    <ellipse cx="24" cy="12" rx="16" ry="4" fill="#C0C0C0" stroke="#808080" strokeWidth="2" />
    {/* Bin Body */}
    <path d="M9 12L13 40C13 42.2 17.9 44 24 44C30.1 44 35 42.2 35 40L39 12" fill="#E0E0E0" stroke="#808080" strokeWidth="2" />
    {/* Bin Ribs */}
    <path d="M17 14L19 39" stroke="#A0A0A0" strokeWidth="1.5" />
    <path d="M24 15V40" stroke="#A0A0A0" strokeWidth="1.5" />
    <path d="M31 14L29 39" stroke="#A0A0A0" strokeWidth="1.5" />
    {/* Crumpled paper sticking out */}
    <path d="M18 10C18 8 21 6 24 8C27 6 30 8 30 10" fill="#FFFFFF" stroke="#808080" strokeWidth="1" />
    <path d="M22 6L26 9L23 12Z" fill="#F0F0F0" />
  </svg>
);

export const MusicFolderIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Back Folder Tab */}
    <path d="M6 10H18L22 14H42V38H6V10Z" fill="#E6AE38" stroke="#996600" strokeWidth="1.5" />
    {/* CD Disc inside */}
    <circle cx="24" cy="24" r="10" fill="#E0E0E0" stroke="#A0A0A0" strokeWidth="1" />
    <circle cx="24" cy="24" r="3" fill="#FFFFFF" stroke="#808080" strokeWidth="1" />
    <path d="M24 14C28 14 32 17 33 21" stroke="#00FFFF" strokeWidth="1.5" opacity="0.8" />
    {/* Front Folder Lip */}
    <path d="M4 18H44L40 42H8L4 18Z" fill="#FCD561" stroke="#B8860B" strokeWidth="1.5" />
    {/* Eighth Note Badge */}
    <path d="M26 26V35M26 26L33 24V32M26 35C26 36.6 24.6 38 23 38C21.4 38 20 36.6 20 35C20 33.4 21.4 32 23 32C24.6 32 26 33.4 26 35ZM33 32C33 33.6 31.6 35 30 35C28.4 35 27 33.6 27 32C27 30.4 28.4 29 30 29C31.6 29 33 30.4 33 32Z" fill="#000080" stroke="#000080" strokeWidth="1" />
  </svg>
);

export const NewFolderIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Back Folder Tab */}
    <path d="M6 10H18L22 14H42V38H6V10Z" fill="#DFA826" stroke="#996600" strokeWidth="1.5" />
    {/* Inner Paper sheet */}
    <rect x="12" y="12" width="24" height="20" fill="#FFFFFF" stroke="#C0C0C0" strokeWidth="1" />
    {/* Front Folder */}
    <path d="M4 18H44L40 42H8L4 18Z" fill="#FFDB6D" stroke="#B8860B" strokeWidth="1.5" />
    {/* Badge (3) */}
    <circle cx="34" cy="32" r="7" fill="#000080" stroke="#FFFFFF" strokeWidth="1" />
    <text x="34" y="36" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">3</text>
  </svg>
);

export const GaneFolderIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Folder Back */}
    <path d="M6 10H18L22 14H42V38H6V10Z" fill="#E67E22" stroke="#A04000" strokeWidth="1.5" />
    {/* Audio Cassette Tape inside */}
    <rect x="10" y="14" width="28" height="18" rx="2" fill="#333333" stroke="#111111" strokeWidth="1" />
    <rect x="14" y="18" width="20" height="8" rx="1" fill="#CCCCCC" />
    <circle cx="18" cy="22" r="2.5" fill="#333333" />
    <circle cx="30" cy="22" r="2.5" fill="#333333" />
    {/* Front Folder */}
    <path d="M4 18H44L40 42H8L4 18Z" fill="#F39C12" stroke="#B9770E" strokeWidth="1.5" />
    {/* Hindi Badge "गाने" indicator glow */}
    <rect x="14" y="28" width="20" height="9" rx="2" fill="#8E44AD" stroke="#FFFFFF" strokeWidth="1" />
    <text x="24" y="35" fill="#FFEA00" fontSize="8" fontWeight="bold" textAnchor="middle">गाने</text>
  </svg>
);

export const StartGlyphIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="6" height="6" fill="#FF4B4B" />
    <rect x="9" y="1" width="6" height="6" fill="#00E676" />
    <rect x="1" y="9" width="6" height="6" fill="#29B6F6" />
    <rect x="9" y="9" width="6" height="6" fill="#FFCA28" />
  </svg>
);

export const TextFileIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M10 6H30L38 14V42H10V6Z" fill="#FFFFFF" stroke="#808080" strokeWidth="2" />
    <path d="M30 6V14H38" fill="#C0C0C0" stroke="#808080" strokeWidth="1.5" />
    <line x1="15" y1="18" x2="33" y2="18" stroke="#000080" strokeWidth="2" />
    <line x1="15" y1="23" x2="33" y2="23" stroke="#606060" strokeWidth="1.5" />
    <line x1="15" y1="28" x2="33" y2="28" stroke="#606060" strokeWidth="1.5" />
    <line x1="15" y1="33" x2="28" y2="33" stroke="#606060" strokeWidth="1.5" />
  </svg>
);
