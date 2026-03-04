import React from 'react'
import Image from 'next/image'

type FooterProps = {
  siteName?: string
}

export const Footer = ({ siteName = 'Hakuna Mataweb' }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="backdrop-blur-sm bg-white/10 border-t-[0.5px] border-gray-200 text-[#EBFFEE] py-8 text-center">
      <div className="space-y-3">
        <p className="text-sm text-[#EBFFEE]">
          {siteName} © {currentYear}. Tous droits réservés.
        </p>
        <p className="text-sm text-[#EBFFEE]">
          Fait avec passion par{' '}
          <a
            href="https://hakuna-mataweb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EBFFEE] hover:underline"
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
            style={{
              transform: 'rotate(21deg)',
              filter: 'invert(94%) sepia(18%) saturate(500%) hue-rotate(75deg)',
            }}
            className="filter transition-opacity"
          />
        </div>
      </div>
    </footer>
  )
}
