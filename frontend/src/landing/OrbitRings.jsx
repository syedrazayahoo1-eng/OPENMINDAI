import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function OrbitRing({ phase, rotation, speed }) {
  const ringRef = useRef()
  const beaconRef = useRef()

  useFrame(({ clock }, delta) => {
    if (ringRef.current) ringRef.current.rotation.z += delta * speed
    if (beaconRef.current) {
      const position = clock.getElapsedTime() * (0.45 + speed * 6) + phase
      beaconRef.current.position.set(2.74 * Math.cos(position), 2.74 * Math.sin(position), 0)
    }
  })

  return (
    <group ref={ringRef} rotation={rotation}>
      <mesh>
        <torusGeometry args={[2.74, 0.008, 6, 128]} />
        <meshBasicMaterial color="#D4A843" toneMapped={false} transparent opacity={0.42} />
      </mesh>
      <mesh ref={beaconRef}>
        <sphereGeometry args={[0.031, 12, 12]} />
        <meshBasicMaterial color="#F7E2A5" toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function OrbitRings() {
  return (
    <group>
      <OrbitRing phase={0.1} rotation={[1.02, 0.17, 0.18]} speed={0.11} />
      <OrbitRing phase={2.4} rotation={[0.56, -0.82, -0.42]} speed={-0.082} />
      <OrbitRing phase={4.1} rotation={[1.52, 0.32, 0.78]} speed={0.064} />
    </group>
  )
}
