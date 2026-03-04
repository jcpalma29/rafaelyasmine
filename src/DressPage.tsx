import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./DressPage.css";

gsap.registerPlugin(ScrollTrigger);

export default function DressPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wagRef = useRef<HTMLImageElement | null>(null);
  const dressRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wag = wagRef.current;
    const dress = dressRef.current;
    if (!section || !wag || !dress) return;

    const ctx = gsap.context(() => {
      gsap.set([wag, dress], { autoAlpha: 0, y: 16 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        })
        .to(wag, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" })
        .to(
          dress,
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out" },
          "-=0.45",
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="dress-page" ref={sectionRef}>
      <div className="dress-page__inner">
        {/* <img
          ref={wagRef}
          className="dress-page__wag"
          src="/wag.png"
          alt="Wedding Attire Guide"
          loading="eager"
          draggable={false}
        /> */}
        <h2 className="dress-page__heading">Dress Guide</h2>
        <p className="dress-page__subtitle">
          We kindly request that all guests dress in semi-formal attire that
          compliments our color palette. As a courtesy to the bride, please
          refrain from wearing white.
        </p>
        <p className="dress-page__subtitle">
          <b>Ninong and Male guests:</b> Traditional Barong and Black pants <br />
          <b>Ninang and Female guests:</b> Maxi Dress and please follow motif colors
        </p>

        <img
          ref={dressRef}
          className="dress-page__dress"
          src="/dress.png"
          alt="Dress"
          loading="lazy"
          draggable={false}
        />
        {/* <img
          ref={dressRef}
          className="dress-page__shade"
          src="/shade.png"
          alt="Dress"
          loading="lazy"
          draggable={false}
        /> */}
      </div>
    </section>
  );
}
