import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { DoubleSide, NoColorSpace, SRGBColorSpace, TextureLoader, Vector2 } from 'three'
import earthBumpRoughnessClouds from '../assets/textures/earth-bump-roughness-clouds.jpg'
import earthClouds from '../assets/textures/earth-clouds.png'
import earthDay from '../assets/textures/earth-day.jpg'
import earthNight from '../assets/textures/earth-night.jpg'
import earthNormal from '../assets/textures/earth-normal.jpg'
import { EARTH_RADIUS } from './globeData'

export default function Earth() {
  const cloudsRef = useRef()
  const renderer = useThree((state) => state.gl)
  const [dayMapSource, nightMapSource, normalMapSource, bumpRoughnessMapSource, cloudMapSource] = useLoader(TextureLoader, [
    earthDay,
    earthNight,
    earthNormal,
    earthBumpRoughnessClouds,
    earthClouds,
  ])
  const [dayMap, nightMap, normalMap, bumpRoughnessMap, cloudMap] = useMemo(() => {
    const textures = [
      dayMapSource.clone(),
      nightMapSource.clone(),
      normalMapSource.clone(),
      bumpRoughnessMapSource.clone(),
      cloudMapSource.clone(),
    ]
    const anisotropy = renderer.capabilities.getMaxAnisotropy()

    textures.forEach((texture) => {
      texture.anisotropy = anisotropy
      texture.needsUpdate = true
    })

    textures[0].colorSpace = SRGBColorSpace
    textures[1].colorSpace = SRGBColorSpace
    textures[2].colorSpace = NoColorSpace
    textures[3].colorSpace = NoColorSpace
    textures[4].colorSpace = NoColorSpace

    return textures
  }, [bumpRoughnessMapSource, cloudMapSource, dayMapSource, nightMapSource, normalMapSource, renderer])
  const normalScale = useMemo(() => new Vector2(0.42, 0.42), [])

  useFrame((_, delta) => {
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.012
  })

  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshPhysicalMaterial
          bumpMap={bumpRoughnessMap}
          bumpScale={0.028}
          clearcoat={0.16}
          clearcoatRoughness={0.6}
          emissive="#D4A843"
          emissiveIntensity={0.24}
          emissiveMap={nightMap}
          envMapIntensity={0.42}
          map={dayMap}
          metalness={0.04}
          normalMap={normalMap}
          normalScale={normalScale}
          roughness={0.76}
          roughnessMap={bumpRoughnessMap}
        />
      </mesh>

      <mesh ref={cloudsRef} castShadow rotation={[0, 0.015, 0]}>
        <sphereGeometry args={[EARTH_RADIUS + 0.022, 96, 96]} />
        <meshStandardMaterial
          alphaMap={cloudMap}
          color="#ffffff"
          depthWrite={false}
          map={cloudMap}
          opacity={0.3}
          side={DoubleSide}
          transparent
        />
      </mesh>
    </group>
  )
}
