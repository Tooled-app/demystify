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
      className={className}
      style={{ 
        width: '100%',
        maxWidth, 
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '24px',
        paddingRight: '24px',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </div>
  );
}
