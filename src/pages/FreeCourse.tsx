import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import abnpLogo from "@/assets/abnp-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Course {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
}

export default function FreeCourse() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(0);

  const extractYouTubeId = (url: string): string => {
    if (!url) return "";
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : url;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("id", { ascending: true });

      if (!error && data) setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardContent>
            <h2 className="text-xl font-bold mb-4">Nenhum curso disponível</h2>
            <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const current = courses[currentVideo];
  const currentId = extractYouTubeId(current?.youtube_url);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <img src={abnpLogo} alt="ABNP Logo" className="h-8 w-8 object-contain" />
            <h1 className="text-xl font-bold">Cursos Gratuitos</h1>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {currentId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${currentId}`}
                title={current.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center text-white h-full">
                Vídeo não disponível
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold">{current?.title}</h2>
          <p className="text-muted-foreground">{current?.description}</p>
        </div>

        {/* Playlist */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Play className="h-5 w-5" />
                Lista de Vídeos
              </CardTitle>
              <CardDescription>Curso completo de neurociência política</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  onClick={() => setCurrentVideo(index)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    currentVideo === index
                      ? "border-primary bg-blue-50 dark:bg-blue-950/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <h4
                    className={`font-medium ${
                      currentVideo === index ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {course.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
