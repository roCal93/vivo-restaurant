'use client'

import React from 'react'
import { formatLegalContent } from '@/lib/format-legal-content'
import { Button } from '@/components/ui/Button'

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

  const formatContent = (text: string) => formatLegalContent(text)

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
    >
      <div
        className="rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-white/20 text-[#EBFFEE]"
        style={{
          background:
            'radial-gradient(43.41% 65.16% at 65.56% 45.02%, #3CB152 0%, #194B23 79.62%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#194B23]/90 border-b border-white/20 p-6 flex items-center justify-between backdrop-blur-sm">
          <h2
            id="policy-modal-title"
            className="text-2xl font-bold text-[#EBFFEE]"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[#EBFFEE] hover:opacity-80 text-3xl leading-none focus:outline-none focus:ring-2 focus:ring-[#EBFFEE] rounded"
            aria-label={`Fermer ${title}`}
          >
            ×
          </button>
        </div>

        <div
          className="p-6 md:p-8 prose prose-invert prose-sm md:prose-base max-w-none [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20"
          dangerouslySetInnerHTML={{ __html: formatContent(content || '') }}
        />

        <div className="sticky bottom-0 bg-[#194B23]/90 border-t border-white/20 p-4 text-center backdrop-blur-sm">
          <Button
            onClick={onClose}
            className="!text-base !leading-normal px-6 py-2"
          >
            {closeButtonText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyModal
