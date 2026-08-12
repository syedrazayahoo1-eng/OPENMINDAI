import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Loader2, Send, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generateReviewReply, getReviewReply, publishReviewReply, saveReviewReplyDraft } from '../../services/reviewservice'
import RatingBadge from './RatingBadge'

const modes = ['Professional', 'Friendly', 'Premium', 'Custom Prompt']

export default function ReplyDrawer({ review, onClose, onRefresh }) {
  const [mode, setMode] = useState('Professional')
  const [reply, setReply] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [showCustomPrompt, setShowCustomPrompt] = useState(false)
  const [state, setState] = useState('idle')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!review) return
    setMode('Professional'); setReply(''); setNotice(''); setState('idle')
    getReviewReply(review.id).then((saved) => { setReply(saved.editedReply || saved.generatedReply || ''); setMode(saved.mode || 'Professional'); setState(saved.status || 'idle') }).catch(() => {})
  }, [review])

  async function generate(selectedMode = mode, prompt = customPrompt) {
    if (!review) return
    if (selectedMode === 'Custom Prompt' && !prompt.trim()) { setNotice('Enter instructions for the AI first.'); return }
    setState('generating'); setNotice('')
    try { const generated = await generateReviewReply(review.id, { mode: selectedMode, customPrompt: prompt }); setMode(selectedMode); setReply(generated.editedReply || generated.generatedReply); setState('Generated'); setShowCustomPrompt(false) } catch (error) { setState('error'); setNotice(error.response?.data?.message || 'Reply generation failed.') }
  }
  async function saveDraft() { if (!review || !reply.trim()) return; setState('saving'); try { const saved = await saveReviewReplyDraft(review.id, { editedReply: reply }); setState(saved.status); setNotice('Draft saved.') } catch { setState('error'); setNotice('Could not save draft.') } }
  async function publish() { if (!review || !reply.trim()) return; setState('publishing'); try { await saveReviewReplyDraft(review.id, { editedReply: reply }); const saved = await publishReviewReply(review.id); setState(saved.status); setNotice(saved.status === 'Queued' ? 'Queued until Google Business OAuth is available.' : 'Posted to Google.'); onRefresh?.() } catch { setState('error'); setNotice('Could not publish the reply.') } }
  async function copy() { await navigator.clipboard.writeText(reply); setNotice('Reply copied.') }

  return <AnimatePresence>{review ? <motion.div className="dt-reviews-drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}><motion.aside className="dt-reviews-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} onMouseDown={(event) => event.stopPropagation()} transition={{ duration: 0.3 }}><header><div><span className={'dt-reviews-drawer-avatar is-' + (review.tone || 'gold')}>{review.initials || review.name?.slice(0, 2)}</span><div><p>AI REPLY STUDIO</p><h2>{review.name || review.customerName}</h2><small>{review.date}</small></div></div><button aria-label="Close reply studio" onClick={onClose} type="button"><X size={20} /></button></header><div className="dt-reviews-drawer-content"><section className="dt-reviews-drawer-summary"><h3>Customer review</h3><RatingBadge rating={review.rating} /><p>{review.review}</p><small>Reply status: {state}</small></section><section><h3>AI Reply Actions</h3><div className="dt-reviews-ai-actions">{modes.map((item) => <button aria-pressed={mode === item} className="dt-reviews-date-filter" key={item} onClick={() => item === 'Custom Prompt' ? setShowCustomPrompt(true) : generate(item)} type="button"><Sparkles size={14} /> {item}</button>)}</div></section><section><h3>Reply editor</h3><textarea className="dt-reviews-studio-editor" onChange={(event) => setReply(event.target.value)} placeholder="Generate an AI reply to begin." value={reply} />{notice ? <p className="dt-reviews-posts-message">{notice}</p> : null}<div className="dt-reviews-ai-actions"><button className="dt-reviews-date-filter" disabled={state === 'generating'} onClick={() => generate()} type="button"><Sparkles size={14} /> Regenerate</button><button className="dt-reviews-date-filter" disabled={!reply} onClick={copy} type="button"><Copy size={14} /> Copy</button><button className="dt-reviews-date-filter" disabled={!reply} onClick={saveDraft} type="button"><Check size={14} /> Save Draft</button><button className="dt-reviews-publish-button" disabled={!reply || state === 'publishing'} onClick={publish} type="button">{state === 'publishing' ? <Loader2 className="dt-reviews-ai-spin" size={14} /> : <Send size={14} />} Post to Google</button></div></section></div></motion.aside>{showCustomPrompt ? <div className="dt-reviews-modal-backdrop" onMouseDown={() => setShowCustomPrompt(false)}><section className="dt-reviews-modal" onMouseDown={(event) => event.stopPropagation()}><header><h2>Custom Prompt</h2><button onClick={() => setShowCustomPrompt(false)} type="button"><X size={18} /></button></header><textarea className="dt-reviews-studio-editor" onChange={(event) => setCustomPrompt(event.target.value)} placeholder="Tell AI how to reply..." value={customPrompt} /><button className="dt-reviews-publish-button" onClick={() => generate('Custom Prompt')} type="button"><Sparkles size={14} /> Generate</button></section></div> : null}</motion.div> : null}</AnimatePresence>
}
