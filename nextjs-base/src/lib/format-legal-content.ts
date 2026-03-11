export function formatLegalContent(text: string): string {
  if (!text) return ''

  return (
    text
      // Convert "##" headings
      .replace(
        /^## (.+?)$/gm,
        '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>'
      )
      // Convert "###" headings
      .replace(
        /^### (.+?)$/gm,
        '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>'
      )
      // Convert bold markdown
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Convert plain URLs into links
      .replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="underline break-words">$1</a>'
      )
      // Convert bullet list items
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      // Wrap list items in <ul>
      .replace(
        /(<li class="ml-4">.*?<\/li>\n?)+/g,
        '<ul class="list-disc list-outside mb-4 space-y-2">$&</ul>'
      )
      // Convert paragraph breaks
      .replace(/\n\n+/g, '</p><p class="mb-4 leading-relaxed">')
      // Add first and last paragraph tags
      .replace(/^(.+)/, '<p class="mb-4 leading-relaxed">$1')
      .replace(/(.+)$/, '$1</p>')
      // Clean paragraphs wrapping headings
      .replace(/<p class="[^"]*">(<h[23][^>]*>.*?<\/h[23]>)<\/p>/g, '$1')
      .replace(/<p class="[^"]*"><\/p>/g, '')
  )
}
