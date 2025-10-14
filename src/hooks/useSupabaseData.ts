import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  slug: string | null;
  published_at: string | null;
  author: string | null;
  featured_image_url: string | null;
  external_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  completed_at: string | null;
  progress_percentage: number;
  created_at: string;
  course?: Course;
}

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  coupon_code: string | null;
  discount_percentage: number | null;
  discount_amount: number | null;
  original_price: number | null;
  final_price: number | null;
  external_url: string | null;
  video_url: string | null;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar cursos');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
};

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('is_active', true)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar artigos');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return { articles, loading, error };
};

export const useUserProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return { error: 'Usuário não encontrado' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      return { error: errorMessage };
    }
  };

  return { profile, loading, error, updateProfile };
};

export const useUserProgress = (userId: string | undefined) => {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select(`
            *,
            course:courses(*)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProgress(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar progresso');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  const updateProgress = async (courseId: string, progressPercentage: number) => {
    if (!userId) return { error: 'Usuário não encontrado' };

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          course_id: courseId,
          progress_percentage: progressPercentage,
          completed_at: progressPercentage >= 100 ? new Date().toISOString() : null
        });

      if (error) throw error;
      
      // Refresh progress data
      const { data } = await supabase
        .from('user_progress')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      setProgress(data || []);
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar progresso';
      return { error: errorMessage };
    }
  };

  return { progress, loading, error, updateProgress };
};

export const useOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOffers(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar ofertas');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return { offers, loading, error };
};