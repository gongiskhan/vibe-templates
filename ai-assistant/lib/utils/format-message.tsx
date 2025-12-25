import React from 'react'

/**
 * Parse text and convert URLs to clickable links
 * Returns React elements with proper formatting
 */
export function formatMessageContent(content: string): React.ReactNode[] {
  // Regex to match URLs (http, https, and www.)
  const urlRegex = /(https?:\/\/[^\s<>]+|www\.[^\s<>]+)/gi

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let keyIndex = 0

  while ((match = urlRegex.exec(content)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index))
    }

    // Add the URL as a clickable link
    let url = match[0]
    // Ensure URL has protocol
    const href = url.startsWith('http') ? url : `https://${url}`

    parts.push(
      <a
        key={`link-${keyIndex++}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline break-all"
      >
        {url}
      </a>
    )

    lastIndex = match.index + match[0].length
  }

  // Add remaining text after last URL
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [content]
}
