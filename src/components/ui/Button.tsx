'use client';
import React, { forwardRef } from 'react';
import { Link } from '@/lib/router';
import { Loader2Icon } from 'lucide-react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
type Size = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
  secondary: 'bg-surface text-ink border border-line-strong hover:bg-muted shadow-card',
  ghost: 'text-ink-2 hover:bg-muted hover:text-ink',
  danger: 'bg-danger text-white hover:bg-danger-fg',
  accent: 'bg-accent text-white hover:bg-accent-fg'
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-2.5 text-[13px] gap-1.5',
  md: 'h-9 px-3.5 text-sm gap-2',
  lg: 'h-10 px-4 text-sm gap-2',
  icon: 'h-9 w-9',
  'icon-sm': 'h-8 w-8'
};

export function buttonClasses(variant: Variant = 'secondary', size: Size = 'md', className?: string): string {
  return cn(
    'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-md font-medium',
    'transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.98]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1',
    'disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
{ variant = 'secondary', size = 'md', loading, leadingIcon, className, children, disabled, type = 'button', ...rest },
ref)
{
  return (
    <button ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={buttonClasses(variant, size, className)} {...rest}>
      {loading ? <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden /> : leadingIcon}
      {children}
    </button>);

});

interface ButtonLinkProps {
  to: string;
  variant?: Variant;
  size?: Size;
  leadingIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  'aria-label'?: string;
}

export function ButtonLink({ to, variant = 'secondary', size = 'md', leadingIcon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link to={to} className={buttonClasses(variant, size, className)} {...rest}>
      {leadingIcon}
      {children}
    </Link>);

}
