import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function AdminSecretListener() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Shortcut: Shift + Alt + A
      if (e.shiftKey && e.altKey && e.code === 'KeyA') {
        navigate('/admin/login')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return null
}
