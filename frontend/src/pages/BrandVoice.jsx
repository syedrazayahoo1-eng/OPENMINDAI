import { Check, Languages, LoaderCircle, Mail, MessageSquareText, Save, Sparkles, Tag, Volume2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { getBrandVoice, updateBrandVoice } from '../services/brandVoiceService'
import '../components/brandvoice/brandVoice.css'

const blankVoice = {
  id: 0,
  businessName: '',
  businessDescription: '',
  industry: '',
  writingStyle: 'Professional',
  tone: 'Formal',
  emojiEnabled: false,
  replyLength: 'Medium',
  callToActionEnabled: false,
  language: 'English',
  keywords: '',
  audience: '',
}

const writingStyles = ['Professional', 'Friendly', 'Luxury', 'Corporate', 'Casual', 'Modern', 'Premium']
const tones = ['Formal', 'Semi Formal', 'Friendly', 'Energetic', 'Luxury']
const lengths = ['Short', 'Medium', 'Long']
const languages = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Urdu', 'Arabic']
const audiences = ['Students', 'Families', 'Corporate', 'Doctors', 'Retail', 'Restaurants', 'Education']

function humaniseKeywords(keywords) {
  return keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean)
}

function previewCopy(voice) {
  const name = voice.businessName || 'Your business'
  const industry = voice.industry || 'business'
  const audience = voice.audience || 'customers'
  const words = humaniseKeywords(voice.keywords)
  const keywordText = words.length ? ` We are proud to bring ${words.slice(0, 3).join(', ')} to our community.` : ''
  const emoji = voice.emojiEnabled ? ' ✨' : ''
  const cta = voice.callToActionEnabled ? ' We would love to welcome you again.' : ''
  const languageHint = voice.language === 'English' ? '' : ` Written for your ${voice.language}-speaking audience.`

  return {
    review: `Thank you for choosing ${name}. We truly value your feedback and are delighted that your experience reflected the care we bring to every ${industry} interaction.${keywordText}${cta}${emoji}`,
    post: `${name} is creating thoughtful ${industry} experiences for ${audience}.${keywordText}${emoji}`,
    email: `Hello,\n\nThank you for being part of ${name}. Our team is focused on creating an experience that feels considered, consistent and valuable for ${audience}.${cta}${languageHint}\n\nWarm regards,\n${name}`,
  }
}

function Field({ children, label, hint }) {
  return <label className="dt-brand-voice-field"><span>{label}{hint ? <small>{hint}</small> : null}</span>{children}</label>
}

function Switch({ checked, label, onChange }) {
  return <div className="dt-brand-voice-switch-row"><div><strong>{label}</strong><small>{checked ? 'Enabled' : 'Disabled'}</small></div><button aria-pressed={checked} className={'dt-brand-voice-switch' + (checked ? ' is-on' : '')} onClick={() => onChange(!checked)} type="button"><i /></button></div>
}

function PreviewCard({ icon: Icon, label, children }) {
  return <article className="dt-brand-voice-preview-card"><header><span><Icon size={15} /></span><div><small>LIVE PREVIEW</small><strong>{label}</strong></div></header><p>{children}</p></article>
}

