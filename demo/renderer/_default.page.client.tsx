import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

export const clientRouting = true
export const hydrationCanBeAborted = true

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function render(pageContext: any) {
  const { Page, pageProps } = pageContext
  const container = document.getElementById('root')!
  const hasSSRContent = container.hasChildNodes() // ← key

  if (hasSSRContent) {
    hydrateRoot(container, <Page {...pageProps} />)
  } else {
    createRoot(container).render(<Page {...pageProps} />)
  }
}
