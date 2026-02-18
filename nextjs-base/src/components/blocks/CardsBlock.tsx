import React from 'react'
import { Card as CardData, StrapiEntity } from '@/types/strapi'
import { Card } from '@/components/sections/Card'

type CardsBlockProps = {
  cards: (CardData & StrapiEntity)[]
  columns: '1' | '2' | '3' | '4'
  alignment?: 'left' | 'center' | 'right'
}

const CardsBlock = ({ cards, columns, alignment = 'center' }: CardsBlockProps) => {
  const columnClasses = {
    '1': 'grid-cols-1 max-w-3xl mx-auto',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const alignmentClasses = {
    left: 'justify-items-start',
    center: 'justify-items-center',
    right: 'justify-items-end',
  }

  // Add width classes for individual cards based on column count
  const cardWidthClasses = {
    '1': 'w-full',
    '2': 'w-full',
    '3': 'w-full',
    '4': 'w-full',
  }

  return (
    <div className={`grid ${columnClasses[columns]} ${alignmentClasses[alignment]} gap-6 my-8`}>
      {cards.map((card) => (
        <div key={card.id} className={cardWidthClasses[columns]}>
          <Card
            title={card.title}
            subtitle={card.subtitle}
            content={card.content || []}
            image={card.image?.url}
          />
        </div>
      ))}
    </div>
  )
}

export default CardsBlock
