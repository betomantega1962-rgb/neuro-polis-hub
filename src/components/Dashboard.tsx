import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, ExternalLink, User, Settings, LogOut, Trophy, Clock, Star, Shield, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCourses, useArticles, useUserProfile, useUserProgress, useOffers } from "@/hooks/useSupabaseData";
import { useAdmin } from "@/hooks/useAdmin";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import abnpLogo from "@/assets/abnp-logo.png";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { courses, loading: coursesLoading } = useCourses();
  const { articles, loading: articlesLoading } = useArticles();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile(user?.id);
  const { progress, loading: progressLoading, updateProgress } = useUserProgress(user?.id);
  const { offers, loading: offersLoading } = useOffers();
  const { isAdmin, loading: adminLoading } = useAdmin();

  const [activeTab, setActiveTab] = useState("courses");
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [profileData, setProfileData] = useState({
    display_name: profile?.display_name || '',
    email: user?.email || '',
    email_notifications: profile?.email_notifications ?? true
  });

  // Função para extrair videoId de URLs do YouTube
  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    
    // Padrões de URL do YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      /youtube\.com\/embed\/([^&\s]+)/,
      /youtube\.com\/v\/([^&\s]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    
    return null;
  };

  const handlePlayVideo = (courseId: string) => {
    setPlayingVideos(prev => {
      const newSet = new Set(prev);
      newSet.add(courseId);
      return newSet;
    });
  };

  useEffect(() => {
    if (profile) {
      setProfileData({
        display_name: profile.display_name || '',
        email: user?.email || '',
        email_notifications: profile.email_notifications
      });
    }
  }, [profile, user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await updateProfile({
      display_name: profileData.display_name,
      email_notifications: profileData.email_notifications
    });

    if (error) {
      toast({
        title: "Erro",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const handleCourseProgress = async (courseId: string, progressPercentage: number) => {
    const { error } = await updateProgress(courseId, progressPercentage);
    
    if (error) {
      toast({
        title: "Erro",
        description: error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-dashboard">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="academic-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <img 
                src={abnpLogo} 
                alt="ABNP Logo" 
                className="h-8 w-8 object-contain" 
              />
              <div>
                <h1 className="text-xl font-bold text-primary">ABNP</h1>
                <p className="text-xs text-muted-foreground">Academia</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Bem-vindo de volta, {profile?.display_name || user?.email?.split('@')[0] || 'usuário'}!
            </p>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="academic-container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <Card className="gradient-card shadow-glow">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{progress.length}</div>
                <p className="text-sm text-muted-foreground">Cursos Iniciados</p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card shadow-glow border-accent/30">
              <CardContent className="p-6 text-center">
                {offersLoading ? (
                  <div className="text-sm text-muted-foreground">Carregando...</div>
                ) : offers.length > 0 ? (
                  <>
                    <Tag className="h-8 w-8 text-accent mx-auto mb-2" />
                    {offers[0].coupon_code && (
                      <div className="text-lg font-bold text-accent mb-1">{offers[0].coupon_code}</div>
                    )}
                    {offers[0].discount_percentage && (
                      <p className="text-sm text-muted-foreground">{offers[0].discount_percentage}% de desconto</p>
                    )}
                  </>
                ) : (
                  <>
                    <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Nenhuma oferta disponível</p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card className="gradient-card shadow-glow">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{articles.length}</div>
                <p className="text-sm text-muted-foreground">Artigos Publicados</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="courses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="h-4 w-4 mr-2" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="articles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Play className="h-4 w-4 mr-2" />
              Artigos
            </TabsTrigger>
            <TabsTrigger value="offers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Trophy className="h-4 w-4 mr-2" />
              Ofertas
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {coursesLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid gap-4">
                {courses.map((course) => {
                  const userProgress = progress.find(p => p.course_id === course.id);
                  const progressPercentage = userProgress?.progress_percentage || 0;
                  
                  return (
                    <Card key={course.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              {course.thumbnail_url ? (
                                <img 
                                  src={course.thumbnail_url} 
                                  alt={course.title}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Play className="h-6 w-6 text-primary" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">{course.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {course.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {course.duration_minutes} min
                                </span>
                                <Badge variant="secondary">Gratuito</Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Player do YouTube com controle manual */}
                        <div className="mt-3 w-full relative group">
                          {!playingVideos.has(course.id) ? (
                            // Thumbnail com botão de play
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                              <img
                                src={`https://img.youtube.com/vi/${extractVideoId(course.youtube_url)}/maxresdefault.jpg`}
                                alt={course.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback para thumbnail de menor qualidade
                                  e.currentTarget.src = `https://img.youtube.com/vi/${extractVideoId(course.youtube_url)}/hqdefault.jpg`;
                                }}
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Button
                                  size="lg"
                                  onClick={() => handlePlayVideo(course.id)}
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-20 h-20 p-0 shadow-lg hover:scale-110 transition-transform"
                                >
                                  <Play className="h-10 w-10 ml-1" fill="currentColor" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // Player do YouTube
                            <iframe
                              className="w-full aspect-video rounded-lg"
                              src={`https://www.youtube.com/embed/${extractVideoId(course.youtube_url)}?rel=0&autoplay=1`}
                              title={course.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          )}
                        </div>

                        <div className="space-y-2 mt-4">
                          <div className="flex justify-between text-sm">
                            <span>Progresso</span>
                            <span>{progressPercentage}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            {articlesLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid gap-4">
                {articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>Por {article.author}</span>
                              <span>•</span>
                              <span>
                                {article.published_at 
                                  ? new Date(article.published_at).toLocaleDateString('pt-BR')
                                  : 'Data não disponível'
                                }
                              </span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="hover-lift"
                              onClick={() => article.external_url && window.open(article.external_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ler Artigo
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            {offersLoading ? (
              <LoadingSpinner />
            ) : offers.length > 0 ? (
              offers.map((offer) => (
                <Card key={offer.id} className="border-accent/30 shadow-accent">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-6">
                        {offer.discount_percentage && (
                          <Badge variant="secondary" className="bg-accent text-accent-foreground text-lg px-3 py-1">
                            OFERTA ESPECIAL - {offer.discount_percentage}% OFF
                          </Badge>
                        )}
                        <div>
                          <h2 className="text-3xl font-bold mb-2">{offer.title}</h2>
                          {offer.description && (
                            <p className="text-lg text-muted-foreground">
                              {offer.description}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          {offer.original_price && (
                            <div className="text-lg text-muted-foreground line-through">
                              De R$ {Number(offer.original_price).toFixed(2)}
                            </div>
                          )}
                          {offer.final_price && (
                            <div className="text-4xl font-bold text-accent">
                              R$ {Number(offer.final_price).toFixed(2)}
                            </div>
                          )}
                          {offer.coupon_code && (
                            <div className="flex items-center gap-2 mt-2">
                              <Tag className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Cupom: {offer.coupon_code}
                              </span>
                            </div>
                          )}
                        </div>

                        {offer.external_url && (
                          <Button 
                            size="lg" 
                            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6"
                            onClick={() => window.open(offer.external_url!, '_blank')}
                          >
                            <ExternalLink className="h-5 w-5 mr-2" />
                            Aproveitar Oferta
                          </Button>
                        )}
                      </div>

                      {offer.video_url && (
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <iframe
                            className="w-full h-full"
                            src={offer.video_url.includes('youtube.com') || offer.video_url.includes('youtu.be') 
                              ? `https://www.youtube.com/embed/${extractVideoId(offer.video_url)}?rel=0`
                              : offer.video_url
                            }
                            title={offer.title}
                            frameBorder="0"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhuma oferta disponível no momento.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações do Perfil
                </CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais e preferências
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {profileLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="display_name">Nome Completo</Label>
                        <Input
                          id="display_name"
                          value={profileData.display_name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          disabled
                          className="bg-muted"
                          placeholder="seu@email.com"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          O e-mail não pode ser alterado por questões de segurança
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Notificações por E-mail</Label>
                          <p className="text-sm text-muted-foreground">
                            Receba atualizações sobre novos cursos e conteúdos
                          </p>
                        </div>
                        <Switch
                          checked={profileData.email_notifications}
                          onCheckedChange={(checked) => 
                            setProfileData(prev => ({ ...prev, email_notifications: checked }))
                          }
                        />
                      </div>
                      <Button type="submit" className="hover-lift">
                        Salvar Alterações
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
