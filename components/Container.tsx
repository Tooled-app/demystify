import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  width?: 'narrow' | 'wide';
  className?: string;
}

export default function Container({ children, width = 'wide', className = '' }: ContainerProps) {
  const maxWidth = width === 'narrow' ? '700px' : '900px';
  
  return (
    <div 
      className={`mx-auto px-5 md:px-12 ${className}`} 
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
}
