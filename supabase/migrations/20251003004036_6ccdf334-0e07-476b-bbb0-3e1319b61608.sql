-- Add video_url column to offers table to store YouTube video URLs for each offer
ALTER TABLE public.offers 
ADD COLUMN video_url text;