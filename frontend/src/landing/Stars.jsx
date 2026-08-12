import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'

function pseudoRandom(seed) {
  const value = Math.sin(seed * 73.156) * 15131.743
  return value - Math.floor(value)
}

export default function Stars() {
  const starsRef = useRef()
  const positions = useMemo(() => {
    const values = new Float32Array(150 * 3)

    for (let index = 0; index < 150; index += 1) {
      const theta = pseudoRandom(index + 19) * Math.PI * 2
      const phi = Math.acos(2 * pseudoRandom(index + 73) - 1)
      const radius = 4.3 + pseudoRandom(index + 127) * 2.7
      const offset = index * 3

      values[offset] = radius * Math.sin(phi) * Math.cos(theta)
      values[offset + 1] = radius * Math.cos(phi)
      values[offset + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }

    return values
  }, [])

  useFrame((_, delta) => {
    if (starsRef.current) starsRef.current.rotation.y += delta * 0.004
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" count={positions.length / 3} />
      </bufferGeometry>
      <pointsMaterial color="#F7E2A5" depthWrite={false} opacity={0.58} size={0.018} sizeAttenuation transparent toneMapped={false} />
    </points>
  )
}
