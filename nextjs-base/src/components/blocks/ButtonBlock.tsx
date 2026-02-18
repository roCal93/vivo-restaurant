'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Button as ButtonData } from '@/types/strapi'
import { Button } from '@/components/ui/Button'
import { cleanImageUrl } from '@/lib/strapi'

type ButtonBlockProps = {
  buttons: ButtonData[]
  alignment: 'left' | 'center' | 'right' | 'space-between'
}

const ButtonBlock = ({ buttons, alignment }: ButtonBlockProps) => {
  const pathname = usePathname()
  const segments = pathname?.split('/').filter(Boolean) || []
  const currentLocale = segments[0] || 'fr'

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between',
  }

  return (
    <div className={`flex flex-wrap gap-4 my-6 ${alignmentClasses[alignment]}`}>
      {buttons.map((button, index) => {
        // If file is present, use it; otherwise use URL
        let href = button.file?.url 
          ? cleanImageUrl(button.file.url) || button.url 
          : button.url
        
        // For file downloads, add download attribute
        const isFileDownload = !!button.file?.url
        
        // Check if URL is internal (doesn't start with http:// or https://)
        const isInternalUrl = href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('/')
        
        // Prefix internal URLs with locale
        if (isInternalUrl && !isFileDownload) {
          href = `/${currentLocale}/${href}`
        } else if (href?.startsWith('/') && !href.startsWith(`/${currentLocale}`) && !isFileDownload) {
          // Also handle URLs that start with / but don't have locale
          href = `/${currentLocale}${href}`
        }
        
        return (
          <Button
            key={index}
            href={href}
            variant={button.variant as 'primary' | 'secondary' | 'outline' | 'ghost'}
            target={button.isExternal || isFileDownload ? '_blank' : undefined}
            rel={isFileDownload ? 'noopener noreferrer' : undefined}
          >
            {button.label}
          </Button>
        )
      })}
    </div>
  )
}

export default ButtonBlock
