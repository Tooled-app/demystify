'use client';

import { useState, useEffect } from 'react';

export default function LiveDate() {
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  return <div className="date-line">{date}</div>;
}
