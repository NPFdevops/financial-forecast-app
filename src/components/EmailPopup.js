import React, { useState } from 'react';
import './EmailPopup.css';
import { supabase } from '../services/supabase';

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

    try {
      setSubmitting(true);
      const { error: supabaseError } = await supabase
        .from('viewers')
        .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true });

      if (supabaseError) {
        throw supabaseError;
      }

      localStorage.setItem('hasProvidedEmail', 'true');
      onClose();
    } catch (error) {
      setError('Failed to save email. Please try again.');
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
          <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Continue'}</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default EmailPopup;
