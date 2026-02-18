import React from 'react'
import Image from 'next/image'

type FooterProps = {
  siteName?: string
}

export const Footer = ({ siteName = 'Hakuna Mataweb' }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-8 text-center">
      <div className="space-y-3">
        <p className="text-sm">
          {siteName} © {currentYear}. Tous droits réservés.
        </p>
        <p className="text-sm text-gray-400">
          Fait avec passion par{' '}
          <a 
            href="https://hakuna-mataweb.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:underline"
          >
            Hakuna Mataweb
          </a>
        </p>
        <div className="flex justify-center mt-4">
          <Image
            src="/images/hakuna-mataweb-logo.svg"
            alt="Logo Hakuna Mataweb"
            width={30}
            height={25}
            style={{ transform: 'rotate(21deg)' }}
            className="opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </footer>
  )
}
