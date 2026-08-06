import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, RotateCcw, Divide, X, Minus, Plus, Equal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const App = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setShouldReset(false);
  };

  const backspace = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const calculate = () => {
    try {
      const fullEquation = equation + display;
      // Using Function instead of eval for a bit more safety in this simple context
      const result = new Function(`return ${fullEquation}`)();
      setDisplay(String(Number(result.toFixed(8)))); 
      setEquation('');
      setShouldReset(true);
    } catch (e) {
      setDisplay('Error');
      setEquation('');
      setShouldReset(true);
    }
  };

  const Button = ({ children, onClick, variant = 'default', className = '' }: any) => {
    const variants: any = {
      default: 'bg-surface text-textMain hover:bg-[#333]',
      operator: 'bg-primary/20 text-primary hover:bg-primary/30 font-semibold',
      action: 'bg-border text-textSecondary hover:bg-border/80',
      equals: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20',
    };

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          'h-16 w-full rounded-2xl text-xl font-medium calc-button flex items-center justify-center',
          variants[variant],
          className
        )}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-background">
      {/* Ambient Background Glows */}
      <div className="glow-bg bg-primary top-1/4 left-1/4" />
      <div className="glow-bg bg-secondary bottom-1/4 right-1/4" />
      <div className="glow-bg bg-accent top-1/2 left-1/3" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-panel w-full max-w-[380px] rounded-[40px] p-6 relative z-10"
      >
        {/* Display Area */}
        <div className="mb-6 px-2 text-right h-32 flex flex-col justify-end">
          <AnimatePresence mode="wait">
            <motion.div 
              key={equation}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-textSecondary text-sm font-medium h-6 mb-1"
            >
              {equation}
            </motion.div>
          </AnimatePresence>
          <motion.div 
            key={display}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-light tracking-tighter truncate"
          >
            {display}
          </motion.div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Button variant="action" onClick={clear}>
            <RotateCcw size={20} />
          </Button>
          <Button variant="action" onClick={backspace}>
            <Delete size={20} />
          </Button>
          <Button variant="operator" onClick={() => handleOperator('/')}>
            <Divide size={20} />
          </Button>
          <Button variant="operator" onClick={() => handleOperator('*')}>
            <X size={20} />
          </Button>

          {[7, 8, 9].map(n => (
            <Button key={n} onClick={() => handleNumber(String(n))}>{n}</Button>
          ))}
          <Button variant="operator" onClick={() => handleOperator('-')}>
            <Minus size={20} />
          </Button>

          {[4, 5, 6].map(n => (
            <Button key={n} onClick={() => handleNumber(String(n))}>{n}</Button>
          ))}
          <Button variant="operator" onClick={() => handleOperator('+')}>
            <Plus size={20} />
          </Button>

          {[1, 2, 3].map(n => (
            <Button key={n} onClick={() => handleNumber(String(n))}>{n}</Button>
          ))}
          <Button variant="equals" className="row-span-2 h-full" onClick={calculate}>
            <Equal size={24} />
          </Button>

          <Button 
            variant="default" 
            className="col-span-2 text-left px-6" 
            onClick={() => handleNumber('0')}
          >
            0
          </Button>
          <Button variant="default" onClick={() => handleNumber('.')}>.</Button>
        </div>
      </motion.div>

      {/* Subtle Footer */}
      <div className="absolute bottom-8 text-textSecondary/40 text-xs tracking-widest uppercase font-medium">
        Precision Calculator &bull; 2025
      </div>
    </div>
  );
};

export default App;
