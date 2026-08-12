import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr'
import { getAuthToken } from '../utils/authToken'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5016/api'
const hubUrl = `${apiUrl.replace(/\/api\/?$/, '')}/hubs/workflow-monitoring`
const reconnectDelays = [0, 1000, 3000, 8000, 15000, 30000]

class LiveMonitoringClient {
  constructor() {
    this.connection = null
    this.listeners = new Map()
    this.statusListeners = new Set()
    this.state = { status: 'disconnected', diagnostics: null, error: null }
    this.startPromise = null
    this.restartTimer = null
    this.stopTimer = null
  }

  subscribe(handlers, onStatus) {
    clearTimeout(this.stopTimer)
    this.stopTimer = null
    Object.entries(handlers || {}).forEach(([event, handler]) => {
      if (!this.listeners.has(event)) this.listeners.set(event, new Set())
      this.listeners.get(event).add(handler)
    })
    if (onStatus) {
      this.statusListeners.add(onStatus)
      onStatus(this.state)
    }
    this.start()
    return () => {
      Object.entries(handlers || {}).forEach(([event, handler]) => this.listeners.get(event)?.delete(handler))
      if (onStatus) this.statusListeners.delete(onStatus)
      if (!this.hasListeners()) this.scheduleStop()
    }
  }

  hasListeners() {
    return [...this.listeners.values()].some((set) => set.size > 0) || this.statusListeners.size > 0
  }

  emit(event, payload) {
    this.listeners.get(event)?.forEach((handler) => handler(payload))
  }

  setState(next) {
    this.state = { ...this.state, ...next }
    this.statusListeners.forEach((listener) => listener(this.state))
    this.emit('ConnectionStateChanged', this.state)
  }

  buildConnection() {
    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, { accessTokenFactory: () => getAuthToken() || '' })
      .withAutomaticReconnect(reconnectDelays)
      .configureLogging(LogLevel.Warning)
      .build()

    connection.onreconnecting((error) => this.setState({ status: 'reconnecting', error: error?.message || null }))
    connection.onreconnected(async () => {
      this.setState({ status: 'connected', error: null })
      await this.loadDiagnostics()
    })
    connection.onclose((error) => {
      if (this.connection !== connection) return
      this.setState({ status: 'disconnected', error: error?.message || null })
      if (this.hasListeners()) this.scheduleRestart()
    })
    ;['WorkflowStatusChanged', 'WorkflowProgress', 'WorkflowExecutionLog', 'AgentStatusChanged', 'ReviewUpdated', 'DashboardUpdated', 'MonitoringUpdated', 'PresenceChanged', 'ConnectionDiagnostics', 'Notification'].forEach((event) => {
      connection.on(event, (payload) => {
        if (event === 'ConnectionDiagnostics') this.setState({ diagnostics: payload })
        if (event === 'PresenceChanged') this.setState({ diagnostics: { ...(this.state.diagnostics || {}), ...payload } })
        this.emit(event, payload)
      })
    })
    return connection
  }

  async start() {
    clearTimeout(this.stopTimer)
    this.stopTimer = null
    if (this.startPromise || (this.connection?.state === HubConnectionState.Connected)) return this.startPromise
    clearTimeout(this.restartTimer)
    if (this.connection?.state === HubConnectionState.Connecting || this.connection?.state === HubConnectionState.Reconnecting) return this.startPromise
    this.connection ??= this.buildConnection()
    const connection = this.connection
    this.setState({ status: 'connecting', error: null })
    this.startPromise = this.connection.start()
      .then(async () => {
        this.setState({ status: 'connected', error: null })
        await this.loadDiagnostics()
      })
      .catch((error) => {
        if (this.connection === connection) this.connection = null
        this.setState({ status: 'disconnected', error: error?.message || 'Unable to connect.' })
        if (this.hasListeners()) this.scheduleRestart()
      })
      .finally(() => { this.startPromise = null })
    return this.startPromise
  }

  async loadDiagnostics() {
    if (this.connection?.state !== HubConnectionState.Connected) return
    try {
      const diagnostics = await this.connection.invoke('GetConnectionDiagnostics')
      this.setState({ diagnostics })
    } catch (error) {
      this.setState({ error: error?.message || 'Unable to load connection diagnostics.' })
    }
  }

  scheduleRestart() {
    if (this.restartTimer || !this.hasListeners()) return
    this.restartTimer = setTimeout(() => {
      this.restartTimer = null
      this.start()
    }, 5000)
  }

  scheduleStop() {
    if (this.stopTimer) return
    this.stopTimer = setTimeout(() => {
      this.stopTimer = null
      if (!this.hasListeners()) void this.stop()
    }, 250)
  }

  async stop() {
    clearTimeout(this.restartTimer)
    this.restartTimer = null
    clearTimeout(this.stopTimer)
    this.stopTimer = null
    const connection = this.connection
    this.connection = null
    if (connection && connection.state !== HubConnectionState.Disconnected) await connection.stop()
  }
}

export const liveMonitoringClient = new LiveMonitoringClient()
export const createLiveMonitoringConnection = () => liveMonitoringClient