export default function BrandVoice() {
  const [voice, setVoice] = useState(blankVoice)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const data = await getBrandVoice()
        if (active) setVoice({ ...blankVoice, ...data })
      } catch {
        if (active) setStatus({ type: 'error', message: 'Brand Voice could not be loaded. Please try again.' })
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const previews = useMemo(() => previewCopy(voice), [voice])
  const keywords = useMemo(() => humaniseKeywords(voice.keywords), [voice.keywords])
  const setValue = (key, value) => setVoice((current) => ({ ...current, [key]: value }))

  const save = async (event) => {
    event.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      const saved = await updateBrandVoice(voice)
      setVoice({ ...blankVoice, ...saved })
      setStatus({ type: 'success', message: 'Brand Voice saved successfully.' })
    } catch {
      setStatus({ type: 'error', message: 'Brand Voice could not be saved. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return <DashboardLayout><main className="dt-brand-voice">
    <motion.section animate={{ opacity: 1, y: 0 }} className="dt-brand-voice-header" initial={{ opacity: 0, y: 10 }} transition={{ duration: 0.32 }}>
      <div className="dt-brand-voice-header-glow" />
      <div className="dt-brand-voice-header-copy"><span><Volume2 size={15} /> GLOBAL BUSINESS SETTING</span><h1>Brand <em>Voice</em></h1><p>Define the language, tone and personality that shape every AI-powered customer interaction.</p></div>
      <div className="dt-brand-voice-header-note"><Sparkles size={17} /><span><small>AI CONSISTENCY</small><strong>Always on-brand</strong></span></div>
    </motion.section>

    <form className="dt-brand-voice-grid" onSubmit={save}>
      <section className="dt-brand-voice-editor" aria-busy={loading}>
        <header className="dt-brand-voice-section-heading"><div><p>BRAND PROFILE</p><h2>Build your business voice</h2></div><span>Changes preview instantly</span></header>
        {loading ? <div className="dt-brand-voice-loading"><LoaderCircle size={22} /> Loading Brand Voice…</div> : <div className="dt-brand-voice-fields">
          <Field label="Business Name"><input onChange={(event) => setValue('businessName', event.target.value)} value={voice.businessName} /></Field>
          <Field label="Industry"><input onChange={(event) => setValue('industry', event.target.value)} value={voice.industry} /></Field>
          <Field label="Business Description"><textarea onChange={(event) => setValue('businessDescription', event.target.value)} rows="4" value={voice.businessDescription} /></Field>
          <Field label="Writing Style"><select onChange={(event) => setValue('writingStyle', event.target.value)} value={voice.writingStyle}>{writingStyles.map((option) => <option key={option}>{option}</option>)}</select></Field>
          <Field label="Tone"><select onChange={(event) => setValue('tone', event.target.value)} value={voice.tone}>{tones.map((option) => <option key={option}>{option}</option>)}</select></Field>
          <Field label="Reply Length"><select onChange={(event) => setValue('replyLength', event.target.value)} value={voice.replyLength}>{lengths.map((option) => <option key={option}>{option}</option>)}</select></Field>
          <Field label="Language"><span className="dt-brand-voice-input-icon"><Languages size={16} /><select onChange={(event) => setValue('language', event.target.value)} value={voice.language}>{languages.map((option) => <option key={option}>{option}</option>)}</select></span></Field>
          <Field label="Target Audience"><select onChange={(event) => setValue('audience', event.target.value)} value={voice.audience}><option value="">Select target audience</option>{audiences.map((option) => <option key={option}>{option}</option>)}</select></Field>
          <Field hint="Separate with commas" label="Brand Keywords"><span className="dt-brand-voice-keyword-input"><Tag size={16} /><input onChange={(event) => setValue('keywords', event.target.value)} value={voice.keywords} /></span>{keywords.length ? <span className="dt-brand-voice-tags">{keywords.map((keyword) => <i key={keyword}>{keyword}</i>)}</span> : null}</Field>
          <div className="dt-brand-voice-switches"><Switch checked={voice.emojiEnabled} label="Emoji Usage" onChange={(value) => setValue('emojiEnabled', value)} /><Switch checked={voice.callToActionEnabled} label="Call To Action" onChange={(value) => setValue('callToActionEnabled', value)} /></div>
        </div>}
        <footer className="dt-brand-voice-save-row"><AnimatePresence>{status ? <motion.p animate={{ opacity: 1, x: 0 }} className={status.type === 'success' ? 'is-success' : 'is-error'} initial={{ opacity: 0, x: -8 }} exit={{ opacity: 0, x: -8 }}><Check size={15} />{status.message}</motion.p> : null}</AnimatePresence><button disabled={loading || saving} type="submit">{saving ? <LoaderCircle className="dt-brand-voice-spin" size={17} /> : <Save size={17} />}{saving ? 'Saving…' : 'Save Brand Voice'}</button></footer>
      </section>

      <aside className="dt-brand-voice-preview" aria-label="Live Brand Voice preview"><header className="dt-brand-voice-section-heading"><div><p>YOUR VOICE IN ACTION</p><h2>Live Preview</h2></div><span className="dt-brand-voice-live"><i /> Live</span></header><div className="dt-brand-voice-preview-list"><PreviewCard icon={MessageSquareText} label="Sample Review Reply">{previews.review}</PreviewCard><PreviewCard icon={Sparkles} label="Sample Google Business Post">{previews.post}</PreviewCard><PreviewCard icon={Mail} label="Sample Marketing Email"><span className="dt-brand-voice-email-copy">{previews.email}</span></PreviewCard></div></aside>
    </form>
  </main></DashboardLayout>
}
