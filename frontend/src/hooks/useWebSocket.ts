import { useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8082/ws-event-management'

type MessageHandler = (payload: any) => void

interface UseWebSocketOptions {
  topic: string           // e.g. '/topic/organizer/42/stats'
  onMessage: MessageHandler
  enabled?: boolean       // default true — set to false to skip connection
}

export const useWebSocket = ({ topic, onMessage, enabled = true }: UseWebSocketOptions) => {
  const clientRef = useRef<Client | null>(null)
  // keep onMessage stable — caller may pass an inline function
  const handlerRef = useRef<MessageHandler>(onMessage)
  useEffect(() => { handlerRef.current = onMessage }, [onMessage])

  const disconnect = useCallback(() => {
    if (clientRef.current?.active) {
      clientRef.current.deactivate()
    }
  }, [])

  useEffect(() => {
    if (!enabled || !topic) return

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(topic, (frame) => {
          try {
            const data = JSON.parse(frame.body)
            handlerRef.current(data)
          } catch {
            handlerRef.current(frame.body)
          }
        })
      },
      onStompError: (frame) => {
        console.warn('WebSocket STOMP error:', frame.headers['message'])
      },
    })

    client.activate()
    clientRef.current = client

    return () => { client.deactivate() }
  }, [topic, enabled])

  return { disconnect }
}