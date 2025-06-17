import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ParticleEffectsProps {
  type: "clear" | "rain" | "snow" | "clouds";
}

export default function ParticleEffects({ type }: ParticleEffectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    let intervalId: NodeJS.Timeout;

    const createRainDrop = () => {
      const drop = document.createElement("div");
      drop.className = "absolute pointer-events-none w-0.5 h-4 bg-gradient-to-b from-blue-200/60 to-blue-200/10 rounded-full";
      drop.style.left = Math.random() * 100 + "vw";
      drop.style.top = "-20px";
      drop.style.animationDuration = (0.5 + Math.random() * 0.5) + "s";
      
      const keyframes = [
        { transform: "translateY(-20px) translateX(0px)", opacity: 1 },
        { transform: `translateY(100vh) translateX(-${Math.random() * 50}px)`, opacity: 0.3 }
      ];
      
      const animation = drop.animate(keyframes, {
        duration: (500 + Math.random() * 500),
        easing: "linear"
      });
      
      container.appendChild(drop);
      
      animation.addEventListener("finish", () => {
        if (drop.parentNode) {
          drop.parentNode.removeChild(drop);
        }
      });
    };

    const createSnowFlake = () => {
      const flake = document.createElement("div");
      flake.className = "absolute pointer-events-none w-2 h-2 bg-white/80 rounded-full";
      flake.style.left = Math.random() * 100 + "vw";
      flake.style.top = "-20px";
      
      const keyframes = [
        { 
          transform: "translateY(-20px) translateX(0px) rotate(0deg)", 
          opacity: 1 
        },
        { 
          transform: `translateY(100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg)`, 
          opacity: 0.3 
        }
      ];
      
      const animation = flake.animate(keyframes, {
        duration: (2000 + Math.random() * 2000),
        easing: "linear"
      });
      
      container.appendChild(flake);
      
      animation.addEventListener("finish", () => {
        if (flake.parentNode) {
          flake.parentNode.removeChild(flake);
        }
      });
    };

    const createCloudParticle = () => {
      const cloud = document.createElement("div");
      cloud.className = "absolute pointer-events-none w-16 h-5 bg-white/10 rounded-full blur-sm";
      cloud.style.top = Math.random() * 30 + "%";
      cloud.style.left = "-80px";
      
      const keyframes = [
        { transform: "translateX(-80px)" },
        { transform: `translateX(calc(100vw + 80px))` }
      ];
      
      const animation = cloud.animate(keyframes, {
        duration: 20000 + Math.random() * 10000,
        easing: "linear"
      });
      
      container.appendChild(cloud);
      
      animation.addEventListener("finish", () => {
        if (cloud.parentNode) {
          cloud.parentNode.removeChild(cloud);
        }
      });
    };

    if (type === "rain") {
      // Initial burst of rain drops
      for (let i = 0; i < 50; i++) {
        setTimeout(createRainDrop, Math.random() * 1000);
      }
      // Continuous rain
      intervalId = setInterval(() => {
        for (let i = 0; i < 5; i++) {
          createRainDrop();
        }
      }, 200);
    } else if (type === "snow") {
      // Initial burst of snowflakes
      for (let i = 0; i < 30; i++) {
        setTimeout(createSnowFlake, Math.random() * 2000);
      }
      // Continuous snow
      intervalId = setInterval(() => {
        for (let i = 0; i < 2; i++) {
          createSnowFlake();
        }
      }, 1000);
    } else if (type === "clouds") {
      // Create clouds periodically
      for (let i = 0; i < 5; i++) {
        setTimeout(createCloudParticle, Math.random() * 5000);
      }
      intervalId = setInterval(createCloudParticle, 8000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [type]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}
