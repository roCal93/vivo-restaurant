import React from 'react'
import * as Blocks from '@/components/blocks'
import { FadeIn } from '@/components/animations/FadeIn'

type BlocksMap = Record<string, React.ComponentType<Record<string, unknown>>>
const TypedBlocks = Blocks as unknown as BlocksMap

type DynamicBlock = { __component?: string } & Record<string, unknown>

type SectionGenericProps = {
  title?: string
  blocks: DynamicBlock[]
  identifier?: string
  spacingTop?: 'none' | 'small' | 'medium' | 'large'
  spacingBottom?: 'none' | 'small' | 'medium' | 'large'
  containerWidth?: 'small' | 'medium' | 'large' | 'full'
}

export const SectionGeneric = ({
  identifier,
  title,
  blocks,
  spacingTop = 'medium',
  spacingBottom = 'medium',
  containerWidth = 'medium',
}: SectionGenericProps) => {
  const normalizeSpacing = (
    value: unknown
  ): 'none' | 'small' | 'medium' | 'large' => {
    const normalized = String(value ?? '')
      .trim()
      .toLowerCase()

    if (normalized === 'none') return 'none'
    if (normalized === 'small') return 'small'
    if (normalized === 'medium') return 'medium'
    if (normalized === 'large') return 'large'

    return 'medium'
  }

  const getContainerWidthClass = (
    width: 'small' | 'medium' | 'large' | 'full'
  ) => {
    switch (width) {
      case 'small':
        return 'max-w-3xl'
      case 'medium':
        return 'max-w-6xl'
      case 'large':
        return 'max-w-7xl'
      case 'full':
        return 'max-w-full'
      default:
        return 'max-w-6xl'
    }
  }
  const renderBlock = (block: DynamicBlock, index: number) => {
    // Try to render a matching React block component from `src/components/blocks`.
    // Component names are generated from Strapi __component like 'blocks.cards-block' -> 'CardsBlock'
    const raw = (block as { __component?: string }).__component ?? ''
    const key = raw.split('.').pop() || raw
    const toPascal = (s: string) =>
      s
        .split('-')
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join('')
    const componentName = toPascal(key)
    const BlockComponent = TypedBlocks[componentName] as
      | React.ComponentType<Record<string, unknown>>
      | undefined

    if (BlockComponent) {
      // Lazy load CarouselBlock if not first block (above-the-fold optimization)
      const isCarousel = componentName === 'CarouselBlock'
      const shouldLazyLoad = isCarousel && index > 0

      if (shouldLazyLoad) {
        return (
          <div key={index} style={{ minHeight: '300px' }}>
            <React.Suspense
              fallback={
                <div className="h-72 bg-gray-100 animate-pulse rounded-lg" />
              }
            >
              <BlockComponent
                {...(block as unknown as Record<string, unknown>)}
              />
            </React.Suspense>
          </div>
        )
      }

      return (
        <BlockComponent
          key={index}
          {...(block as unknown as Record<string, unknown>)}
        />
      )
    }

    // Fallback placeholder (starter)
    return (
      <div
        key={index}
        className="p-4 border-2 border-dashed border-gray-300 rounded-lg"
      >
        <p className="text-gray-500 text-center">
          Block: {block.__component} (placeholder - will be replaced by
          create-hakuna-app)
        </p>
      </div>
    )
  }

  const getTopSpacingClass = (spacingValue: unknown) => {
    const spacing = normalizeSpacing(spacingValue)
    switch (spacing) {
      case 'none':
        return ''
      case 'small':
        return 'mt-12'
      case 'medium':
        return 'mt-24'
      case 'large':
        return 'mt-48'
      default:
        return 'mt-24'
    }
  }

  const getBottomSpacingClass = (spacingValue: unknown) => {
    const spacing = normalizeSpacing(spacingValue)
    switch (spacing) {
      case 'none':
        return ''
      case 'small':
        return 'mb-12'
      case 'medium':
        return 'mb-24'
      case 'large':
        return 'mb-48'
      default:
        return 'mb-24'
    }
  }

  return (
    <section
      id={identifier}
      className={`relative ${getTopSpacingClass(spacingTop)} ${getBottomSpacingClass(spacingBottom)} px-4`}
    >
      <div className={`${getContainerWidthClass(containerWidth)} mx-auto`}>
        {title && (
          <FadeIn>
            <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
          </FadeIn>
        )}
        <div className="space-y-4">
          {blocks?.map((block, index) => renderBlock(block, index))}
        </div>
      </div>
    </section>
  )
}
