import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { useCourseWithLessons } from "@/hooks/useCourseWithLessons";
import abnpLogo from "@/assets/abnp-logo.png";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { course, lessons, loading } = useCourseWithLessons(courseId || "");
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!course || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Curso não encontrado</CardTitle>
            <CardDescription>
              O curso que você procura não está disponível no momento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/cursos")} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Cursos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentLesson = lessons[currentLessonIndex];
  const videoId = currentLesson?.youtube_url ? extractYouTubeId(currentLesson.youtube_url) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/cursos")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <img src={abnpLogo} alt="ABNP Logo" className="h-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player and Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Breadcrumb */}
            <div className="text-sm text-muted-foreground">
              <span className="cursor-pointer hover:text-foreground" onClick={() => navigate("/cursos")}>
                Cursos
              </span>
              {" > "}
              <span className="text-foreground">{course.title}</span>
            </div>

            {/* Video Player */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-black">
                {videoId ? (
                  <YouTubePlayer videoId={videoId} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    Vídeo não disponível
                  </div>
                )}
              </div>
            </Card>

            {/* Lesson Info */}
            <Card>
              <CardHeader>
                <CardTitle>{currentLesson.title}</CardTitle>
                {currentLesson.description && (
                  <CardDescription>{currentLesson.description}</CardDescription>
                )}
              </CardHeader>
            </Card>
          </div>

          {/* Playlist */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Aulas do Curso</CardTitle>
                <CardDescription>
                  {lessons.length} {lessons.length === 1 ? "aula" : "aulas"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-1 p-4 pt-0">
                    {lessons.map((lesson, index) => (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLessonIndex(index)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          index === currentLessonIndex
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 mt-1 ${
                              index === currentLessonIndex ? "text-primary-foreground" : "text-muted-foreground"
                            }`}
                          >
                            <Play className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">
                              {index + 1}. {lesson.title}
                            </p>
                            {lesson.duration_minutes && (
                              <p
                                className={`text-xs mt-1 ${
                                  index === currentLessonIndex ? "text-primary-foreground/80" : "text-muted-foreground"
                                }`}
                              >
                                {lesson.duration_minutes} min
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
