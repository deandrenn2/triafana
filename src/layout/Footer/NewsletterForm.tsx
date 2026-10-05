'use client'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const NewsletterForm = () => {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = email.trim()
    if (!clean || sending) return

    setSending(true)
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean }),
      })
      const data = await res.json()

      if (!res.ok) {
        const message: string =
          data?.errors?.[0]?.message || data?.message || 'No se pudo completar la suscripción.'
        if (message.toLowerCase().includes('unique')) {
          toast.info('Este correo ya está suscrito 🎉', { toastId: 'newsletter-dup' })
          setDone(true)
          return
        }
        throw new Error(message)
      }

      setDone(true)
      setEmail('')
      toast.success('¡Gracias por unirte! Revisa tu correo 🎉', { toastId: 'newsletter-ok' })
    } catch (error) {
      console.error('Error suscribiendo:', error)
      toast.error('No se pudo completar la suscripción', { toastId: 'newsletter-error' })
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return <p className="newsletter-done">✅ ¡Ya eres parte de TRIAFANA! Atento a tus ofertas.</p>
  }

  return (
    <form className="newsletter" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.com"
        aria-label="Correo"
        className="footer-input"
        required
        disabled={sending}
      />
      <button className="footer-btn btn-secondary" type="submit" disabled={sending}>
        {sending ? '…' : 'Unirme'}
      </button>
    </form>
  )
}
