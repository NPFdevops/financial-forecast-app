import React, { useState } from 'react';
import './EmailPopup.css';
import { supabase, withErrorHandling, isSupabaseConfigured } from '../services/supabase';

function EmailPopup({ onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError('Database is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env and restart the dev server.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const normalizedEmail = email.trim().toLowerCase();

      await withErrorHandling(() =>
        supabase
          .from('viewers')
          .insert({ email: normalizedEmail }, { onConflict: 'email', ignoreDuplicates: true, returning: 'minimal' })
      );

      localStorage.setItem('hasProvidedEmail', 'true');
      onClose();
    } catch (error) {
      const rawMessage = error?.message || '';
      const isDuplicate = /(duplicate key|duplicate|unique constraint|23505|conflict)/i.test(rawMessage);
      if (isDuplicate) {
        // Treat duplicates as success: email already exists, so allow access
        localStorage.setItem('hasProvidedEmail', 'true');
        onClose();
        return;
      }
      const isRlsDenied = /row-level security|RLS|permission|not allowed/i.test(rawMessage);
      const message = isRlsDenied
        ? 'Access denied by Row Level Security policy. Please allow INSERT on table "viewers" for anon in Supabase.'
        : rawMessage || 'Failed to save email. Please try again.';
      setError(message);
      console.error('Error saving email to Supabase:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Welcome!</h2>
        <p>Please enter your email to view the project.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit" disabled={submitting || !isSupabaseConfigured}>
            {submitting ? 'Saving...' : 'Continue'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {!error && !isSupabaseConfigured && (
          <p className="error-message">
            Supabase not configured. See SUPABASE_SETUP.md to enable saving emails.
          </p>
        )}
      </div>
    </div>
  );
}

export default EmailPopup;
