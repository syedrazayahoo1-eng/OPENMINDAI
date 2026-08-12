import { CalendarClock, Copy, Download, FileImage, History, ImagePlus, LoaderCircle, Megaphone, RefreshCw, Save, Send, Sparkles, Trash2, WandSparkles, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { generateGoogleBusinessImage } from '../services/googleBusinessService'
import { cancelPost, createPost, deletePost, duplicatePost, generatePost, getBusinessLocations, getPostHistory, publishPost, retryPost, schedulePost, updatePost } from '../services/postStudioService'
import '../components/posts/googleBusinessPostStudio.css'

const postTypes = ['Offer', "What's New", 'Event', 'Product', 'Promotion', 'Educational', 'Festival', 'Announcement']
const audiences = ['Students', 'Families', 'Corporate', 'Doctors', 'Retail', 'Restaurants', 'Education']
const ctas = ['Learn More', 'Call Now', 'Book', 'Order Online', 'Visit Us', 'Sign Up']
const limits = [300, 500, 800, 1200, 1500]
const emptyPost = { id: 0, businessId: 0, postType: 'Offer', prompt: '', title: '', caption: '', imageUrl: '', cta: 'Learn More', hashtags: '', status: 'Draft' }

function Toggle({ checked, label, onChange }) { return <button aria-pressed={checked} className="dt-post-studio-toggle-row" onClick={() => onChange(!checked)} type="button"><span>{label}</span><i className={checked ? 'is-on' : ''}><b /></i></button> }
function SelectField({ children, label }) { return <label className="dt-post-studio-field"><span>{label}</span>{children}</label> }

export default function GoogleBusinessPosts() {
  const [post, setPost] = useState(emptyPost)
  const [audience, setAudience] = useState('')
  const [location, setLocation] = useState('')
  const [limit, setLimit] = useState(1500)
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [generateImage, setGenerateImage] = useState(false)
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [scheduledTime, setScheduledTime] = useState('')
  const [locations, setLocations] = useState([])
  const [scores, setScores] = useState({ seoScore: 0, readabilityScore: 0 })
  const [working, setWorking] = useState('')
  const [notice, setNotice] = useState(null)
  const [history, setHistory] = useState(null)
  const [scheduleModal, setScheduleModal] = useState(false)
  const [minimumScheduleTime] = useState(() => new Date(Date.now() + 60000).toISOString().slice(0, 16))
  const [timeZone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone)
  const fileInput = useRef(null)

  useEffect(() => {
    getBusinessLocations().then(setLocations).catch(() => setLocations([]))
  }, [])

  useEffect(() => {
    const serialized = window.sessionStorage.getItem('digitech-post-studio-asset')
    if (!serialized) return
    try {
      const asset = JSON.parse(serialized)
      setPost((current) => ({ ...current, imageUrl: asset.imageUrl || current.imageUrl, prompt: asset.prompt || current.prompt, caption: asset.caption || current.caption, hashtags: asset.hashtags || current.hashtags }))
    } finally { window.sessionStorage.removeItem('digitech-post-studio-asset') }
  }, [])

  const update = (field, value) => setPost((current) => ({ ...current, [field]: value }))
  const imageObjective = () => [post.prompt, post.title, post.caption].filter(Boolean).join('. ').slice(0, 800)
  const payload = () => ({ businessId: Number(post.businessId) || 0, postType: post.postType, prompt: post.prompt.trim(), title: post.title.trim(), caption: post.caption.trim(), imageUrl: post.imageUrl, cta: post.cta, hashtags: post.hashtags })
  const canGenerate = Boolean(post.prompt.trim())
  const canSave = Boolean(post.prompt.trim() && post.title.trim() && post.caption.trim())

  const makeImage = async () => {
    const prompt = imageObjective()
    if (!prompt) return null
    const image = await generateGoogleBusinessImage({ prompt, style: 'Modern', aspectRatio: '1:1' })
    update('imageUrl', image.imageUrl)
    return image
  }

  const generate = async (improve = false) => {
    if (!canGenerate) { setNotice({ type: 'error', text: 'Add a post objective before generating.' }); return }
    setWorking('generate'); setNotice(null)
    try {
      const generated = await generatePost({ prompt: improve ? `${post.prompt.trim()} Improve clarity, local relevance and conversion while keeping the original intent.` : post.prompt.trim(), postType: post.postType, targetAudience: audience, location, cta: post.cta, characterLimit: limit, includeHashtags })
      setPost((current) => ({ ...current, title: generated.title, caption: generated.caption, cta: generated.cta || current.cta, hashtags: generated.hashtags || '' }))
      setScores({ seoScore: generated.seoScore, readabilityScore: generated.readabilityScore })
      if (generateImage) await makeImage()
      setNotice({ type: 'success', text: 'AI content is ready to review.' })
    } catch (error) { setNotice({ type: 'error', text: error.response?.data?.message || 'Content generation is unavailable.' }) } finally { setWorking('') }
  }

  const saveDraft = async () => {
    if (!canSave) { setNotice({ type: 'error', text: 'Generate or complete title and caption before saving.' }); return }
    setWorking('save'); setNotice(null)
    try { const saved = post.id ? await updatePost(post.id, payload()) : await createPost(payload()); setPost((current) => ({ ...current, ...saved })); setNotice({ type: 'success', text: 'Draft saved to Google Business Posts.' }) } catch (error) { setNotice({ type: 'error', text: error.response?.data?.message || 'Draft could not be saved.' }) } finally { setWorking('') }
  }

  const persist = async () => {
    if (post.id) { const saved = await updatePost(post.id, payload()); setPost((current) => ({ ...current, ...saved })); return saved }
    if (!canSave) throw new Error('Save the generated content before continuing.')
    const saved = await createPost(payload()); setPost((current) => ({ ...current, ...saved })); return saved
  }
  const publish = async () => { setWorking('publish'); setNotice(null); try { const saved = await persist(); const published = await publishPost(saved.id); setPost((current) => ({ ...current, ...published })); setNotice({ type: 'success', text: 'Post published to Google Business Profile.' }) } catch (error) { setNotice({ type: 'error', text: error.response?.data?.message || error.message || 'Post could not be published.' }) } finally { setWorking('') } }
  const schedule = async () => { if (!scheduledTime) { setNotice({ type: 'error', text: 'Choose a future publish time.' }); return } setWorking('schedule'); setNotice(null); try { const saved = await persist(); const scheduled = await schedulePost(saved.id, new Date(scheduledTime).toISOString()); setPost((current) => ({ ...current, ...scheduled })); setNotice({ type: 'success', text: 'Post scheduled successfully.' }) } catch (error) { setNotice({ type: 'error', text: error.response?.data?.message || error.message || 'Post could not be scheduled.' }) } finally { setWorking('') } }
  const viewHistory = async () => { try { setHistory(await getPostHistory()) } catch { setNotice({ type: 'error', text: 'Publishing history could not be loaded.' }) } }
  const duplicate = async () => { if (!post.id) return saveDraft(); try { const copy = await duplicatePost(post.id); setPost(copy); setNotice({ type: 'success', text: 'Post duplicated as a new draft.' }) } catch { setNotice({ type: 'error', text: 'Post could not be duplicated.' }) } }
  const remove = async () => { if (!post.id) { setPost(emptyPost); return } try { await deletePost(post.id); setPost(emptyPost); setNotice({ type: 'success', text: 'Draft deleted.' }) } catch { setNotice({ type: 'error', text: 'Post could not be deleted.' }) } }
  const replaceImage = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => update('imageUrl', String(reader.result)); reader.readAsDataURL(file); event.target.value = '' }

  return <DashboardLayout><main className="dt-post-studio">
    <motion.section animate={{ opacity: 1, y: 0 }} className="dt-post-studio-header" initial={{ opacity: 0, y: 10 }} transition={{ duration: .3 }}><div><span><Megaphone size={15} /> MARKETING</span><h1>Google Business <em>Posts</em></h1><p>Create on-brand content, visual assets, drafts and scheduled Google Business updates in one workspace.</p></div><div className="dt-post-studio-header-status"><Sparkles size={17} /><span><small>BRAND VOICE</small><strong>Applied automatically</strong></span></div></motion.section>
    <section className="dt-post-studio-layout">
      <aside className="dt-post-studio-panel dt-post-studio-controls"><header><p>POST SETUP</p><h2>Creative brief</h2></header><SelectField label="Post Type"><div className="dt-post-studio-type-grid">{postTypes.map((type) => <button aria-pressed={post.postType === type} key={type} onClick={() => update('postType', type)} type="button">{type}</button>)}</div></SelectField><SelectField label="Prompt"><textarea maxLength={1200} onChange={(event) => update('prompt', event.target.value)} rows="7" value={post.prompt} /></SelectField><div className="dt-post-studio-options"><SelectField label="Target Audience"><select onChange={(event) => setAudience(event.target.value)} value={audience}><option value="">All audiences</option>{audiences.map((item) => <option key={item}>{item}</option>)}</select></SelectField><SelectField label="Location"><select onChange={(event) => { const selected = locations.find((item) => String(item.id) === event.target.value); setLocation(selected?.name || ''); update('businessId', selected?.id || 0) }} value={post.businessId || ''}><option value="">All locations</option>{locations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></SelectField><SelectField label="CTA"><select onChange={(event) => update('cta', event.target.value)} value={post.cta}>{ctas.map((item) => <option key={item}>{item}</option>)}</select></SelectField><SelectField label="Character Limit"><select onChange={(event) => setLimit(Number(event.target.value))} value={limit}>{limits.map((item) => <option key={item} value={item}>{item} characters</option>)}</select></SelectField><Toggle checked={generateImage} label="Generate Image" onChange={setGenerateImage} /><Toggle checked={includeHashtags} label="Include Hashtags" onChange={setIncludeHashtags} /><Toggle checked={scheduleEnabled} label="Schedule" onChange={setScheduleEnabled} />{scheduleEnabled ? <SelectField label="Publish Time"><input min={minimumScheduleTime} onChange={(event) => setScheduledTime(event.target.value)} type="datetime-local" value={scheduledTime} /></SelectField> : null}</div></aside>
      <section className="dt-post-studio-panel dt-post-studio-editor"><header><div><p>GENERATED CONTENT</p><h2>Post editor</h2></div><span className={'dt-post-studio-status is-' + post.status.toLowerCase()}>{post.status}</span></header><label className="dt-post-studio-editor-field"><span>Title <small>{post.title.length}/58</small></span><input maxLength={58} onChange={(event) => update('title', event.target.value)} value={post.title} /></label><label className="dt-post-studio-editor-field"><span>Caption <small>{post.caption.length}/{limit}</small></span><textarea maxLength={limit} onChange={(event) => update('caption', event.target.value)} rows="9" value={post.caption} /></label><div className="dt-post-studio-editor-split"><label className="dt-post-studio-editor-field"><span>CTA</span><input maxLength={120} onChange={(event) => update('cta', event.target.value)} value={post.cta} /></label><label className="dt-post-studio-editor-field"><span>Hashtags</span><input maxLength={500} onChange={(event) => update('hashtags', event.target.value)} value={post.hashtags} /></label></div><div className="dt-post-studio-scores"><article><small>SEO SCORE</small><strong>{scores.seoScore || '—'}</strong><i style={{ width: `${scores.seoScore}%` }} /></article><article><small>READABILITY</small><strong>{scores.readabilityScore || '—'}</strong><i style={{ width: `${scores.readabilityScore}%` }} /></article></div>{notice ? <p className={'dt-post-studio-notice is-' + notice.type}>{notice.text}</p> : null}<footer className="dt-post-studio-actions"><button className="is-primary" disabled={Boolean(working)} onClick={() => generate()} type="button">{working === 'generate' ? <LoaderCircle className="dt-post-studio-spin" size={16} /> : <Sparkles size={16} />}Generate</button><button disabled={Boolean(working) || !canGenerate} onClick={() => generate()} type="button"><RefreshCw size={15} />Regenerate</button><button disabled={Boolean(working) || !canGenerate} onClick={() => generate(true)} type="button"><WandSparkles size={15} />Improve</button><button disabled={Boolean(working)} onClick={saveDraft} type="button"><Save size={15} />Save Draft</button><button onClick={duplicate} type="button"><Copy size={15} />Duplicate</button><button onClick={remove} type="button"><Trash2 size={15} />Delete</button><button onClick={viewHistory} type="button"><History size={15} />View History</button></footer></section>
      <aside className="dt-post-studio-panel dt-post-studio-preview"><header><div><p>LIVE GOOGLE PREVIEW</p><h2>Google Business Profile</h2></div><span>{post.caption.length}/{limit}</span></header><article className="dt-post-studio-google-card"><div className="dt-post-studio-google-business"><span>G</span><div><strong>Business Profile</strong><small>Google post</small></div><b>•••</b></div>{post.imageUrl ? <img alt={post.title || 'Google Business post image'} src={post.imageUrl} /> : <div className="dt-post-studio-image-empty"><ImagePlus size={27} /><span>Generate or replace the visual asset</span></div>}<div className="dt-post-studio-google-copy"><h3>{post.title || 'Post title'}</h3><p>{post.caption || 'Generated post content appears here for review before it is shared.'}</p>{post.hashtags ? <small>{post.hashtags}</small> : null}<button type="button">{post.cta || 'Learn More'}</button></div></article><div className="dt-post-studio-image-actions"><button disabled={Boolean(working) || !imageObjective()} onClick={() => { setWorking('image'); makeImage().then(() => setNotice({ type: 'success', text: 'Image generated and added to the post.' })).catch(() => setNotice({ type: 'error', text: 'Image generation is unavailable.' })).finally(() => setWorking('')) }} type="button">{working === 'image' ? <LoaderCircle className="dt-post-studio-spin" size={15} /> : <RefreshCw size={15} />}Regenerate</button><button onClick={() => fileInput.current?.click()} type="button"><FileImage size={15} />Replace</button><a download="google-business-post-image.svg" href={post.imageUrl || undefined} onClick={(event) => { if (!post.imageUrl) event.preventDefault() }}><Download size={15} />Download</a><input accept="image/*" hidden onChange={replaceImage} ref={fileInput} type="file" /></div><footer className="dt-post-studio-publish-actions"><button disabled={Boolean(working)} onClick={publish} type="button">{working === 'publish' ? <LoaderCircle className="dt-post-studio-spin" size={16} /> : <Send size={16} />}Publish Now</button><button disabled={Boolean(working)} onClick={() => setScheduleModal(true)} type="button"><CalendarClock size={16} />Schedule</button></footer></aside>
    </section>
    {scheduleModal ? <div className="dt-post-studio-modal-backdrop"><section className="dt-post-studio-modal"><header><div><p>SCHEDULE PUBLISH</p><h2>Choose publish time</h2></div><button onClick={() => setScheduleModal(false)} type="button"><X size={18} /></button></header><label>Local date and time<input min={minimumScheduleTime} onChange={(event) => setScheduledTime(event.target.value)} type="datetime-local" value={scheduledTime} /></label><label>Timezone<input disabled value={timeZone} /></label><footer><button onClick={() => setScheduleModal(false)} type="button">Cancel</button><button onClick={() => { schedule(); setScheduleModal(false) }} type="button">Confirm Schedule</button></footer></section></div> : null}{history ? <div className="dt-post-studio-modal-backdrop"><section className="dt-post-studio-modal is-history"><header><div><p>PUBLISH HISTORY</p><h2>Delivery activity</h2></div><button onClick={() => setHistory(null)} type="button"><X size={18} /></button></header><div className="dt-post-studio-history">{history.map((item) => <article key={item.id}><div><strong>{item.postTitle}</strong><small>{new Date(item.scheduledTime).toLocaleString()} · {item.publishedBy}</small></div><span>{item.status}</span><small>Retries: {item.retryCount}</small>{item.status === 'Failed' ? <button onClick={() => retryPost(item.googleBusinessPostId).then(() => viewHistory())} type="button">Retry</button> : null}{item.status === 'Scheduled' ? <button onClick={() => cancelPost(item.googleBusinessPostId).then(() => viewHistory())} type="button">Cancel</button> : null}</article>)}</div></section></div> : null}</main></DashboardLayout>
}
