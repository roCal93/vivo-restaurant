import React from 'react'
import { Card as CardData, StrapiEntity } from '@/types/strapi'
import { Card } from '@/components/sections/Card'

type CardsBlockProps = {
  cards: (CardData & StrapiEntity)[]
  columns: '1' | '2' | '3' | '4'
  alignment?: 'left' | 'center' | 'right'
  overlap?: boolean
}

const CardsBlock = ({
  cards,
  columns,
  alignment = 'center',
  overlap = false,
}: CardsBlockProps) => {
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

  if (overlap) {
    return (
      <div className="flex items-center justify-center my-8 px-8">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="relative w-72 md:w-96 lg:w-[28rem] flex-shrink-0 transition-all duration-300 hover:-translate-y-6 hover:scale-105 cursor-pointer"
            style={{
              zIndex: index === 0 ? cards.length : cards.length - index,
              marginLeft: index > 0 ? '-2rem' : '0',
            }}
          >
            <Card
              title={card.title}
              subtitle={card.subtitle}
              content={card.content || []}
              image={card.image}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={`grid ${columnClasses[columns]} ${alignmentClasses[alignment]} gap-6 my-8`}
    >
      {cards.map((card) => (
        <div key={card.id} className={cardWidthClasses[columns]}>
          <Card
            title={card.title}
            subtitle={card.subtitle}
            content={card.content || []}
            image={card.image}
          />
        </div>
      ))}
    </div>
  )
}

export default CardsBlock
