import React from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

type BaseButtonProps = {
  variant?: ButtonVariant
  children: React.ReactNode
  className?: string
}

type ButtonAsButton = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type ButtonAsLink = BaseButtonProps & {
  href: string
  target?: string
  rel?: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const getVariantStyles = (variant: ButtonVariant): string => {
  const styles = {
    primary: 'bg-[#533A8F]/70 text-white hover:bg-[#533A8F]',
    secondary: 'bg-gray-200/70 text-gray-800 hover:bg-gray-200',
    outline: 'border-2 border-[#533A8F] text-[#533A8F] hover:bg-[#533A8F]/10',
    ghost: 'text-[#533A8F] hover:bg-[#533A8F]/10',
  }
  return styles[variant]
}

export const Button = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const base = 'px-6 py-4 rounded-full font-medium transition-all inline-flex items-center justify-center gap-2 backdrop-blur-[25.73px] shadow-[inset_12.87px_-12.87px_12.87px_0px_rgba(63,44,109,0.182),inset_-12.87px_12.87px_12.87px_0px_rgba(255,255,255,0.182)]'
  const variantStyles = getVariantStyles(variant)
  const classes = `${base} ${variantStyles} ${className}`

  if ('href' in props && props.href) {
    const { href, target, rel, ...linkProps } = props
    const isExternal = target === '_blank' || href.startsWith('http')
    
    return (
      <Link
        href={href}
        target={target}
        rel={rel || (isExternal ? 'noopener noreferrer' : undefined)}
        className={classes}
        {...linkProps}
      >
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
