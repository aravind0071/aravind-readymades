// User Profile Management with Supabase Integration and Fallback
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import crypto from 'crypto';

export interface UserProfile {
  id: string;
  email: string;
  role: 'host' | 'member';
  full_name?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// In-memory profiles fallback cache
const localProfiles = new Map<string, UserProfile>();

function generateUserIdFromEmail(email: string): string {
  // Generates a deterministic UUID-like identifier based on email
  return crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
}

/**
 * Creates or updates the user profile record upon successful OTP verification
 */
export async function upsertUserProfile(email: string, role: 'host' | 'member'): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  const userId = generateUserIdFromEmail(normalizedEmail);
  const now = new Date().toISOString();

  const profile: UserProfile = {
    id: userId,
    email: normalizedEmail,
    role,
    updated_at: now,
  };

  localProfiles.set(normalizedEmail, profile);

  // If Supabase is configured with active credentials, persist to profiles table
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            email: normalizedEmail,
            role,
            updated_at: now,
          },
          { onConflict: 'email' }
        );

      if (error) {
        console.warn('Supabase profiles upsert warning (using in-memory profile):', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase profiles sync error (using in-memory profile):', err.message);
    }
  }

  return profile;
}

/**
 * Retrieves user profile by email
 */
export async function getUserProfile(email: string): Promise<UserProfile | null> {
  const normalizedEmail = email.trim().toLowerCase();

  if (localProfiles.has(normalizedEmail)) {
    return localProfiles.get(normalizedEmail)!;
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (!error && data) {
        return data as UserProfile;
      }
    } catch (err) {
      // fallback to null
    }
  }

  return null;
}
