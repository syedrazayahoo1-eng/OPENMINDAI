import { Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import WorkflowPropertiesPanel from './WorkflowPropertiesPanel'

const nodeAccent = { Triggers: '#c8972f', AI: '#7659b5', Logic: '#287b75', Actions: '#276aa8' }
const nodeWidth = 152
const nodeHeight = 64

export default function WorkflowCanvas({ definition, onChange }) {
  const canvasRef = useRef(null)
  const interaction = useRef(null)
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 })
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [selectedConnectionId, setSelectedConnectionId] = useState(null)
  const [draftConnection, setDraftConnection] = useState(null)
  const [hoveredConnectionId, setHoveredConnectionId] = useState(null)
  const [isPanning, setIsPanning] = useState(false)

  useEffect(() => {
    if (!definition) return
    setNodes((definition.nodes || []).map((node) => ({ id: node.id, category: node.type, name: node.properties?.name || node.type, config: node.properties || {}, x: node.position?.x ?? 0, y: node.position?.y ?? 0 })))
    setConnections((definition.edges || []).map((edge) => ({ id: edge.id, sourceId: edge.source, targetId: edge.target })))
    setSelectedId(null)
    setSelectedConnectionId(null)
  }, [JSON.stringify(definition || {})])

  useEffect(() => {
    onChange?.({ nodes: nodes.map((node) => ({ id: node.id, type: node.category, position: { x: node.x, y: node.y }, properties: { ...node.config, name: node.name } })), edges: connections.map((connection) => ({ id: connection.id, source: connection.sourceId, target: connection.targetId })) })
  }, [nodes, connections, onChange])

  const flowPoint = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: (clientX - rect.left - viewport.x) / viewport.zoom, y: (clientY - rect.top - viewport.y) / viewport.zoom }
  }
  const canvasPoint = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: clientX - rect.left, y: clientY - rect.top }
  }
  const connectorPoint = (node, side) => ({ x: node.x * viewport.zoom + viewport.x + (side === 'output' ? nodeWidth * viewport.zoom : 0), y: node.y * viewport.zoom + viewport.y + nodeHeight * viewport.zoom / 2 })
  const pathFor = (from, to) => {
    const bend = Math.max(56, Math.abs(to.x - from.x) * .5)
    return `M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${to.x - bend} ${to.y}, ${to.x} ${to.y}`
  }
  const onWheel = (event) => {
    event.preventDefault()
    setViewport((current) => ({ ...current, zoom: Math.min(1.8, Math.max(0.5, current.zoom - event.deltaY * 0.001)) }))
  }
  const onPointerDown = (event) => {
    if (event.target !== event.currentTarget) return
    setSelectedId(null)
    setSelectedConnectionId(null)
    interaction.current = { type: 'pan', x: event.clientX, y: event.clientY }
    setIsPanning(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onNodePointerDown = (event, id) => {
    event.stopPropagation()
    setSelectedId(id)
    setSelectedConnectionId(null)
    const node = nodes.find((item) => item.id === id)
    const point = flowPoint(event.clientX, event.clientY)
    interaction.current = { type: 'move', id, offsetX: point.x - node.x, offsetY: point.y - node.y }
    canvasRef.current.setPointerCapture(event.pointerId)
  }
  const onOutputPointerDown = (event, sourceId) => {
    event.preventDefault()
    event.stopPropagation()
    setSelectedId(sourceId)
    setSelectedConnectionId(null)
    interaction.current = { type: 'connect', sourceId }
    setDraftConnection({ sourceId, point: canvasPoint(event.clientX, event.clientY) })
  }
  const connectToInput = (event, targetId) => {
    const current = interaction.current
    if (!current || current.type !== 'connect' || current.sourceId === targetId) return
    event.preventDefault()
    event.stopPropagation()
    const sourceId = current.sourceId
    setConnections((items) => items.some((item) => item.sourceId === sourceId && item.targetId === targetId) ? items : [...items, { id: crypto.randomUUID(), sourceId, targetId }])
    interaction.current = null
    setDraftConnection(null)
  }
  const onPointerMove = (event) => {
    const current = interaction.current
    if (!current) return
    if (current.type === 'pan') {
      const deltaX = event.clientX - current.x
      const deltaY = event.clientY - current.y
      setViewport((value) => ({ ...value, x: value.x + deltaX, y: value.y + deltaY }))
      interaction.current = { ...current, x: event.clientX, y: event.clientY }
      return
    }
    if (current.type === 'connect') {
      setDraftConnection({ sourceId: current.sourceId, point: canvasPoint(event.clientX, event.clientY) })
      return
    }
    const point = flowPoint(event.clientX, event.clientY)
    setNodes((items) => items.map((node) => node.id === current.id ? { ...node, x: point.x - current.offsetX, y: point.y - current.offsetY } : node))
  }
  const finishInteraction = () => {
    interaction.current = null
    setIsPanning(false)
    setDraftConnection(null)
  }
  const onDrop = (event) => {
    event.preventDefault()
    const rawNode = event.dataTransfer.getData('application/workflow-node')
    if (!rawNode) return
    try {
      const source = JSON.parse(rawNode)
      const point = flowPoint(event.clientX, event.clientY)
      const node = { id: crypto.randomUUID(), ...source, config: { name: source.name, enabled: true, temperature: .7 }, x: point.x - 76, y: point.y - 32 }
      setNodes((items) => [...items, node])
      setSelectedId(node.id)
    } catch { finishInteraction() }
  }
  const removeSelected = () => {
    if (selectedConnectionId) {
      setConnections((items) => items.filter((connection) => connection.id !== selectedConnectionId))
      setSelectedConnectionId(null)
      return
    }
    if (!selectedId) return
    setNodes((items) => items.filter((node) => node.id !== selectedId))
    setConnections((items) => items.filter((connection) => connection.sourceId !== selectedId && connection.targetId !== selectedId))
    setSelectedId(null)
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && (selectedId || selectedConnectionId)) {
        event.preventDefault()
        removeSelected()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedId, selectedConnectionId, connections])

  const center = () => setViewport({ x: 0, y: 0, zoom: 1 })
  const nodeById = (id) => nodes.find((node) => node.id === id)
  const saveNode = ({ name, config }) => setNodes((items) => items.map((node) => node.id === selectedId ? { ...node, name, config } : node))
  return <section aria-label="Workflow canvas" onDragOver={(event) => event.preventDefault()} onDrop={onDrop} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={finishInteraction} onPointerLeave={finishInteraction} onWheel={onWheel} ref={canvasRef} style={{ position: 'relative', minHeight: 'calc(100dvh - 10rem)', overflow: 'hidden', touchAction: 'none', border: '1px solid rgba(11,23,51,.1)', borderRadius: '1.35rem', background: 'radial-gradient(circle, rgba(200,151,47,.19) 1px, transparent 1px)', backgroundSize: `${24 * viewport.zoom}px ${24 * viewport.zoom}px`, backgroundPosition: `${viewport.x}px ${viewport.y}px`, cursor: isPanning ? 'grabbing' : 'grab' }}>
    {nodes.length === 0 && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}><div style={{ padding: '1.2rem 1.6rem', border: '1px dashed rgba(200,151,47,.5)', borderRadius: '1rem', background: 'rgba(255,253,249,.84)', color: '#0b1733', fontWeight: 750 }}>Drop nodes here to build workflow</div></div>}
    <svg aria-label="Workflow connections" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 3, overflow: 'visible', pointerEvents: 'none' }}>{connections.map((connection) => {
      const source = nodeById(connection.sourceId)
      const target = nodeById(connection.targetId)
      if (!source || !target) return null
      const active = selectedConnectionId === connection.id || hoveredConnectionId === connection.id
      return <path d={pathFor(connectorPoint(source, 'output'), connectorPoint(target, 'input'))} fill="none" key={connection.id} onClick={(event) => { event.stopPropagation(); setSelectedConnectionId(connection.id); setSelectedId(null) }} onMouseEnter={() => setHoveredConnectionId(connection.id)} onMouseLeave={() => setHoveredConnectionId(null)} stroke={active ? '#c8972f' : 'rgba(11,23,51,.58)'} strokeLinecap="round" strokeWidth={active ? 4 : 3} style={{ cursor: 'pointer', pointerEvents: 'stroke', transition: 'stroke 180ms ease, stroke-width 180ms ease' }} />
    })}{draftConnection && nodeById(draftConnection.sourceId) && <path d={pathFor(connectorPoint(nodeById(draftConnection.sourceId), 'output'), draftConnection.point)} fill="none" stroke="#c8972f" strokeDasharray="7 6" strokeLinecap="round" strokeWidth="3" />}</svg>
    {nodes.map((node) => <div aria-label={`${node.name} workflow node`} key={node.id} onClick={(event) => { event.stopPropagation(); setSelectedId(node.id); setSelectedConnectionId(null) }} onKeyDown={(event) => { if (event.key === 'Enter') setSelectedId(node.id) }} onPointerDown={(event) => onNodePointerDown(event, node.id)} role="button" style={{ position: 'absolute', left: `${node.x * viewport.zoom + viewport.x}px`, top: `${node.y * viewport.zoom + viewport.y}px`, zIndex: selectedId === node.id ? 5 : 4, width: `${nodeWidth * viewport.zoom}px`, minHeight: `${nodeHeight * viewport.zoom}px`, padding: `${.7 * viewport.zoom}rem`, border: selectedId === node.id ? `2px solid ${nodeAccent[node.category]}` : '1px solid rgba(11,23,51,.15)', borderRadius: `${.8 * viewport.zoom}rem`, background: 'rgba(255,253,249,.97)', boxShadow: selectedId === node.id ? '0 12px 26px rgba(11,23,51,.16)' : '0 7px 18px rgba(11,23,51,.09)', color: '#0b1733', cursor: 'grab', fontFamily: 'inherit', textAlign: 'left', transition: 'box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease' }} tabIndex="0"><button aria-label={`Connect to ${node.name}`} onPointerDown={(event) => { event.stopPropagation() }} onPointerUp={(event) => connectToInput(event, node.id)} style={{ position: 'absolute', left: `${-7 * viewport.zoom}px`, top: '50%', width: `${14 * viewport.zoom}px`, height: `${14 * viewport.zoom}px`, transform: 'translateY(-50%)', border: `3px solid ${nodeAccent[node.category]}`, borderRadius: '50%', background: '#fffdfa', cursor: 'crosshair', padding: 0 }} type="button" /><span style={{ display: 'block', marginBottom: '.3rem', color: nodeAccent[node.category], fontSize: `${.66 * viewport.zoom}rem`, fontWeight: 850, letterSpacing: '.08em' }}>{node.category.toUpperCase()}</span><strong style={{ fontSize: `${.86 * viewport.zoom}rem` }}>{node.name}</strong><button aria-label={`Create connection from ${node.name}`} onPointerDown={(event) => onOutputPointerDown(event, node.id)} style={{ position: 'absolute', right: `${-7 * viewport.zoom}px`, top: '50%', width: `${14 * viewport.zoom}px`, height: `${14 * viewport.zoom}px`, transform: 'translateY(-50%)', border: `3px solid ${nodeAccent[node.category]}`, borderRadius: '50%', background: nodeAccent[node.category], cursor: 'crosshair', padding: 0 }} type="button" /></div>)}
    {(selectedId || selectedConnectionId) && <button aria-label="Delete selected item" onClick={removeSelected} style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 7, display: 'inline-flex', alignItems: 'center', gap: '.4rem', border: '1px solid rgba(11,23,51,.12)', borderRadius: '.65rem', background: '#fffdfa', color: '#a63838', cursor: 'pointer', padding: '.55rem .75rem', fontWeight: 750 }} type="button"><Trash2 size={16} /> Delete</button>}
    {selectedId && nodeById(selectedId) && <WorkflowPropertiesPanel node={nodeById(selectedId)} onClose={() => setSelectedId(null)} onSave={saveNode} />}
    <div style={{ position: 'absolute', right: '1rem', bottom: '1rem', zIndex: 7, display: 'flex', gap: '.45rem' }}><button aria-label="Zoom in" onClick={() => setViewport((current) => ({ ...current, zoom: Math.min(1.8, current.zoom + .1) }))} type="button">+</button><button aria-label="Zoom out" onClick={() => setViewport((current) => ({ ...current, zoom: Math.max(.5, current.zoom - .1) }))} type="button">−</button><button onClick={center} type="button">Center</button></div>
  </section>
}
