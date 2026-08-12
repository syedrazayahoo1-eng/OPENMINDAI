import { AdditiveBlending, BackSide, Color } from 'three'
import { EARTH_RADIUS } from './globeData'

const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const atmosphereFragmentShader = `
  uniform vec3 glowColor;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDirection), 0.0), 2.45);
    gl_FragColor = vec4(glowColor, fresnel * 0.48);
  }
`

export default function Atmosphere() {
  return (
    <mesh scale={1.07}>
      <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
      <shaderMaterial
        blending={AdditiveBlending}
        depthWrite={false}
        fragmentShader={atmosphereFragmentShader}
        side={BackSide}
        transparent
        uniforms={{ glowColor: { value: new Color('#EBCB74') } }}
        vertexShader={atmosphereVertexShader}
      />
    </mesh>
  )
}
