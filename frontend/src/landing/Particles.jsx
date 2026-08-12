import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'

function seededRandom(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

export default function Particles() {
  const particlesRef = useRef()
  const positions = useMemo(() => {
    const values = new Float32Array(52 * 3)

    for (let index = 0; index < 52; index += 1) {
      const theta = seededRandom(index + 1) * Math.PI * 2
      const phi = Math.acos(2 * seededRandom(index + 31) - 1)
      const radius = 2.52 + seededRandom(index + 57) * 0.86
      const offset = index * 3

      values[offset] = radius * Math.sin(phi) * Math.cos(theta)
      values[offset + 1] = radius * Math.cos(phi)
      values[offset + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }

    return values
  }, [])

  useFrame((_, delta) => {
    if (particlesRef.current) particlesRef.current.rotation.y -= delta * 0.018
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" count={positions.length / 3} />
      </bufferGeometry>
      <pointsMaterial color="#D4A843" depthWrite={false} opacity={0.48} size={0.025} sizeAttenuation transparent toneMapped={false} />
    </points>
  )
}
