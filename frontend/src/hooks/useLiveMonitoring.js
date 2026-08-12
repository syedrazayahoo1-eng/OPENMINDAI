import { useEffect, useRef, useState } from 'react'
import { liveMonitoringClient } from '../services/liveMonitoring'

export default function useLiveMonitoring(handlers = {}) {
  const handlersRef = useRef(handlers)
  const [connection, setConnection] = useState({ status: 'disconnected', diagnostics: null, error: null })

  useEffect(() => { handlersRef.current = handlers }, [handlers])
  useEffect(() => liveMonitoringClient.subscribe(
    Object.fromEntries(Object.keys(handlersRef.current).map((event) => [event, (payload) => handlersRef.current[event]?.(payload)])),
    setConnection,
  ), [])

  return connection
}
