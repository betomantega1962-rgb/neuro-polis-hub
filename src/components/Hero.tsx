import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BookOpen, Award, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import abnpLogo from "@/assets/abnp-logo.png";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(100, "Senha muito longa"),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const Hero = () => {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent, type: 'login' | 'register') => {
    e.preventDefault();
    
    try {
      // Validate form data with Zod
      if (type === 'register') {
        registerSchema.parse(formData);
      } else {
        loginSchema.parse(formData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      let error;

      if (type === 'register') {
        const result = await signUp(formData.email, formData.password, formData.name, formData.phone);
        error = result.error;
      } else {
        const result = await signIn(formData.email, formData.password);
        error = result.error;
      }

      if (error) {
        // Log error for debugging
        console.log('Erro de autenticação:', { 
          message: error.message, 
          status: error.status, 
          code: error.code,
          type: type 
        });

        let errorMessage = "Ocorreu um erro durante a autenticação.";
        
        // Handle specific error cases
        if (error.message?.includes("Email not confirmed")) {
          errorMessage = "Você precisa confirmar seu e-mail antes de fazer login. Verifique sua caixa de entrada e spam.";
        } else if (error.message?.includes("Invalid login credentials")) {
          errorMessage = "E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.";
        } else if (
          error.message?.includes("User already registered") || 
          error.message?.includes("already registered") ||
          error.message?.includes("already been registered") ||
          error.message?.includes("already exists") ||
          error.status === 422 ||
          (error.status === 400 && type === 'register')
        ) {
          errorMessage = "Este e-mail já está cadastrado. Tente fazer login ou recuperar sua senha.";
        } else if (error.message?.includes("Signup not allowed")) {
          errorMessage = "Cadastro não permitido no momento. Entre em contato com o suporte.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Erro de autenticação",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: type === 'login' ? "Login realizado!" : "Cadastro realizado!",
        description: type === 'register' 
          ? "Verifique seu e-mail para confirmar o cadastro."
          : `Bem-vindo à plataforma ABNP!`,
      });

    } catch (err) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="academic-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <img 
                  src={abnpLogo} 
                  alt="ABNP Logo" 
                  className="h-16 w-16 object-contain" 
                />
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground">
                    ABNP
                  </h1>
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-serif text-primary-foreground/90">
                Academia Brasileira de Neurociência Política
              </h2>
              <p className="text-lg lg:text-xl text-primary-foreground/80 max-w-2xl">
                Domine os fundamentos da neurociência aplicada à política. 
                Acesse cursos gratuitos, artigos exclusivos e muito mais.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center space-y-2">
                <BookOpen className="h-8 w-8 text-accent mx-auto" />
                <h3 className="font-semibold text-primary-foreground">Cursos Gratuitos</h3>
                <p className="text-sm text-primary-foreground/70">Vídeos e conteúdos selecionados</p>
              </div>
              <div className="text-center space-y-2">
                <Award className="h-8 w-8 text-accent mx-auto" />
                <h3 className="font-semibold text-primary-foreground">Certificação</h3>
                <p className="text-sm text-primary-foreground/70">Método NeuroCP exclusivo</p>
              </div>
              <div className="text-center space-y-2">
                <Users className="h-8 w-8 text-accent mx-auto" />
                <h3 className="font-semibold text-primary-foreground">Comunidade</h3>
                <p className="text-sm text-primary-foreground/70">Conecte-se com especialistas</p>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="animate-slide-up">
            <Card className="gradient-card border-0 shadow-glow backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-primary">
                  Acesse Gratuitamente
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Entre ou cadastre-se para acessar todo o conteúdo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="register" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="register">Cadastrar</TabsTrigger>
                    <TabsTrigger value="login">Entrar</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="register" className="space-y-4 mt-6">
                    <form onSubmit={(e) => handleSubmit(e, 'register')} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Mínimo 6 caracteres"
                          minLength={6}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 hover-lift"
                      >
                        Cadastrar Gratuitamente
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="login" className="space-y-4 mt-6">
                    <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-4">
                      <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg mb-4">
                        <div className="flex items-start gap-2">
                          <Brain className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-primary">
                              Acesso Administrativo
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Após fazer login, você verá um botão "Admin" no header para acessar o painel administrativo
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-email">E-mail</Label>
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Senha</Label>
                        <Input
                          id="login-password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Sua senha"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 hover-lift"
                      >
                        Entrar no Painel
                      </Button>
                      <div className="text-center mt-4">
                        <Button
                          type="button"
                          variant="link" 
                          className="text-sm text-muted-foreground hover:text-primary"
                          onClick={() => navigate("/forgot-password")}
                        >
                          Esqueci minha senha
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};