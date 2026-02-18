'use client'

import React, { useState } from 'react'
import type { JSX } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WorkItem, StrapiEntity } from '@/types/strapi'
import { cleanImageUrl } from '@/lib/strapi'

type WorkCardProps = {
  item: WorkItem & StrapiEntity
  layout?: 'grid' | 'masonry' | 'list'
}

// Helper pour render le rich text de Strapi
type RichTextChild = {
  text: string
  bold?: boolean
  italic?: boolean
}

type RichTextBlock = {
  type: 'paragraph' | 'heading' | 'list'
  level?: number
  format?: 'ordered' | 'unordered'
  children?: RichTextChild[] | RichTextBlock[]
}

const renderRichText = (content: RichTextBlock[] | undefined) => {
  if (!content || !Array.isArray(content)) return null
  
  return content.map((block: RichTextBlock, index: number) => {
    if (block.type === 'paragraph') {
      return (
        <p key={index} className="mb-4 text-gray-700">
          {Array.isArray(block.children) &&
            block.children.every(
              (child): child is RichTextChild => typeof (child as RichTextChild).text === 'string'
            ) &&
            (block.children as RichTextChild[]).map((child, childIndex) => {
              if (child.bold) return <strong key={childIndex}>{child.text}</strong>
              if (child.italic) return <em key={childIndex}>{child.text}</em>
              return <span key={childIndex}>{child.text}</span>
            })}
        </p>
      )
    }
    if (block.type === 'heading') {
      const level = block.level || 3
      const Tag = `h${level}` as keyof JSX.IntrinsicElements
      return (
        <Tag key={index} className="font-bold mb-3 mt-6">
          {Array.isArray(block.children) &&
            block.children
              .filter((child): child is RichTextChild => typeof (child as RichTextChild).text === 'string')
              .map((child) => child.text)
              .join('')}
        </Tag>
      )
    }
    if (block.type === 'list') {
      const ListTag = block.format === 'ordered' ? 'ol' : 'ul'
      return (
        <ListTag key={index} className="mb-4 ml-6 list-disc">
          {Array.isArray(block.children) &&
            block.children
              .filter((item): item is RichTextBlock => typeof (item as RichTextBlock).type === 'string')
              .map((item, itemIndex) => (
                <li key={itemIndex}>
                  {Array.isArray(item.children)
                    ? (item.children as RichTextChild[])
                        .map((child) => child.text)
                        .join('')
                    : ''}
                </li>
              ))}
        </ListTag>
      )
    }
    return null
  })
}

const WorkCard = ({ item, layout = 'grid' }: WorkCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const imageUrl = cleanImageUrl(item.image?.url)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsModalOpen(true)
    }
  }

  const renderModal = () => {
    if (!isModalOpen) return null
    return (
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {imageUrl && (
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={imageUrl}
                alt={item.image?.alternativeText || item.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-3xl font-bold">{item.title}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              {item.client && <span>👤 {item.client}</span>}
              {item.year && <span>📅 {item.year}</span>}
            </div>

            {item.categories && item.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {item.categories.map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 text-sm rounded-full"
                    style={{
                      backgroundColor: category.color ? `${category.color}20` : '#f3f4f6',
                      color: category.color || '#6b7280',
                    }}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {item.description && (
              <div className="prose max-w-none mb-6">
                {renderRichText(
                  (item.description as RichTextBlock[])
                    .filter(
                      (block): block is RichTextBlock =>
                        block &&
                        (block.type === 'paragraph' ||
                          block.type === 'heading' ||
                          block.type === 'list')
                    )
                )}
              </div>
            )}

            {item.technologies && typeof item.technologies === 'object' && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.values(item.technologies).map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                    >
                      {String(tech)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.customFields && typeof item.customFields === 'object' && Object.keys(item.customFields).length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Informations complémentaires</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(item.customFields).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium text-gray-700">{key}: </span>
                      <span className="text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.link && (
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir le projet
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderCardContent = (variant: 'list' | 'grid') => (
    <>
      {/* Image */}
      <div
        className={
          variant === 'list'
            ? 'relative w-48 h-48 flex-shrink-0 overflow-hidden rounded-lg'
            : 'relative w-full aspect-[4/3] overflow-hidden'
        }
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.image?.alternativeText || item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes={variant === 'list' ? '192px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        {variant === 'grid' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {item.featured && (
              <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                Featured
              </div>
            )}

          </>
        )}

        {variant === 'list' && item.featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
            ★
          </div>
        )}
      </div>

      {/* Content */}
      <div className={variant === 'list' ? 'flex-1' : 'p-6'}>
        <h3 className={variant === 'list' ? 'text-2xl font-bold group-hover:text-gray-600 transition-colors' : 'text-xl font-bold mb-2 group-hover:text-gray-600 transition-colors'}>
          {item.title}
        </h3>



        {item.shortDescription && (
          <p className={variant === 'list' ? 'text-gray-600 mb-4' : 'text-gray-600 text-sm mb-4 line-clamp-2'}>
            {item.shortDescription}
          </p>
        )}

        {item.categories && item.categories.length > 0 && (
          <div className={variant === 'list' ? 'flex flex-wrap gap-2 mb-4' : 'flex flex-wrap gap-2 mb-4'}>
            {item.categories.map((category) => (
              <span
                key={category.id}
                className={variant === 'list' ? 'px-3 py-1 text-sm rounded-full' : 'px-2 py-1 text-xs rounded-full'}
                style={{
                  backgroundColor: category.color ? `${category.color}20` : '#f3f4f6',
                  color: category.color || '#6b7280',
                }}
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        <div className={variant === 'list' ? 'flex items-center gap-4 text-sm text-gray-500 mb-4' : 'flex items-center justify-between text-xs text-gray-500 mb-4'}>
          {item.client && <span>{variant === 'list' ? `Client: ${item.client}` : item.client}</span>}
          {item.year && <span>{variant === 'list' ? `Année: ${item.year}` : item.year}</span>}
        </div>

        {item.technologies && typeof item.technologies === 'object' && variant === 'grid' && (
          <div className="flex flex-wrap gap-1 mb-4">
            {Object.values(item.technologies).map((tech, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {String(tech)}
              </span>
            ))}
          </div>
        )}

        {item.customFields && typeof item.customFields === 'object' && Object.keys(item.customFields).length > 0 && (
          <div className={variant === 'list' ? 'grid grid-cols-2 gap-2 mb-4' : 'border-t pt-3 mb-4 space-y-1'}>
            {(variant === 'list' ? Object.entries(item.customFields) : Object.entries(item.customFields).slice(0, 3)).map(([key, value]) => (
              <div key={key} className={variant === 'list' ? 'text-sm' : 'text-xs'}>
                <span className="font-medium text-gray-700">{key}: </span>
                <span className="text-gray-600">{String(value)}</span>
              </div>
            ))}
          </div>
        )}

        {item.link && (
          <Link
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Voir plus
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        )}
      </div>
    </>
  )

  // List layout
  if (layout === 'list') {
    return (
      <>
        <div
          onClick={() => setIsModalOpen(true)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`Voir les détails de ${item.title}`}
          className="group flex gap-6 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {renderCardContent('list')}
        </div>
        {renderModal()}
      </>
    )
  }

  // Grid/Masonry layout
  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Voir les détails de ${item.title}`}
        className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {renderCardContent('grid')}
      </div>
      {renderModal()}
    </>
  )
}

export default WorkCard
