import { Download, ImageIcon, LoaderCircle, Palette, RefreshCw, Send, Sparkles, Trash2, WandSparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { deleteGeneratedImage, downloadGeneratedImage, generateImages, getGeneratedImages } from '../services/imageStudioService'
import '../components/images/imageStudio.css'

const categories = ['Restaurant', 'Retail', 'Medical', 'Education', 'Corporate', 'Real Estate', 'Salon', 'Hotel']
const styles = ['Realistic', 'Corporate', 'Luxury', 'Minimal', 'Modern', 'Photorealistic', '3D', 'Flat Design']
const ratios = ['1:1', '16:9', '9:16']
const randomPrompts = ['Create a refined local business campaign celebrating a community milestone.', 'Show a modern customer experience that feels premium and welcoming.', 'Create a confident editorial visual for a business announcement.', 'Design a warm seasonal scene that highlights expert service.']

function Toggle({ checked, label, onChange }) { return <button aria-pressed={checked} className="dt-image-studio-toggle" onClick={() => onChange(!checked)} type="button"><span>{label}</span><i className={checked ? 'is-on' : ''}><b /></i></button> }
function Field({ children, label }) { return <label className="dt-image-studio-field"><span>{label}</span>{children}</label> }

export default function AIImageStudio() {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('Education')
  const [style, setStyle] = useState('Modern')
  const [ratio, setRatio] = useState('1:1')
  const [brandColors, setBrandColors] = useState(true)
  const [brandLogo, setBrandLogo] = useState(false)
  const [includeText, setIncludeText] = useState(true)
  const [variations, setVariations] = useState(false)
  const [images, setImages] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [notice, setNotice] = useState(null)
  const [hasMore, setHasMore] = useState(false)

  const load = async (skip = 0) => { setLoading(true); try { const result = await getGeneratedImages(skip); setImages((current) => skip ? [...current, ...result] : result); setHasMore(result.length === 24); if (!selected && result[0]) setSelected(result[0]) } catch { setNotice({ type: 'error', text: 'Image history could not be loaded.' }) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  const generate = async () => { if (!prompt.trim()) { setNotice({ type: 'error', text: 'Add an image prompt before generating.' }); return } setGenerating(true); setNotice(null); try { const created = await generateImages({ prompt: prompt.trim(), businessCategory: category, style, aspectRatio: ratio, useBrandColors: brandColors, useBrandLogo: brandLogo, includeText, generateVariations: variations }); setImages((current) => [...created, ...current]); setSelected(created[0]); setNotice({ type: 'success', text: `${created.length} AI image${created.length > 1 ? 's are' : ' is'} ready.` }) } catch (error) { setNotice({ type: 'error', text: error.response?.data?.message || 'Image generation is unavailable.' }) } finally { setGenerating(false) } }
  const remove = async (image) => { try { await deleteGeneratedImage(image.id); setImages((current) => current.filter((item) => item.id !== image.id)); if (selected?.id === image.id) setSelected(images.find((item) => item.id !== image.id) || null) } catch { setNotice({ type: 'error', text: 'Image could not be deleted.' }) } }
  const download = async (image) => { try { const blob = await downloadGeneratedImage(image.id); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `digitech-image-${image.id}.svg`; link.click(); URL.revokeObjectURL(url) } catch { setNotice({ type: 'error', text: 'Image download is unavailable.' }) } }
  const applyToPost = (image) => { const hashtags = `${category} ${style}`.split(' ').filter(Boolean).map((item) => `#${item}`).join(' '); window.sessionStorage.setItem('digitech-post-studio-asset', JSON.stringify({ imageUrl: image.imageUrl, prompt: image.prompt, caption: image.prompt, hashtags })); navigate('/marketing/google-business-posts') }
  const previewCaption = useMemo(() => selected ? `Discover a ${selected.style.toLowerCase()} visual direction created for your ${category.toLowerCase()} audience.` : 'Select a generated image to review its Google Business presentation.', [selected, category])

  return <DashboardLayout><main className="dt-image-studio">
    <motion.section animate={{ opacity: 1, y: 0 }} className="dt-image-studio-header" initial={{ opacity: 0, y: 10 }}><div><span><Palette size={15} /> MARKETING</span><h1>AI Image <em>Studio</em></h1><p>Generate polished, on-brand imagery for Google Business Posts and every customer-facing campaign.</p></div><div><Sparkles size={17} /><span><small>BRAND VOICE</small><strong>Applied automatically</strong></span></div></motion.section>
    <section className="dt-image-studio-layout"><aside className="dt-image-studio-panel dt-image-studio-setup"><header><p>IMAGE BRIEF</p><h2>Create visual direction</h2></header><Field label="Image Prompt"><textarea maxLength={800} onChange={(event) => setPrompt(event.target.value)} rows="7" value={prompt} /></Field><Field label="Business Category"><select onChange={(event) => setCategory(event.target.value)} value={category}>{categories.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Image Style"><div className="dt-image-studio-options">{styles.map((item) => <button aria-pressed={style === item} key={item} onClick={() => setStyle(item)} type="button">{item}</button>)}</div></Field><Field label="Aspect Ratio"><div className="dt-image-studio-options is-ratios">{ratios.map((item) => <button aria-pressed={ratio === item} key={item} onClick={() => setRatio(item)} type="button">{item}</button>)}</div></Field><div className="dt-image-studio-toggles"><Toggle checked={brandColors} label="Use Brand Colors" onChange={setBrandColors} /><Toggle checked={brandLogo} label="Use Brand Logo" onChange={setBrandLogo} /><Toggle checked={includeText} label="Include Text" onChange={setIncludeText} /><Toggle checked={variations} label="Generate Variations" onChange={setVariations} /></div><footer><button className="is-primary" disabled={generating} onClick={generate} type="button">{generating ? <LoaderCircle className="dt-image-studio-spin" size={16} /> : <WandSparkles size={16} />}Generate Image</button><button onClick={() => setPrompt(randomPrompts[Math.floor(Math.random() * randomPrompts.length)])} type="button"><RefreshCw size={15} />Random Prompt</button><button onClick={() => { setPrompt(''); setNotice(null) }} type="button">Clear</button></footer></aside>
      <section className="dt-image-studio-panel dt-image-studio-gallery"><header><div><p>GENERATED IMAGES</p><h2>Studio history</h2></div><span>{images.length} assets</span></header>{notice ? <p className={'dt-image-studio-notice is-' + notice.type}>{notice.text}</p> : null}<div className="dt-image-studio-grid">{loading ? Array.from({ length: 8 }, (_, index) => <i className="dt-image-studio-skeleton" key={index} />) : images.map((image) => <article className={selected?.id === image.id ? 'is-selected' : ''} key={image.id}><button aria-label="Preview generated image" onClick={() => setSelected(image)} type="button"><img alt={image.prompt} loading="lazy" src={image.thumbnailUrl} /></button><footer><button onClick={() => download(image)} type="button"><Download size={14} /></button><button onClick={() => setPrompt(image.prompt)} type="button"><RefreshCw size={14} /></button><button onClick={() => applyToPost(image)} type="button"><Send size={14} /></button><button onClick={() => remove(image)} type="button"><Trash2 size={14} /></button></footer></article>)}</div>{!loading && !images.length ? <p className="dt-image-studio-empty">Your generated images will appear here as reusable campaign assets.</p> : null}{hasMore ? <button className="dt-image-studio-more" disabled={loading} onClick={() => load(images.length)} type="button">Load more history</button> : null}</section>
      <aside className="dt-image-studio-panel dt-image-studio-preview"><header><div><p>LIVE PREVIEW</p><h2>Google Business</h2></div></header>{selected ? <><img alt={selected.prompt} src={selected.imageUrl} /><section><div className="dt-image-studio-business"><span>G</span><div><strong>Business Name</strong><small>{brandColors ? 'Brand colors enabled' : 'Custom visual theme'}</small></div></div><h3>Suggested Caption</h3><p>{previewCaption}</p><h3>Suggested Hashtags</h3><small>#{category.replace(' ', '')} #{selected.style.replace(' ', '')} #LocalBusiness</small></section><footer><button onClick={() => applyToPost(selected)} type="button"><Send size={16} />Use In Post</button></footer></> : <div className="dt-image-studio-preview-empty"><ImageIcon size={29} /><span>Choose an image from your studio history.</span></div>}</aside></section>
  </main></DashboardLayout>
}
