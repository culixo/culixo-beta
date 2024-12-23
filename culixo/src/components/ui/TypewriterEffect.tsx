// src/components/ui/TypewriterEffect.tsx
import { motion } from 'framer-motion';

interface TypewriterEffectProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const TypewriterEffect = ({ text, className, style }: TypewriterEffectProps) => {
  const words = text.split(" ");
  
  return (
    <div className={className} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.2,
            delay: i * 0.1,
            ease: [0.33, 1, 0.68, 1]
          }}
          className="inline-block mr-[0.2em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};