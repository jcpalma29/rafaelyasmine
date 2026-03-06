import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./WhitePage.css";

gsap.registerPlugin(ScrollTrigger);

export default function WhitePage() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const stackRef = useRef<HTMLDivElement | null>(null);
  const floatRef = useRef<HTMLDivElement | null>(null); // NEW: only this floats

  const firstRef = useRef<HTMLImageElement | null>(null);
  const secondRef = useRef<HTMLImageElement | null>(null);

  const line1Ref = useRef<HTMLParagraphElement | null>(null);
  // const rnyRef = useRef<HTMLImageElement | null>(null);
  const line3Ref = useRef<HTMLParagraphElement | null>(null);
  const dateRef = useRef<HTMLDivElement | null>(null);
  const ivyRef = useRef<HTMLImageElement | null>(null);

  const floatTlRef = useRef<gsap.core.Timeline | null>(null);
  const revealCountRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stack = stackRef.current;
    const floatWrap = floatRef.current;
    const first = firstRef.current;
    const second = secondRef.current;

    const l1 = line1Ref.current;
    // const rny = rnyRef.current;
    const l3 = line3Ref.current;
    const dateEl = dateRef.current;
    const ivy = ivyRef.current;

    if (
      !section ||
      !stack ||
      !floatWrap ||
      !first ||
      !second ||
      !l1 ||
      // !rny ||
      !l3 ||
      !dateEl ||
      !ivy
    )
      return;

    const ctx = gsap.context(() => {
      gsap.set([first, second], { autoAlpha: 0, y: 14 });
      // gsap.set([l1, rny, l3, dateEl], { autoAlpha: 0, y: 8 });

      // ivy visible but clipped
      gsap.set(ivy, { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });

      // IMPORTANT: float is applied ONLY to floatWrap now (ivy stays still)
      gsap.set(floatWrap, { y: 0, rotate: 0, transformOrigin: "50% 50%" });

      const startFloatLoop = () => {
        if (floatTlRef.current) return;

        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(floatWrap, {
          y: -10,
          rotate: 0.35,
          duration: 2.2,
          ease: "sine.inOut",
        });
        tl.to(floatWrap, {
          y: 0,
          rotate: -0.25,
          duration: 2.4,
          ease: "sine.inOut",
        });
        floatTlRef.current = tl;
      };

      const markAndMaybeStartFloat = () => {
        revealCountRef.current += 1;
        if (revealCountRef.current >= 2) startFloatLoop();
      };

      gsap.to(first, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
        onComplete: markAndMaybeStartFloat,
      });

      gsap.to(second, {
        autoAlpha: 1,
        y: 0,
        duration: 1.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          toggleActions: "play none none none",
          once: true,
        },
        onComplete: markAndMaybeStartFloat,
      });

      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 55%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      textTl.to(
        l1,
        { autoAlpha: 1, y: 0, duration: 0.85, ease: "power2.out" },
        0,
      );
      // textTl.to(
      //   rny,
      //   { autoAlpha: 1, y: 0, duration: 0.95, ease: "power2.out" },
      //   0.28,
      // );
      textTl.to(
        l3,
        { autoAlpha: 1, y: 0, duration: 0.85, ease: "power2.out" },
        0.56,
      );

      // reveal ivy left-to-right, then show the date block
      textTl.to(
        ivy,
        { clipPath: "inset(0 0% 0 0)", duration: 3.15, ease: "power2.out" },
        0.78,
      );
      textTl.to(
        dateEl,
        { autoAlpha: 1, y: 0, duration: 0.85, ease: "power2.out" },
        0.92,
      );
    }, section);

    return () => {
      if (floatTlRef.current) {
        floatTlRef.current.kill();
        floatTlRef.current = null;
      }
      revealCountRef.current = 0;
      ctx.revert();
    };
  }, []);

  const base = import.meta.env.BASE_URL;

  return (
    <section ref={sectionRef} className="whitePage">
      <div className="whitePage__content">
        <div ref={stackRef} className="whitePage__stack" aria-hidden="true">
          {/* ivy stays in the stack (always behind), but does NOT float */}
          <img
            ref={ivyRef}
            className="whitePage__ivy"
            src={`${base}ivy1.png`}
            alt=""
            draggable={false}
            aria-hidden="true"
          />

          {/* ONLY this wrapper floats */}
          <div ref={floatRef} className="whitePage__float">
            <img
              ref={firstRef}
              className="whitePage__img whitePage__img--first"
              src={`${base}firstele.png`}
              alt=""
              draggable={false}
            />
            <img
              ref={secondRef}
              className="whitePage__img whitePage__img--top"
              src={`${base}secondele.png`}
              alt=""
              draggable={false}
            />
          </div>
        </div>

        <div className="whitePage__text">
          <p ref={line1Ref} className="whitePage__line">
            Together with their families,
          </p>

          {/* <img ref={rnyRef} className='whitePage__rny' src={`${base}rny2.png`} alt='Rafael and Yasmine' draggable={false} /> */}

          <h2 className="raf-yas">Rafael &amp; Yasmine</h2>

          <p ref={line3Ref} className="whitePage__line">
            invite you to join them in celebrating their marriage.
          </p>

          <div
            ref={dateRef}
            className="whitePage__dateRow"
            aria-label="April 28 2026"
          >
            <div className="whitePage__dateTopRow3">
              <span className="whitePage__side">APRIL</span>
              <span className="whitePage__sep3">|</span>
              <span className="whitePage__day3">28</span>
              <span className="whitePage__sep3">|</span>
              <span className="whitePage__side">2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="whitePage__after" />
    </section>
  );
}
