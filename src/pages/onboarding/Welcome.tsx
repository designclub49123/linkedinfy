import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, FileText, Zap, Shield, ArrowRight } from 'lucide-react';

export default function OnboardingWelcome() {
  const navigate = useNavigate();

  const features = [
    { icon: <Sparkles className="h-6 w-6" />, title: 'AI-Powered Writing', desc: 'Get intelligent suggestions as you write' },
    { icon: <FileText className="h-6 w-6" />, title: 'Beautiful Documents', desc: 'Create stunning documents with ease' },
    { icon: <Zap className="h-6 w-6" />, title: 'Lightning Fast', desc: 'Export to PDF, Word, and more instantly' },
    { icon: <Shield className="h-6 w-6" />, title: 'Secure & Private', desc: 'Your data is encrypted and safe' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <img src="/logo.png" alt="PaperMorph" className="h-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to PaperMorph! 🎉
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The AI-powered document editor that helps you write smarter and faster.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button size="lg" onClick={() => navigate('/onboarding/plan')} className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Takes less than 2 minutes to set up
        </p>
      </div>
    </div>
  );
}
