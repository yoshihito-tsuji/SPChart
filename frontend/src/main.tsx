import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LanguageProvider } from './i18n/LanguageContext'
import { logger } from './utils/logger'

// グローバルエラーハンドラー
window.addEventListener('error', (event) => {
  logger.error('未捕捉エラー', event.error, {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  })
})

window.addEventListener('unhandledrejection', (event) => {
  logger.error('未処理のPromise拒否', event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
    reason: String(event.reason),
  })
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </LanguageProvider>
  </StrictMode>,
)
