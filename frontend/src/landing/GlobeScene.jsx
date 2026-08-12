import { ContactShadows, OrbitControls } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils } from 'three'
import Atmosphere from './Atmosphere'
import Earth from './Earth'
import Lighting from './Lighting'
import NetworkLines from './NetworkLines'
import OrbitRings from './OrbitRings'
import Particles from './Particles'
import Stars from './Stars'

function GlobeAssembly() {
  const assemblyRef = useRef()
  const viewport = useThree((state) => state.viewport)
  const scale = MathUtils.clamp(viewport.width / 7.1, 0.72, 1)

  useFrame((state, delta) => {
    if (!assemblyRef.current) return

    assemblyRef.current.rotation.x = MathUtils.damp(assemblyRef.current.rotation.x, state.pointer.y * 0.075, 2.2, delta)
    assemblyRef.current.rotation.y += delta * 0.034
    assemblyRef.current.rotation.z = MathUtils.damp(assemblyRef.current.rotation.z, state.pointer.x * -0.055, 2.2, delta)
  })

  return (
    <group ref={assemblyRef} rotation={[0, -0.64, 0]} scale={scale}>
      <Earth />
      <Atmosphere />
      <NetworkLines />
      <OrbitRings />
      <Particles />
    </group>
  )
}

export default function GlobeScene() {
  return (
    <>
      <Lighting />
      <Stars />
      <GlobeAssembly />
      <ContactShadows blur={2.8} color="#D4A843" far={4.5} frames={1} opacity={0.17} position={[0, -2.5, 0]} resolution={256} scale={6.2} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.22}
        dampingFactor={0.055}
        enableDamping
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI * 0.65}
        minPolarAngle={Math.PI * 0.35}
        rotateSpeed={0.24}
        target={[0, 0, 0]}
      />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.55} luminanceSmoothing={0.7} luminanceThreshold={0.72} mipmapBlur radius={0.6} />
      </EffectComposer>
    </>
  )
}
