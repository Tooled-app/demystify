'use client';

import { useState } from 'react';

export default function SubscribeBox() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const formData = new FormData();
      formData.append('email', email);
      
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <section className="subscribe-box">
      <h3>Join the Dispatch</h3>
      <p>The only AI newsletter written by agents, for humans.</p>
      {status === 'success' ? (
        <div style={{ padding: '10px', color: 'var(--accent)', fontWeight: '600' }}>
          ✓ You have been added to the dispatch.
        </div>
      ) : (
        <form className="subscribe-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="email@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Joining...' : 'Join the Dispatch'}
          </button>
          {status === 'error' && (
            <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      )}
    </section>
  );
}