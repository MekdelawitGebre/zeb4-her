
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zeb-purple to-zeb-darkPurple text-white p-6">
      <div className="animate-fade-in flex flex-col items-center">
        <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center mb-6">
          <div className="text-4xl font-bold text-zeb-purple">
            <div className="w-20 h-20 rounded-full">
              {" "}
              <img src="../../../favicon.ico" className="w-25 h-25 rounded-full" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">
          ዘብ<sub>4</sub>
          <i>Her</i>
        </h1>
        <p className="text-center text-lg mb-8 opacity-90">
          <i> A Healthier Tomorrow Starts with Her Safety Today.</i>
        </p>

        {loading && (
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full absolute border-4 border-white/30"></div>
              <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-transparent border-t-zeb-pink"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
