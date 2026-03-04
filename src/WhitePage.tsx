import {useEffect, useRef} from 'react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import './WhitePage.css'

gsap.registerPlugin(ScrollTrigger)

export default function WhitePage() {
  const sectionRef = useRef<HTMLElement | null>(null)

  const stackRef = useRef<HTMLDivElement | null>(null)
  const floatRef = useRef<HTMLDivElement | null>(null)

  const firstRef = useRef<HTMLImageElement | null>(null)
  const secondRef = useRef<HTMLImageElement | null>(null)

  const line1Ref = useRef<HTMLParagraphElement | null>(null)
  const rnyRef = useRef<HTMLImageElement | null>(null)
  const line3Ref = useRef<HTMLParagraphElement | null>(null)
  const dateRef = useRef<HTMLDivElement | null>(null)
  const ivyRef = useRef<HTMLImageElement | null>(null)

  const floatTlRef = useRef<gsap.core.Timeline | null>(null)
  const revealCountRef = useRef(0)

  useEffect(() => {
    const section = sectionRef.current
    const stack = stackRef.current
    const floatWrap = floatRef.current
    const first = firstRef.current
    const second = secondRef.current

    const l1 = line1Ref.current
    const rny = rnyRef.current
    const l3 = line3Ref.current
    const dateEl = dateRef.current
    const ivy = ivyRef.current

    if (!section || !stack || !floatWrap || !first || !second || !l1 || !rny || !l3 || !dateEl || !ivy) return

    const ctx = gsap.context(() => {
      // initial states
      gsap.set([first, second], {autoAlpha: 0, y: 14})
      gsap.set([l1, rny, l3, dateEl], {autoAlpha: 0, y: 8})

      // ensure ivy is visible and fades in nicely (so you can confirm it exists)
      gsap.set(ivy, {autoAlpha: 0, y: 6})

      // float wrapper setup
      gsap.set(floatWrap, {y: 0, rotate: 0, transformOrigin: '50% 50%'})

      const startFloatLoop = () => {
        if (floatTlRef.current) return

        const tl = gsap.timeline({repeat: -1, yoyo: true})
        tl.to(floatWrap, {y: -10, rotate: 0.35, duration: 2.2, ease: 'sine.inOut'})
        tl.to(floatWrap, {y: 0, rotate: -0.25, duration: 2.4, ease: 'sine.inOut'})
        floatTlRef.current = tl
      }

      const markAndMaybeStartFloat = () => {
        revealCountRef.current += 1
        if (revealCountRef.current >= 2) startFloatLoop()
      }

      // ivy reveal (earlier, so you can see it)
      gsap.to(ivy, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 92%',
          toggleActions: 'play none none none',
          once: true,
        },
      })

      // image reveals
      gsap.to(first, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
        onComplete: markAndMaybeStartFloat,
      })

      gsap.to(second, {
        autoAlpha: 1,
        y: 0,
        duration: 1.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          toggleActions: 'play none none none',
          once: true,
        },
        onComplete: markAndMaybeStartFloat,
      })

      // text reveal timeline
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 55%',
          toggleActions: 'play none none none',
          once: true,
        },
      })

      textTl.to(l1, {autoAlpha: 1, y: 0, duration: 0.85, ease: 'power2.out'}, 0)
      textTl.to(rny, {autoAlpha: 1, y: 0, duration: 0.95, ease: 'power2.out'}, 0.28)
      textTl.to(l3, {autoAlpha: 1, y: 0, duration: 0.85, ease: 'power2.out'}, 0.56)
      textTl.to(dateEl, {autoAlpha: 1, y: 0, duration: 0.85, ease: 'power2.out'}, 0.92)

      // ✅ very important: refresh triggers after images decode/layout settles
      const imgs = [first, second, ivy, rny].filter(Boolean) as HTMLImageElement[]
      Promise.all(
        imgs.map((img) => {
          // decode helps when the image is cached/late-layout
          if (img.decode) return img.decode().catch(() => undefined)
          return Promise.resolve(undefined)
        }),
      ).then(() => {
        ScrollTrigger.refresh()
      })

      // also one extra rAF refresh for safety
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, section)

    return () => {
      if (floatTlRef.current) {
        floatTlRef.current.kill()
        floatTlRef.current = null
      }
      revealCountRef.current = 0
      ctx.revert()
    }
  }, [])

  const base = import.meta.env.BASE_URL

  return (
    <section ref={sectionRef} className='whitePage'>
      <div className='whitePage__layout'>
        <div className='whitePage__strip' aria-hidden='true'>
          <img
            className='whitePage__stripImg'
            src={`${base}pic1a_bw.jpg`}
            alt=''
            draggable={false}
            aria-hidden='true'
          />
          <img
            className='whitePage__stripImg'
            src={`${base}pic2a_bw.jpg`}
            alt=''
            draggable={false}
            aria-hidden='true'
          />
        </div>

        <div className='whitePage__right'>
          <div className='whitePage__content'>
            <div ref={stackRef} className='whitePage__stack' aria-hidden='true'>
              <img
                ref={ivyRef}
                className='whitePage__ivy'
                src={`${base}ivy1.png`}
                alt=''
                draggable={false}
                aria-hidden='true'
              />

              <div ref={floatRef} className='whitePage__float'>
                <img
                  ref={firstRef}
                  className='whitePage__img whitePage__img--first'
                  src={`${base}firstele.png`}
                  alt=''
                  draggable={false}
                />
                <img
                  ref={secondRef}
                  className='whitePage__img whitePage__img--top'
                  src={`${base}secondele.png`}
                  alt=''
                  draggable={false}
                />
              </div>
            </div>

            <div className='whitePage__text'>
              <p ref={line1Ref} className='whitePage__line'>Together with their families,</p>

              <img
                ref={rnyRef}
                className='whitePage__rny'
                src={`${base}rny2.png`}
                alt='Rid and Yen'
                draggable={false}
              />

              <p ref={line3Ref} className='whitePage__line'>invite you to join them in celebrating their marriage.</p>

              <div ref={dateRef} className='whitePage__dateRow' aria-label='April 22 2026'>
                <div className='whitePage__dateTopRow3'>
                  <span className='whitePage__side'>APRIL</span>
                  <span className='whitePage__sep3'>|</span>
                  <span className='whitePage__day3'>22</span>
                  <span className='whitePage__sep3'>|</span>
                  <span className='whitePage__side'>2026</span>
                </div>
              </div>
            </div>
          </div>

          <div className='whitePage__after' />
        </div>
      </div>
    </section>
  )
}