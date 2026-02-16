import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
// Local utility function for clsx and tailwind-merge equivalent is defined below.

// Since I don't know if lib/utils exists, I'll inline the helper or assume standard structure.
// If it fails, I'll fix it. For now, I'll use a local helper.
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const buttonVariants = cva(
    "p-5 rounded-full backdrop-blur-lg border shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer group relative overflow-hidden bg-gradient-to-tr from-black/60 to-black/40",
    {
        variants: {
            variant: {
                white: "border-white/10 hover:shadow-white/20 hover:rotate-3 hover:border-white/30 hover:bg-gradient-to-tr hover:from-white/10 hover:to-black/40",
                green: "border-green-500/20 hover:shadow-green-500/30 hover:rotate-2 hover:border-green-500/50 hover:bg-gradient-to-tr hover:from-green-500/10 hover:to-black/40",
                indigo: "border-indigo-500/20 hover:shadow-indigo-500/30 hover:-rotate-2 hover:border-indigo-500/50 hover:bg-gradient-to-tr hover:from-indigo-500/10 hover:to-black/40",
                red: "border-red-500/20 hover:shadow-red-500/30 hover:rotate-2 hover:border-red-500/50 hover:bg-gradient-to-tr hover:from-red-500/10 hover:to-black/40",
            },
            active: { // Active state styling override if needed, though the component handles it via `bg-brand-text` in previous logic.
                // The new design relies on the gradients. I'll rely on the variant prop.
                true: "ring-2 ring-offset-2 ring-offset-black ring-white/50", // minimal active indicator if needed on top
                false: ""
            }
        },
        defaultVariants: {
            variant: "white",
            active: false,
        },
    }
);

interface AmbientButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isActive?: boolean;
}

const AmbientButton: React.FC<AmbientButtonProps> = ({
    className,
    variant,
    isActive,
    children, // Expected to be the SVG icon
    ...props
}) => {
    return (
        <button
            className={cn(buttonVariants({ variant, active: isActive }), className)}
            {...props}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-r from-transparent to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out",
                    variant === 'white' && "via-white/10",
                    variant === 'green' && "via-green-400/20",
                    variant === 'indigo' && "via-indigo-400/20",
                    variant === 'red' && "via-red-400/20",
                )}
            />
            <div className="relative z-10 w-7 h-7 flex items-center justify-center">
                {React.cloneElement(children as React.ReactElement, {
                    className: cn(
                        "w-full h-full fill-current transition-colors duration-300",
                        variant === 'white' && "text-white group-hover:text-white/90",
                        variant === 'green' && "text-green-500 group-hover:text-green-400",
                        variant === 'indigo' && "text-indigo-500 group-hover:text-indigo-400",
                        variant === 'red' && "text-red-500 group-hover:text-red-400",
                    )
                })}
            </div>
        </button>
    );
};

export default AmbientButton;
