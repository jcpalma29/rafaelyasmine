// DetailsPage.tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./DetailsPage.css";

gsap.registerPlugin(ScrollTrigger);

export default function DetailsPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const churchRef = useRef<HTMLImageElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const triptychRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const church = churchRef.current;
    const cards = cardsRef.current;
    const timeline = timelineRef.current; // can be null (timeline is commented out)
    const triptych = triptychRef.current;

    // ✅ only require the elements that actually exist on the page
    if (!section || !church || !cards || !triptych) return;

    const ctx = gsap.context(() => {
      // -----------------------
      // INITIAL STATES
      // -----------------------
      gsap.set(church, { autoAlpha: 0, y: -24 });
      gsap.set(cards, { autoAlpha: 0, y: 18 });

      // triptych hidden until scroll
      const triptychItems = gsap.utils.toArray<HTMLElement>(
        ".details-triptych__item",
        triptych,
      );
      gsap.set(triptychItems, { autoAlpha: 0, y: 18 });

      // timeline is optional
      let timelineLine: HTMLElement | undefined;
      let timelineItems: HTMLElement[] = [];

      if (timeline) {
        const q = gsap.utils.selector(timeline);
        timelineLine = q(".details-page__timelineLine")[0] as
          | HTMLElement
          | undefined;
        timelineItems = gsap.utils.toArray<HTMLElement>(
          ".timeline-item",
          timeline,
        );

        gsap.set(timeline, { autoAlpha: 1 });
        gsap.set(timelineItems, { autoAlpha: 0, y: 14 });

        if (timelineLine) {
          gsap.set(timelineLine, {
            autoAlpha: 0,
            scaleX: 0,
            transformOrigin: "left center",
          });
        }
      }

      // -----------------------
      // MAIN TIMELINE (church -> cards -> timeline optional)
      // -----------------------
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.to(
        church,
        { autoAlpha: 1, y: 0, duration: 1.2, ease: "power2.out" },
        0,
      );

      tl.to(
        cards,
        { autoAlpha: 1, y: 0, duration: 1.0, ease: "power2.out" },
        ">",
      );

      if (timelineLine) {
        tl.to(
          timelineLine,
          { autoAlpha: 1, scaleX: 1, duration: 0.7, ease: "power2.out" },
          ">",
        );
      }

      if (timelineItems.length) {
        tl.to(
          timelineItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            stagger: 0.12,
          },
          timelineLine ? "<0.08" : ">",
        );
      }

      // -----------------------
      // TRIPTYCH (responsive direction)
      // -----------------------
      const mm = gsap.matchMedia();

      mm.add("(min-width: 981px)", () => {
        gsap.set(triptychItems, { autoAlpha: 0, x: -26, y: 0 });

        gsap.to(triptychItems, {
          scrollTrigger: {
            trigger: triptych,
            start: "top 78%",
            toggleActions: "play none none none",
            once: true,
          },
          autoAlpha: 1,
          x: 0,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.18,
        });
      });

      mm.add("(max-width: 980px)", () => {
        gsap.set(triptychItems, { autoAlpha: 0, y: 22, x: 0 });

        gsap.to(triptychItems, {
          scrollTrigger: {
            trigger: triptych,
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
          },
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
          stagger: 0.16,
        });
      });

      // ✅ ensures triggers calculate correctly after layout/images
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, section);

    return () => ctx.revert();
  }, []);

  const base = import.meta.env.BASE_URL;

  return (
    <section ref={sectionRef} className="details-page">
      <div className="details-page__churchbg-wrap" aria-hidden="true">
        <div className="details-page__churchbg-inner">
          <img
            className="details-page__ivy"
            src={`${base}ivy1.png`}
            alt=""
            draggable={false}
            aria-hidden="true"
          />
          <img
            ref={churchRef}
            className="details-page__churchbg"
            src={`${base}churchbg.png`}
            alt=""
          />
        </div>
      </div>

      <div className="details-page__wp-wrap" aria-hidden="true" />

      <h2 className="details-page__programTitle">Wedding Program</h2>

      <div ref={cardsRef} className="details-page__cards">
        <div className="details-card">
          <div className="details-card__inner">
            <div className="details-card__label">CEREMONY</div>
            <div className="details-card__title">
              <strong>Basilica Minore del Sto. Niño</strong>
              {/* <br />
              <strong>Parish Church</strong> */}
            </div>
            <div className="details-card__text details-card__text--sans">
              Cebu City
            </div>

            <a
              className="details-card__btn"
              href="https://maps.app.goo.gl/mqqmys1z8otVrA7MA"
              target="_blank"
              rel="noreferrer"
            >
              DIRECTIONS
            </a>
          </div>
        </div>

        <div className="details-card">
          <div className="details-card__inner">
            <div className="details-card__label">RECEPTION </div>
            <div className="details-card__title">
              <strong>Fort San Pedro</strong>
            </div>
            <div className="details-card__text details-card__text--sans">
              Plaza Independencia, Cebu
            </div>

            <a
              className="details-card__btn"
              href="https://maps.app.goo.gl/3RS6ExQMHvc1azHv9"
              target="_blank"
              rel="noreferrer"
            >
              DIRECTIONS
            </a>
          </div>
        </div>
      </div>

      <div
        ref={triptychRef}
        className="details-page__triptych"
        aria-label="Ceremony, Social, Reception details"
      >
        <div className="details-triptych__item">
          <img
            className="details-triptych__img"
            src={`${base}ceremony.png`}
            alt="Ceremony"
            draggable={false}
          />
          <h3 className="details-triptych__title">Ceremony</h3>
          <h5 className="details-triptych__title2"> 2:00 PM</h5>
          <p className="details-triptych__text">
            We invite you to witness our sacred union as we exchange vows in a
            holy place of profound peace and spiritual beauty.
          </p>
        </div>

        <div className="details-triptych__item">
          <img
            className="details-triptych__img"
            src={`${base}social.png`}
            alt="Social"
            draggable={false}
          />
          <h3 className="details-triptych__title">Social Hour</h3>
          <h5 className="details-triptych__title2"> 4:30 PM</h5>

          <p className="details-triptych__text">
            Mingle, munch, and enjoy the scenery. We’ve got light refreshments
            waiting for you — take a stroll and make yourself at home in the
            great outdoors.
          </p>
        </div>

        <div className="details-triptych__item">
          <img
            className="details-triptych__img"
            src={`${base}reception.png`}
            alt="Dress Code"
            draggable={false}
          />
          <h3 className="details-triptych__title">Reception</h3>
          <h5 className="details-triptych__title2"> 6:00 PM</h5>

          <p className="details-triptych__text">
            After we say 'I do,' please join us for a candlelit dinner and music
            as we celebrate our first evening as a married couple.
          </p>
        </div>
      </div>

      {/* timeline is still optional / commented out */}
    </section>
  );
}
