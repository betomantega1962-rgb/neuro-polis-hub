import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useCourses } from "@/hooks/useSupabaseData";
import abnpLogo from "@/assets/abnp-logo.png";

export default function CoursesGallery() {
  const navigate = useNavigate();
  const { courses, loading } = useCourses();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <img src={abnpLogo} alt="ABNP Logo" className="h-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Cursos Disponíveis
            </h1>
            <p className="text-muted-foreground">
              Explore nossos cursos e comece a aprender agora
            </p>
          </div>

          {courses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  Nenhum curso disponível no momento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card 
                  key={course.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden group"
                  onClick={() => navigate(`/cursos/${course.id}`)}
                >
                  {course.thumbnail_url && (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    {course.description && (
                      <CardDescription className="line-clamp-3">
                        {course.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Acessar Curso
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
