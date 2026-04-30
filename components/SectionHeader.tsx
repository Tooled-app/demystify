import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h1>{title}</h1>
      {description && <div className="section-desc">{description}</div>}
    </div>
  );
}
