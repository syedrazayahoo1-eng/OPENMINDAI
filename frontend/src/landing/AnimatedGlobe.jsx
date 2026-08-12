import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import GlobeScene from './GlobeScene'

export default function AnimatedGlobe() {
  return (
    <div className="dt2-globe-scene">
      <Canvas
        className="dt2-globe-canvas"
        camera={{ fov: 34, near: 0.1, far: 100, position: [0, 0.08, 8.25] }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          outputColorSpace: SRGBColorSpace,
          powerPreference: 'high-performance',
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
        aria-label="Interactive three-dimensional globe with global intelligence connections"
      >
        <Suspense fallback={null}>
          <GlobeScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
