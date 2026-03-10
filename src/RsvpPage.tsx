/* eslint-disable @typescript-eslint/no-unused-vars */
import {useId, useMemo, useRef, useState} from 'react'
import './RsvpPage.css'

type AttendChoice = 'accept' | 'decline' | ''

export default function RsvpPage() {
  const [attend, setAttend] = useState<AttendChoice>('')

  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [lastName, setLastName] = useState('')

  // const [isEntourageChild, setIsEntourageChild] = useState<boolean | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // ✅ stable id string (safe to use in JSX)
  const reactId = useId()
  const iframeName = `gf_iframe_${reactId}`

  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const successTimerRef = useRef<number | null>(null)
  const failTimerRef = useRef<number | null>(null)
  const didFinishRef = useRef(false)

  const GOOGLE_FORM_ACTION_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSdmnQ2ro5OF6Jj4skOLesb8wkWU242afLxZOLhamwWgTEPLrg/formResponse'

  const entry = useMemo(
    () => ({
      attend: 'entry.386405768',
      firstName: 'entry.2092238618',
      email: 'entry.1556369182',
      lastName: 'entry.479301265',
    }),
    [],
  )

  const ATTEND_ACCEPT_LABEL = 'Yes,  I accept with pleasure'
  const ATTEND_DECLINE_LABEL = 'Declines with regrets'

  const ERROR_MESSAGE =
    'We couldn’t record your RSVP right now. Please contact the couple directly.'

  const isValidEmail = (value: string) => {
    const v = value.trim()
    if (!v) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  const canSubmit =
    attend !== '' &&
    firstName.trim().length > 0 &&
    isValidEmail(email) &&
    lastName.trim().length > 0 &&
    !isSubmitting

  const clearTimers = () => {
    if (successTimerRef.current) window.clearTimeout(successTimerRef.current)
    if (failTimerRef.current) window.clearTimeout(failTimerRef.current)
    successTimerRef.current = null
    failTimerRef.current = null
  }

  const resetFinishState = () => {
    didFinishRef.current = false
    clearTimers()
  }

  const markSuccess = () => {
    if (didFinishRef.current) return
    didFinishRef.current = true
    clearTimers()

    setStatus('success')
    setAttend('')
    setFirstName('')
    setEmail('')
    setLastName('')
    // setIsEntourageChild(null)
    setIsSubmitting(false)
  }

  const markError = () => {
    if (didFinishRef.current) return
    didFinishRef.current = true
    clearTimers()

    setStatus('error')
    setIsSubmitting(false)
  }

  const submitViaHiddenIframeGet = (payload: Record<string, string>) => {
    const params = new URLSearchParams()

    Object.entries(payload).forEach(([name, value]) => {
      params.set(name, value)
    })

    params.set('submit', 'Submit')
    params.set('_ts', String(Date.now()))

    const url = `${GOOGLE_FORM_ACTION_URL}?${params.toString()}`

    if (!iframeRef.current) throw new Error('Missing iframe')
    iframeRef.current.src = url
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)
    setStatus('idle')
    resetFinishState()

    const attendLabel = attend === 'accept' ? ATTEND_ACCEPT_LABEL : ATTEND_DECLINE_LABEL

    try {
      submitViaHiddenIframeGet({
        [entry.attend]: attendLabel,
        [entry.firstName]: firstName.trim(),
        [entry.email]: email.trim(),
        [entry.lastName]: lastName.trim(),
      })

      successTimerRef.current = window.setTimeout(() => {
        markSuccess()
      }, 800)

      failTimerRef.current = window.setTimeout(() => {
        markError()
      }, 8000)
    } catch (err) {
      markError()
    }
  }

  return (
    <section className="rsvp-page">
      <div className="rsvp-page__inner">
        <h2 className="rsvp-page__heading">Celebrate with us..</h2>

        <p className="rsvp-page__subtitle">
          Please confirm your attendance by entering your details below. You can RSVP until Jan 15,
          2025.
        </p>

        <iframe
          ref={iframeRef}
          name={iframeName}
          title="google-form-target"
          style={{display: 'none'}}
          onLoad={() => {
            if (!didFinishRef.current) markSuccess()
          }}
        />

        <form className="rsvp-form" onSubmit={onSubmit}>
          <fieldset className="rsvp-fieldset">
            <legend className="rsvp-legend">
              Can you attend?<span className="rsvp-required">*</span>
            </legend>

            <div className="rsvp-radioGroup">
              <label className="rsvp-radio">
                <input
                  type="radio"
                  name="attend"
                  value="accept"
                  checked={attend === 'accept'}
                  onChange={() => setAttend('accept')}
                />
                <span className="rsvp-radio__dot" aria-hidden="true" />
                <span className="rsvp-radio__text">{ATTEND_ACCEPT_LABEL}</span>
              </label>

              <label className="rsvp-radio">
                <input
                  type="radio"
                  name="attend"
                  value="decline"
                  checked={attend === 'decline'}
                  onChange={() => setAttend('decline')}
                />
                <span className="rsvp-radio__dot" aria-hidden="true" />
                <span className="rsvp-radio__text">{ATTEND_DECLINE_LABEL}</span>
              </label>
            </div>
          </fieldset>

          <div className="rsvp-name">
            <div className="rsvp-field">
              <label className="rsvp-label" htmlFor="firstName">
                Full Name<span className="rsvp-required">*</span>
              </label>
              <input
                id="firstName"
                className="rsvp-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="rsvp-field">
              <label className="rsvp-label" htmlFor="email">
                Email<span className="rsvp-required">*</span>
              </label>
              <input
                id="email"
                className="rsvp-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div className="rsvp-field">
              <label className="rsvp-label" htmlFor="lastName">
                Please specify if you have any dietary restrictions
                <span className="rsvp-required">*</span>
              </label>
              <input
                id="lastName"
                className="rsvp-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <button className="rsvp-submit" type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </button>

          <h5 className="rsvp-note">
            ***This section will close after the above said date. Please contact the couple directly.
            ***
          </h5>

          {status === 'success' && (
            <p className="rsvp-status rsvp-status--success">Thank you. Your RSVP has been recorded.</p>
          )}

          {status === 'error' && <p className="rsvp-status rsvp-status--error">{ERROR_MESSAGE}</p>}
        </form>
      </div>

      <div className="rsvp-credit" aria-label="Site credit">
        <img className="rsvp-credit__img" src="/jcd.png" alt="jcami.dev" draggable={false} />
        <div className="rsvp-credit__tooltip" role="tooltip">
          This site is developed by jcami.dev
        </div>
      </div>
    </section>
  )
}