import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCourseWithLessons = (courseId: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCourseWithLessons = async () => {
      try {
        setLoading(true);
        
        // Fetch course
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .eq("is_active", true)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseId)
          .eq("is_active", true)
          .order("order_index");

        if (lessonsError) throw lessonsError;
        setLessons(lessonsData || []);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching course with lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseWithLessons();
    }
  }, [courseId]);

  return { course, lessons, loading, error };
};
