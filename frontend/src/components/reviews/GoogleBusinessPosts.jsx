import { useEffect, useState } from 'react'
import { CalendarClock, Download, Edit3, FileImage, FileText, Loader2, RefreshCw, Save, Sparkles } from 'lucide-react'
import { generateGoogleBusinessImage, generateGoogleBusinessPost } from '../../services/googleBusinessService'

const tones = ['Professional', 'Marketing', 'Educational', 'Festival', 'Offer']
const draftKey = 'digitech-google-business-post-draft'
const imageDraftKey = 'digitech-google-business-image-draft'
const emptyPost = { title: '', description: '', callToAction: '', suggestedHashtags: [], suggestedPublishTime: '' }
const imageStyles = ['Modern', 'Editorial', 'Illustrated', 'Seasonal', 'Minimal']
const imageRatios = ['1:1', '4:5', '16:9']

export default function GoogleBusinessPosts() {
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('Professional')
  const [post, setPost] = useState(emptyPost)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageStyle, setImageStyle] = useState('Modern')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [image, setImage] = useState(null)
  const [isImageGenerating, setIsImageGenerating] = useState(false)
  const [imageMessage, setImageMessage] = useState('')
  const [imageError, setImageError] = useState('')

  useEffect(() => {
    const saved = window.localStorage.getItem(draftKey)
    if (saved) {
      try { const draft = JSON.parse(saved); setPrompt(draft.prompt ?? ''); setTone(tones.includes(draft.tone) ? draft.tone : 'Professional'); setPost({ ...emptyPost, ...(draft.post ?? {}) }); setNotice('Saved draft restored.') } catch { window.localStorage.removeItem(draftKey) }
    }
    const savedImage = window.localStorage.getItem(imageDraftKey)
    if (!savedImage) return
    try { const draft = JSON.parse(savedImage); setImagePrompt(draft.prompt ?? ''); setImageStyle(imageStyles.includes(draft.style) ? draft.style : 'Modern'); setAspectRatio(imageRatios.includes(draft.aspectRatio) ? draft.aspectRatio : '1:1'); setImage(draft.image ?? null) } catch { window.localStorage.removeItem(imageDraftKey) }
  }, [])

  async function generate() {
    if (!prompt.trim()) { setError('Enter a post objective before generating.'); return }
    setIsGenerating(true); setError(''); setNotice('')
    try { setPost(await generateGoogleBusinessPost({ prompt: prompt.trim(), tone })); setIsEditing(false) } catch (requestError) { setError(requestError.response?.data?.message ?? 'Could not generate the post. Please try again.') } finally { setIsGenerating(false) }
  }

  function updatePost(field, value) { setPost((current) => ({ ...current, [field]: value })) }
  function saveDraft() { window.localStorage.setItem(draftKey, JSON.stringify({ prompt, tone, post })); setNotice('Draft saved on this device.'); setError('') }
  async function generateImage() {
    if (!imagePrompt.trim()) { setImageError('Enter an image objective before generating.'); return }
    setIsImageGenerating(true); setImageError(''); setImageMessage('')
    try { setImage(await generateGoogleBusinessImage({ prompt: imagePrompt.trim(), style: imageStyle, aspectRatio })) } catch (requestError) { setImageError(requestError.response?.data?.message ?? 'Could not generate the image. Please try again.') } finally { setIsImageGenerating(false) }
  }
  function saveImage() { window.localStorage.setItem(imageDraftKey, JSON.stringify({ prompt: imagePrompt, style: imageStyle, aspectRatio, image })); setImageMessage('Image saved on this device.') }
  const hasPost = Boolean(post.title || post.description)

  return <><section className="dt-reviews-posts" aria-label="Google Business AI Post Generator">
    <div className="dt-reviews-posts-generator">
      <div className="dt-reviews-section-heading"><div><p>GOOGLE BUSINESS</p><h2>AI Post Generator</h2></div><span className="dt-reviews-posts-status"><Sparkles size={14} aria-hidden="true" /> Draft only</span></div>
      <label className="dt-reviews-posts-field">Post objective<textarea maxLength={1200} onChange={(event) => setPrompt(event.target.value)} placeholder="Example: Announce our weekend brunch menu to nearby families." value={prompt} /></label>
      <fieldset className="dt-reviews-posts-tones"><legend>Tone</legend>{tones.map((item) => <button aria-pressed={tone === item} key={item} onClick={() => setTone(item)} type="button">{item}</button>)}</fieldset>
      {error ? <p className="dt-reviews-posts-message is-error">{error}</p> : null}{notice ? <p className="dt-reviews-posts-message">{notice}</p> : null}
      <div className="dt-reviews-posts-actions"><button className="dt-reviews-add-button" disabled={isGenerating} onClick={generate} type="button">{isGenerating ? <Loader2 className="dt-reviews-ai-spin" size={16} aria-hidden="true" /> : <Sparkles size={16} aria-hidden="true" />} Generate Post</button><button className="dt-reviews-date-filter" disabled={isGenerating || !hasPost} onClick={generate} type="button"><RefreshCw size={15} aria-hidden="true" /> Regenerate</button></div>
    </div>
    <article className="dt-reviews-posts-preview"><header><div><p>POST PREVIEW</p><h3>{post.title || 'Your AI-generated post will appear here'}</h3></div><FileText size={19} aria-hidden="true" /></header>
      {hasPost ? <>{isEditing ? <input aria-label="Post title" maxLength={58} onChange={(event) => updatePost('title', event.target.value)} value={post.title} /> : null}{isEditing ? <textarea aria-label="Post description" maxLength={1500} onChange={(event) => updatePost('description', event.target.value)} value={post.description} /> : <p>{post.description}</p>}<div className="dt-reviews-posts-preview-meta"><span>{isEditing ? <input aria-label="Call to action" onChange={(event) => updatePost('callToAction', event.target.value)} value={post.callToAction} /> : post.callToAction}</span><span><CalendarClock size={14} aria-hidden="true" /> {isEditing ? <input aria-label="Suggested publish time" onChange={(event) => updatePost('suggestedPublishTime', event.target.value)} value={post.suggestedPublishTime} /> : post.suggestedPublishTime}</span></div><div className="dt-reviews-posts-tags">{post.suggestedHashtags.map((tag) => <span key={tag}>{tag}</span>)}</div></> : <p className="dt-reviews-posts-empty">Use a clear business objective and a tone to create a ready-to-edit Google Business post.</p>}
      <footer><button className="dt-reviews-date-filter" disabled={!hasPost} onClick={() => setIsEditing((value) => !value)} type="button"><Edit3 size={15} aria-hidden="true" /> {isEditing ? 'Done Editing' : 'Edit'}</button><button className="dt-reviews-publish-button" disabled={!hasPost} onClick={saveDraft} type="button"><Save size={15} aria-hidden="true" /> Save Draft</button></footer>
    </article>
  </section>
  <section className="dt-reviews-image-studio" aria-label="Google Business AI Image Studio">
    <div className="dt-reviews-posts-generator">
      <div className="dt-reviews-section-heading"><div><p>GOOGLE BUSINESS</p><h2>AI Image Studio</h2></div><FileImage size={19} aria-hidden="true" /></div>
      <label className="dt-reviews-posts-field">Image prompt<textarea maxLength={800} onChange={(event) => setImagePrompt(event.target.value)} placeholder="Example: Celebrate a new seasonal menu with a warm, premium local-business visual." value={imagePrompt} /></label>
      <fieldset className="dt-reviews-posts-tones"><legend>Style</legend>{imageStyles.map((item) => <button aria-pressed={imageStyle === item} key={item} onClick={() => setImageStyle(item)} type="button">{item}</button>)}</fieldset>
      <fieldset className="dt-reviews-posts-tones"><legend>Aspect ratio</legend>{imageRatios.map((item) => <button aria-pressed={aspectRatio === item} key={item} onClick={() => setAspectRatio(item)} type="button">{item}</button>)}</fieldset>
      {imageError ? <p className="dt-reviews-posts-message is-error">{imageError}</p> : null}{imageMessage ? <p className="dt-reviews-posts-message">{imageMessage}</p> : null}
      <div className="dt-reviews-posts-actions"><button className="dt-reviews-add-button" disabled={isImageGenerating} onClick={generateImage} type="button">{isImageGenerating ? <Loader2 className="dt-reviews-ai-spin" size={16} aria-hidden="true" /> : <Sparkles size={16} aria-hidden="true" />} Generate Image</button><button className="dt-reviews-date-filter" disabled={isImageGenerating || !image} onClick={generateImage} type="button"><RefreshCw size={15} aria-hidden="true" /> Regenerate</button></div>
    </div>
    <article className="dt-reviews-image-preview"><header><div><p>IMAGE PREVIEW</p><h3>{image ? 'AI-generated business creative' : 'Your generated image will appear here'}</h3></div><FileImage size={19} aria-hidden="true" /></header>{image ? <><img alt={image.promptUsed} src={image.imageUrl} /><p>{image.promptUsed}</p><small>Generated in {image.generationTime}</small></> : <p className="dt-reviews-posts-empty">Set an objective, style and format to create a ready-to-use Google Business visual.</p>}<footer><a className="dt-reviews-date-filter" download="google-business-ai-image.svg" href={image?.imageUrl ?? undefined} onClick={(event) => { if (!image) event.preventDefault() }}><Download size={15} aria-hidden="true" /> Download</a><button className="dt-reviews-publish-button" disabled={!image} onClick={saveImage} type="button"><Save size={15} aria-hidden="true" /> Save</button></footer></article>
  </section></>
}
