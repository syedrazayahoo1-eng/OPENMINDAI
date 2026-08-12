import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Moon, Send, Sparkles, Square, Sun, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import MarkdownMessage from '../components/chat/MarkdownMessage'
import '../components/chat/chat.css'
import useChatStream from '../hooks/useChatStream'
import DashboardLayout from '../layouts/DashboardLayout'

// How close to the bottom (in pixels) the user has to be scrolled for new
// messages to auto-scroll the view. If they've scrolled up to read earlier
// history, we don't yank them back down.
const AUTO_SCROLL_THRESHOLD = 120

function ChatMessageRow({ message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`dt-chat-row ${isUser ? 'is-user' : 'is-assistant'} ${message.isError ? 'is-error' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <span className="dt-chat-avatar" aria-hidden="true">
        {isUser ? <User size={15} strokeWidth={2} /> : <Bot size={15} strokeWidth={2} />}
      </span>

      <div className="dt-chat-bubble">
        {isUser ? (
          <p className="dt-chat-paragraph">{message.content}</p>
        ) : message.content ? (
          <>
            <MarkdownMessage content={message.content} />
            {message.isStreaming ? <span className="dt-chat-cursor" aria-hidden="true" /> : null}
          </>
        ) : (
          <span className="dt-chat-loading-dots" aria-label="Assistant is typing">
            <span />
            <span />
            <span />
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function Chat() {
  const { messages, isStreaming, error, sendMessage, stop } = useChatStream()
  const [draft, setDraft] = useState('')
  const [theme, setTheme] = useState('dark')

  const messagesRef = useRef(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  // Auto-scroll to the newest content, but only if the user is already near
  // the bottom (so reading older messages isn't interrupted).
  useEffect(() => {
    const container = messagesRef.current
    if (!container) return

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight

    if (distanceFromBottom < AUTO_SCROLL_THRESHOLD) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])

  // Auto-grow the textarea up to the CSS max-height, then let it scroll.
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [draft])

  const handleSubmit = () => {
    if (isStreaming) return
    const value = draft
    setDraft('')
    sendMessage(value)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
    // Shift+Enter falls through to the textarea's default behavior (newline).
  }

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return (
    <DashboardLayout>
      <div className="dt-chat-page" data-theme={theme}>
        <header className="dt-chat-header">
          <div className="dt-chat-header-title">
            <span className="dt-chat-header-icon" aria-hidden="true">
              <Sparkles size={18} strokeWidth={1.9} />
            </span>
            <div>
              <h1>LocalMind AI Assistant</h1>
              <p>Ask anything — responses stream in as they're generated.</p>
            </div>
          </div>

          <div className="dt-chat-header-actions">
            <button
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="dt-chat-icon-btn"
              onClick={toggleTheme}
              type="button"
            >
              {theme === 'dark' ? <Sun size={16} strokeWidth={1.9} /> : <Moon size={16} strokeWidth={1.9} />}
            </button>
          </div>
        </header>

        <div className="dt-chat-messages" ref={messagesRef}>
          {messages.length === 0 ? (
            <div className="dt-chat-empty-state">
              <span aria-hidden="true">
                <Bot size={22} strokeWidth={1.8} />
              </span>
              <h2>Start a conversation</h2>
              <p>Ask a question, brainstorm an idea, or paste something you'd like explained. Your assistant is ready.</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <ChatMessageRow key={message.id} message={message} />
              ))}
            </AnimatePresence>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="dt-chat-composer">
          {error ? (
            <p className="dt-chat-error-banner" role="alert">
              {error}
            </p>
          ) : null}

          <div className="dt-chat-composer-shell">
            <textarea
              className="dt-chat-textarea"
              disabled={isStreaming}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message LocalMind AI…"
              ref={textareaRef}
              rows={1}
              value={draft}
            />

            {isStreaming ? (
              <button aria-label="Stop generating" className="dt-chat-stop-btn" onClick={stop} type="button">
                <Square size={15} strokeWidth={2.2} fill="currentColor" />
              </button>
            ) : (
              <button
                aria-label="Send message"
                className="dt-chat-send-btn"
                disabled={!draft.trim()}
                onClick={handleSubmit}
                type="button"
              >
                <Send size={16} strokeWidth={2.1} />
              </button>
            )}
          </div>

          <p className="dt-chat-hint">Enter to send · Shift+Enter for a new line</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
