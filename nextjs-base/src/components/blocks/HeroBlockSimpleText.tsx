import React from 'react'

type HeroBlockProps = {
  title?: string
  content: string
  height?: 'medium' | 'large' | 'full'
  textAlignment?: 'left' | 'center' | 'right'
}

const HeroBlockSimpleText = ({
  title,
  content,
  height = 'large',
  textAlignment = 'center',
}: HeroBlockProps) => {
  const heightClasses = {
    medium: 'min-h-[400px] py-16',
    large: 'min-h-[600px] py-24',
    full: 'min-h-screen py-32',
  }

  const textAlignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  return (
    <section className={`${heightClasses[height]} flex items-center justify-center`}>
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className={`flex flex-col ${textAlignmentClasses[textAlignment]} gap-6`}>
          {title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              {title}
            </h1>
          )}
          
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-4xl whitespace-pre-line">
            {content}
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroBlockSimpleText
