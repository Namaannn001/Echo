import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive';
  isLoading?: boolean;
}

export function Button({ children, variant = 'primary', isLoading = false, ...props }: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md font-semibold text-sm transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-purple-600 text-white hover:bg-purple-700",
    secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button className={clsx(baseClasses, variantClasses[variant])} disabled={isLoading} {...props}>
      {isLoading ? "Loading..." : children}
    </button>
  );
}