
import React, { useState, useEffect } from "react";
import MobileLayout from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Shield, HeartPulse, Users, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

const Home: React.FC = () => {
  const [isEmergency, setIsEmergency] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { toast } = useToast();
  const { isDarkMode } = useTheme();

  // Handle emergency button countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isEmergency && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isEmergency && countdown === 0) {
      // Trigger emergency alerts
      triggerEmergencyAlert();
      setIsEmergency(false);
      setCountdown(3);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isEmergency, countdown]);

  const triggerEmergencyAlert = () => {
    // Mock sending emergency alerts
    toast({
      title: "Emergency Alert Sent",
      description: "Your emergency contacts have been notified with your location.",
      // variant: "destructive"
    });
    
    // In a real app, this would:
    // 1. Send messages to emergency contacts with GPS location
    // 2. Call emergency services
    // 3. Start audio recording
  };

  const startEmergency = () => {
    setIsEmergency(true);
  };

  const cancelEmergency = () => {
    setIsEmergency(false);
    setCountdown(3);
    // toast({
    //   title: "Emergency Cancelled",
    //   description: "The emergency alert has been cancelled.",
    // });
  };

  return (
    <MobileLayout>
      <div className="mobile-container space-y-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zeb-purple">Welcome</h1>
            <p className="text-muted-foreground">Stay safe, stay connected</p>
          </div>
          <Bell className="h-6 w-6 text-zeb-purple" />
        </header>

        {/* Emergency Button */}
        <div className="flex flex-col items-center justify-center py-6">
          {isEmergency ? (
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-destructive mb-4">
                {countdown}
              </div>
              <Button
                onClick={cancelEmergency}
                variant="outline"
                className="bg-white border-destructive text-destructive hover:bg-destructive hover:text-white"
              >
                Cancel Emergency
              </Button>
            </div>
          ) : (
            <>
              <button onClick={startEmergency} className="emergency-button">
                <Shield className="h-12 w-12" strokeWidth={2} />
              </button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Press in an emergency. <br />A 3-second countdown will begin.
              </p>
            </>
          )}
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-hover">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-zeb-lightPink flex items-center justify-center mb-3">
                <HeartPulse className="h-8  w-8 strokeWidth={2} text-zeb-pink" />
              </div>
              <h3 className="font-medium">Maternal Health</h3>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-zeb-lightPink flex items-center justify-center mb-3">
                <Users className="h-8  w-8 strokeWidth={2} text-zeb-pink" />
              </div>
              <h3 className="font-medium">Community</h3>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-zeb-lightPink flex items-center justify-center mb-3">
                <MapPin className="h-8  w-8 strokeWidth={2} text-zeb-pink" />
              </div>
              <h3 className="font-medium">Find Help</h3>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-zeb-lightPink flex items-center justify-center mb-3">
                <Phone className="h-8  w-8 strokeWidth={2} text-zeb-pink" />
              </div>
              <h3 className="font-medium">Emergency Call</h3>
            </CardContent>
          </Card>
        </div>

        {/* Safety Tip */}
        <Card className="bg-zeb-purple/5 border-zeb-purple/20">
          <CardContent className="p-4">
            <h3 className="font-medium text-zeb-purple mb-1">Safety Tip</h3>
            <p className="text-sm">
              Share your travel plans with a trusted friend or family member
              when going to new places.
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Home;
