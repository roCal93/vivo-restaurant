'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { StrapiBlock } from '@/types/strapi'

type TextBlockProps = {
  content: StrapiBlock[]
  textAlignment?: 'left' | 'center' | 'right' | 'justify'
  blockAlignment?: 'left' | 'center' | 'right' | 'full'
  maxWidth?: 'small' | 'medium' | 'large' | 'full'
}

const TextBlock = ({
  content,
  textAlignment = 'left',
  blockAlignment = 'full',
  maxWidth = 'full',
}: TextBlockProps) => {
  const shouldReduce = useReducedMotion()

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }

  const blockAlignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
    full: 'w-full',
  }

  const maxWidthClasses = {
    small: 'max-w-2xl',
    medium: 'max-w-4xl',
    large: 'max-w-6xl',
    full: 'max-w-none',
  }

  const motionProps = (index: number) => ({
    initial: shouldReduce ? {} : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: shouldReduce
      ? { duration: 0 }
      : { duration: 0.6, delay: index * 0.1, ease: 'easeOut' as const },
  })

  const renderBlocks = (blocks: StrapiBlock[]) => {
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <motion.p
              key={index}
              className={`text-[var(--foreground)] text-lg md:text-xl mb-4 ${alignmentClasses[textAlignment]}`}
              {...motionProps(index)}
            >
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text') {
                  let text = <span key={childIndex}>{child.text}</span>
                  if (child.bold)
                    text = <strong key={childIndex}>{child.text}</strong>
                  if (child.italic)
                    text = <em key={childIndex}>{child.text}</em>
                  if (child.underline)
                    text = <u key={childIndex}>{child.text}</u>
                  return text
                }
                return null
              })}
            </motion.p>
          )
        case 'heading':
          const level = block.level || 2
          const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements
          const headingClasses = {
            1: 'text-4xl font-bold mb-6',
            2: 'text-3xl font-bold mb-5',
            3: 'text-2xl font-bold mb-4',
            4: 'text-xl font-bold mb-3',
            5: 'text-lg font-bold mb-2',
            6: 'text-base font-bold mb-2',
          }
          return (
            <motion.div key={index} {...motionProps(index)}>
              <HeadingTag
                className={`${headingClasses[level as keyof typeof headingClasses]} ${alignmentClasses[textAlignment]}`}
              >
                {block.children?.map((child, childIndex) => {
                  if (child.type === 'text') {
                    return <span key={childIndex}>{child.text}</span>
                  }
                  return null
                })}
              </HeadingTag>
            </motion.div>
          )
        case 'list':
          const ListTag = block.format === 'ordered' ? 'ol' : 'ul'
          const listClass =
            block.format === 'ordered' ? 'list-decimal' : 'list-disc'
          return (
            <motion.div key={index} {...motionProps(index)}>
              <ListTag
                className={`${listClass} ml-6 mb-4 text-[var(--foreground)] ${alignmentClasses[textAlignment]}`}
              >
                {block.children?.map((child, childIndex) => (
                  <li key={childIndex} className="mb-2">
                    {Array.isArray(child.children) &&
                      child.children.map(
                        (grandChild: StrapiBlock, grandChildIndex: number) => {
                          if (grandChild.type === 'text') {
                            return (
                              <span key={grandChildIndex}>
                                {String(grandChild.text || '')}
                              </span>
                            )
                          }
                          return null
                        }
                      )}
                  </li>
                ))}
              </ListTag>
            </motion.div>
          )
        default:
          return null
      }
    })
  }

  return (
    <div
      className={`${blockAlignmentClasses[blockAlignment]} ${maxWidthClasses[maxWidth]}`}
    >
      <div className="prose max-w-none">{renderBlocks(content)}</div>
    </div>
  )
}

export default TextBlock
