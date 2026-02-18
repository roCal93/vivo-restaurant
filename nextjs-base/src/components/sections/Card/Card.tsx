import React from 'react'
import Image from 'next/image'
import { cleanImageUrl } from '@/lib/strapi'
import { StrapiBlock } from '@/types/strapi'

type CardProps = {
  title: string
  subtitle?: string
  content?: StrapiBlock[]
  image?: string
}

export const Card = ({ title, subtitle, content, image }: CardProps) => {
  const cleanImage = cleanImageUrl(image)

  // Fonction pour rendre les blocs Strapi
  const renderBlocks = (blocks: StrapiBlock[]) => {
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index} className="text-gray-600 mb-2 whitespace-pre-line">
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text') {
                  return <span key={childIndex}>{child.text}</span>
                }
                // Gérer d'autres types d'enfants si nécessaire (bold, italic, etc.)
                return null
              })}
            </p>
          )
        case 'heading':
          const level = block.level || 3
          const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements
          return (
            <HeadingTag key={index} className="text-gray-600 mb-2">
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text') {
                  return <span key={childIndex}>{child.text}</span>
                }
                return null
              })}
            </HeadingTag>
          )
        // Ajouter d'autres types de blocs si nécessaire
        default:
          return null
      }
    })
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow p-4 bg-white h-full flex flex-col">
      {cleanImage && (
        <div className="relative w-full h-40 mb-4 flex-shrink-0">
          <Image
            src={cleanImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <h3 className="text-xl font-semibold whitespace-pre-line">{title}</h3>
      {subtitle && (
        <h4 className="text-sm text-gray-700 mt-1 whitespace-pre-line">
          {subtitle}
        </h4>
      )}
      <div className="mt-2 flex-grow">{renderBlocks(content || [])}</div>
    </div>
  )
}
