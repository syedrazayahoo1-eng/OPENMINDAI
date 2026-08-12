import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { cities, createConnectionCurve, EARTH_RADIUS, latitudeLongitudeToVector, networkConnections } from './globeData'

function CityNode({ city, index }) {
  const glowRef = useRef()
  const position = useMemo(
    () => latitudeLongitudeToVector(city.latitude, city.longitude, EARTH_RADIUS + 0.038),
    [city.latitude, city.longitude],
  )

  useFrame(({ clock }) => {
    if (!glowRef.current) return
    const pulse = 1 + Math.sin(clock.getElapsedTime() * 2.35 + index * 0.8) * 0.32
    glowRef.current.scale.setScalar(pulse)
  })

  return (
    <group position={position}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.053, 14, 14]} />
        <meshBasicMaterial color="#F7E2A5" toneMapped={false} />
      </mesh>
      <mesh scale={1.95}>
        <sphereGeometry args={[0.026, 12, 12]} />
        <meshBasicMaterial color="#D4A843" toneMapped={false} transparent opacity={0.32} />
      </mesh>
    </group>
  )
}

function Connection({ source, destination, index }) {
  const travelerRef = useRef()
  const { curve, points } = useMemo(() => {
    const start = latitudeLongitudeToVector(source.latitude, source.longitude, EARTH_RADIUS + 0.046)
    const end = latitudeLongitudeToVector(destination.latitude, destination.longitude, EARTH_RADIUS + 0.046)
    const nextCurve = createConnectionCurve(start, end, 0.38 + (index % 3) * 0.09)

    return {
      curve: nextCurve,
      points: nextCurve.getPoints(58),
    }
  }, [destination.latitude, destination.longitude, index, source.latitude, source.longitude])

  useFrame(({ clock }) => {
    if (!travelerRef.current) return
    const progress = (clock.getElapsedTime() * (0.11 + (index % 2) * 0.018) + index * 0.17) % 1
    const pulse = 0.75 + Math.sin(clock.getElapsedTime() * 3.4 + index) * 0.2

    travelerRef.current.position.copy(curve.getPoint(progress))
    travelerRef.current.scale.setScalar(pulse)
  })

  return (
    <group>
      <Line color="#D4A843" lineWidth={0.72} opacity={0.48} points={points} transparent />
      <mesh ref={travelerRef}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#F7E2A5" toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function NetworkLines() {
  const cityByName = useMemo(() => new Map(cities.map((city) => [city.name, city])), [])

  return (
    <group>
      {networkConnections.map(([sourceName, destinationName], index) => (
        <Connection
          key={`${sourceName}-${destinationName}`}
          destination={cityByName.get(destinationName)}
          index={index}
          source={cityByName.get(sourceName)}
        />
      ))}
      {cities.map((city, index) => <CityNode city={city} index={index} key={city.name} />)}
    </group>
  )
}
