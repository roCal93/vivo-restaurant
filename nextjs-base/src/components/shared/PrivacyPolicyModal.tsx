'use client'

import React from 'react'

type PrivacyPolicyModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  content?: string
  closeButtonText?: string
}

const PrivacyPolicyModal = ({
  isOpen,
  onClose,
  title,
  content,
  closeButtonText,
}: PrivacyPolicyModalProps) => {
  if (!isOpen) return null

  // Fonction pour convertir le contenu markdown simple en HTML
  const formatContent = (text: string) => {
    if (!text) return ''

    return (
      text
        // Convertir ## en <h2>
        .replace(
          /^## (.+?)$/gm,
          '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900">$1</h2>'
        )
        // Convertir ### en <h3>
        .replace(
          /^### (.+?)$/gm,
          '<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-800">$1</h3>'
        )
        // Convertir ** en <strong>
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        // Convertir les URLs en liens
        .replace(
          /(https?:\/\/[^\s]+)/g,
          '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#F88379] underline hover:text-[#e67369] break-words">$1</a>'
        )
        // Convertir les listes à puces (- item)
        .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
        // Entourer les <li> de <ul>
        .replace(
          /(<li class="ml-4">.*?<\/li>\n?)+/g,
          '<ul class="list-disc list-outside mb-4 space-y-2 text-gray-700">$&</ul>'
        )
        // Convertir les doubles sauts de ligne en paragraphes
        .replace(/\n\n+/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
        // Ajouter les balises <p> de début et fin
        .replace(/^(.+)/, '<p class="mb-4 text-gray-700 leading-relaxed">$1')
        .replace(/(.+)$/, '$1</p>')
        // Nettoyer les <p> vides et ceux qui contiennent déjà des titres
        .replace(/<p class="[^"]*">(<h[23][^>]*>.*?<\/h[23]>)<\/p>/g, '$1')
        .replace(/<p class="[^"]*"><\/p>/g, '')
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2
            id="policy-modal-title"
            className="text-2xl font-bold text-gray-900"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none focus:outline-none focus:ring-2 focus:ring-[#F88379] rounded"
            aria-label={`Fermer ${title}`}
          >
            ×
          </button>
        </div>

        <div
          className="p-6 md:p-8 prose prose-sm md:prose-base max-w-none [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20"
          dangerouslySetInnerHTML={{ __html: formatContent(content || '') }}
        />

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#F88379] text-white rounded-full hover:bg-[#e67369] transition-colors focus:outline-none focus:ring-2 focus:ring-[#F88379] focus:ring-offset-2"
          >
            {closeButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyModal
