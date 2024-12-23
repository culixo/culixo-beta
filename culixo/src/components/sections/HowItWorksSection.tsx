// src/components/sections/HowItWorksSection.tsx
import { cn } from "@/lib/utils";
import { motion, useScroll } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import Image from "next/image";

interface HowItWorksSectionProps {
  theme: string | undefined;
}

// Step component
const Step = ({ step, index, theme }: { 
  step: {
    number: string;
    title: string;
    description: string;
    image: string;
    icon: React.ReactNode;
  }, 
  index: number, 
  theme: string | undefined 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div ref={ref} className="relative">
      {/* Timeline Node with Number */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 hidden md:block",
          index % 2 === 0
            ? "left-[calc(50%-2.5rem)]"
            : "left-[calc(50%+1.5rem)]"
        )}
      >
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            "text-sm font-medium z-10 relative",
            theme === "dark"
              ? "bg-white text-zinc-900 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              : "bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          )}
        >
          {step.number}
        </div>
        <div
          className={cn(
            "absolute inset-[-4px] rounded-full",
            "animate-pulse",
            theme === "dark" ? "bg-white/20" : "bg-primary/10"
          )}
        />
      </motion.div>

      {/* Content Container */}
      <div className={cn("grid md:grid-cols-[1fr,80px,1fr] gap-6 items-center")}>
        <motion.div
          initial={{
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
          }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            "col-span-full md:col-span-1",
            index % 2 === 0 ? "md:col-start-1" : "md:col-start-3"
          )}
        >
          <div
            className={cn(
              "relative p-6 rounded-xl",
              theme === "dark"
                ? "bg-zinc-900/50 border border-white/10"
                : "bg-white/50 border border-zinc-200",
              "backdrop-blur-sm max-w-md mx-auto"
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className={cn(
                  "p-2 rounded-lg shrink-0",
                  theme === "dark"
                    ? "bg-primary/20"
                    : "bg-primary/10"
                )}
              >
                <div className="text-primary">{step.icon}</div>
              </div>
              <h3
                className={cn(
                  "text-xl font-semibold",
                  theme === "dark" ? "text-white" : "text-zinc-900"
                )}
              >
                {step.title}
              </h3>
            </div>

            {/* Description */}
            <p
              className={cn(
                "text-sm mb-4",
                theme === "dark" ? "text-zinc-400" : "text-zinc-600"
              )}
            >
              {step.description}
            </p>

            {/* Image */}
            <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-cover"
              />
              <div
                className={cn(
                  "absolute inset-0",
                  theme === "dark"
                    ? "bg-gradient-to-t from-black/30 to-transparent"
                    : "bg-gradient-to-t from-black/10 to-transparent"
                )}
              />
            </div>
          </div>
        </motion.div>

        {/* Center Spacer */}
        <div className="hidden md:block" />
      </div>
    </div>
  );
};
export const HowItWorksSection = ({ theme }: HowItWorksSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const steps = [
    {
      number: "1",
      title: "Create Account",
      description: "Sign up and personalize your cooking preferences and dietary requirements",
      image: "/images/how-it-works/hiw1.jpg",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      number: "2",
      title: "Discover Recipes",
      description: "Browse through thousands of recipes or use AI to find the perfect match",
      image: "/images/how-it-works/hiw2.jpg",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: "3",
      title: "Cook & Share",
      description: "Follow easy steps, cook amazing meals, and share your experience",
      image: "/images/how-it-works/hiw3.jpg",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 14c.2-1 .7-1.7 1.5-2.5M9 14c-.2-1-.7-1.7-1.5-2.5M12 8c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z" />
        </svg>
      ),
    },
    {
      number: "4",
      title: "Join Community",
      description: "Connect with other food lovers, share tips, and grow together",
      image: "/images/how-it-works/hiw4.jpg",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-4 relative">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={cn(
            "text-4xl md:text-5xl font-bold mb-4",
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          )}>
            How Culixo Works
          </h2>
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
          )}>
            Start your culinary journey in four simple steps
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] hidden md:block">
            {/* Background Line */}
            <div className={cn(
              "absolute inset-0",
              theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'
            )} />
            
            {/* Glowing Progress Line */}
            <motion.div
              className="absolute top-0 w-full origin-top"
              style={{
                scaleY: scrollYProgress,
                height: '100%',
                background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 1) 50%, rgba(139, 92, 246, 0.3) 100%)',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative space-y-20 py-8">
            {steps.map((step, index) => (
              <Step key={index} step={step} index={index} theme={theme} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};