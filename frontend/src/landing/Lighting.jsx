import { Environment } from '@react-three/drei'
import studioEnvironment from '../assets/textures/studio-small-02.hdr?url'

export default function Lighting() {
  return (
    <>
      <ambientLight color="#FFF8E7" intensity={0.46} />
      <hemisphereLight args={['#FFF8E7', '#342618', 1.15]} />
      <directionalLight castShadow color="#FFF1C7" intensity={2.15} position={[4.8, 4.2, 5.6]} shadow-bias={-0.0004} />
      <directionalLight color="#D4A843" intensity={0.52} position={[-4, -1.5, 3]} />
      <Environment background={false} files={studioEnvironment} />
    </>
  )
}
