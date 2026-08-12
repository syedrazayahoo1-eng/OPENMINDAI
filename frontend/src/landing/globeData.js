import { QuadraticBezierCurve3, Vector3 } from 'three'

export const EARTH_RADIUS = 2.16

export const cities = [
  { name: 'New York', latitude: 40.7128, longitude: -74.006 },
  { name: 'London', latitude: 51.5072, longitude: -0.1276 },
  { name: 'Dubai', latitude: 25.2048, longitude: 55.2708 },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
  { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194 },
]

export const networkConnections = [
  ['New York', 'London'],
  ['London', 'Dubai'],
  ['London', 'Bangalore'],
  ['Dubai', 'Singapore'],
  ['Bangalore', 'Singapore'],
  ['Singapore', 'Tokyo'],
  ['Singapore', 'Sydney'],
  ['Tokyo', 'San Francisco'],
  ['San Francisco', 'New York'],
]

export function latitudeLongitudeToVector(latitude, longitude, radius = EARTH_RADIUS) {
  const phi = (90 - latitude) * (Math.PI / 180)
  const theta = (longitude + 180) * (Math.PI / 180)

  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

export function createConnectionCurve(start, end, lift = 0.46) {
  const apex = start
    .clone()
    .add(end)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(EARTH_RADIUS + lift)

  return new QuadraticBezierCurve3(start, apex, end)
}
