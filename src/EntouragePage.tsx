import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EntouragePage.css";

gsap.registerPlugin(ScrollTrigger);

export default function EntouragePage() {
  const ivyLeftRef = useRef<HTMLImageElement | null>(null);
  const ivyRightRef = useRef<HTMLImageElement | null>(null);
  const ivyBottomLeftRef = useRef<HTMLImageElement | null>(null);
  const ivyBottomRightRef = useRef<HTMLImageElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const left = ivyLeftRef.current;
    const right = ivyRightRef.current;
    const bottomLeft = ivyBottomLeftRef.current;
    const bottomRight = ivyBottomRightRef.current;
    const content = contentRef.current;

    if (!left || !right || !bottomLeft || !bottomRight || !content) return;

    const ctx = gsap.context(() => {
      gsap.killTweensOf([left, right, bottomLeft, bottomRight]);

      // ✅ we animate these 3 normally
      const ivyIntroTargets = [left, right, bottomLeft];

      gsap.set(ivyIntroTargets, { clearProps: "transform,filter,opacity" });

      // top
      gsap.set(left, {
        x: -18,
        y: -18,
        opacity: 0,
        filter: "blur(1px)",
        force3D: true,
      });

      gsap.set(right, {
        x: 18,
        y: -18,
        opacity: 0,
        filter: "blur(1px)",
        force3D: true,
      });

      // bottom-left
      gsap.set(bottomLeft, {
        x: -18,
        y: 18,
        opacity: 0,
        filter: "blur(1px)",
        force3D: true,
      });

      // ✅ FORCE bottom-right visible (no intro opacity/blur)
      gsap.set(bottomRight, {
        opacity: 1,
        filter: "blur(0px)",
        force3D: true,
      });

      const intro = gsap.timeline({ delay: 0.15 });

      intro
        .to(ivyIntroTargets, {
          opacity: 1,
          duration: 0.55,
          filter: "blur(0px)",
          ease: "power2.out",
        })
        .to(
          ivyIntroTargets,
          {
            x: 0,
            y: 0,
            duration: 1.8,
            ease: "power3.out",
          },
          0,
        );

      // float top-left
      gsap
        .timeline({
          repeat: -1,
          yoyo: true,
          defaults: { ease: "sine.inOut" },
          delay: 2.0,
        })
        .to(left, { y: -12, x: 2, duration: 3.4, force3D: true })
        .to(left, { y: -6, x: -4, duration: 3.0, force3D: true });

      // float top-right
      gsap
        .timeline({
          repeat: -1,
          yoyo: true,
          defaults: { ease: "sine.inOut" },
          delay: 2.15,
        })
        .to(right, { y: -12, x: -4, duration: 3.8, force3D: true })
        .to(right, { y: -7, x: 5, duration: 3.2, force3D: true });

      // float bottom-left
      gsap
        .timeline({
          repeat: -1,
          yoyo: true,
          defaults: { ease: "sine.inOut" },
          delay: 2.05,
        })
        .to(bottomLeft, { y: 12, x: 2, duration: 3.4, force3D: true })
        .to(bottomLeft, { y: 6, x: -4, duration: 3.0, force3D: true });

      // ✅ float bottom-right (only transform, keep visible)
      gsap
        .timeline({
          repeat: -1,
          yoyo: true,
          defaults: { ease: "sine.inOut" },
          delay: 2.2,
        })
        .to(bottomRight, { y: 8, x: 2, duration: 3.2, force3D: true })
        .to(bottomRight, { y: 6, x: 1, duration: 3.2, force3D: true });

      // TEXT reveal
      const items = Array.from(
        content.querySelectorAll<HTMLElement>(
          ".entourage-page__header, .entourage-page__parents, .entourage-section, .entourage-triple",
        ),
      );

      gsap.set(items, {
        opacity: 0,
        y: 70,
        filter: "blur(4px)",
        force3D: true,
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: content,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "power2.out" },
        })
        .to(items, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.16,
          overwrite: "auto",
        });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="entourage-page" aria-label="Entourage">
      <div className="entourage-page__frame">
        {/* TOP */}
        <img
          ref={ivyLeftRef}
          className="entourage-page__ivy entourage-page__ivy--left"
          src="/ivyr.png"
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <img
          ref={ivyRightRef}
          className="entourage-page__ivy entourage-page__ivy--right"
          src="/ivy2.png"
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        {/* BOTTOM */}
        <img
          ref={ivyBottomLeftRef}
          className="entourage-page__ivy entourage-page__ivy--bottomLeft"
          src="/ivlb.png"
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <img
          ref={ivyBottomRightRef}
          className="entourage-page__ivy entourage-page__ivy--bottomRight"
          src="/ivyrb.png"
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <div ref={contentRef} className="entourage-page__inner">
          <h2 className="entourage-page__titleText">The Entourage</h2>
          <div className="entourage-page__parents">
            <div className="entourage-block">
              <div className="entourage-block__title">PARENTS OF THE BRIDE</div>
              <div className="entourage-block__sub">
                Mrs. Laura Isabel Trigo &amp; Blessed from above by the memory
                of{" "}
                <span style={{ fontStyle: "italic" }}> Mr. Pedro M. Trigo</span>
              </div>
            </div>

            <div className="entourage-block">
              <div className="entourage-block__title">PARENTS OF THE GROOM</div>
              <div className="entourage-block__sub">
                Mrs. Melba Ramos &amp; Mr. Rigor Ramos
              </div>
            </div>
          </div>
          <section
            className="entourage-section"
            aria-label="Principal sponsors"
          >
            <div className="entourage-section__title">PRINCIPAL SPONSORS</div>

            <div className="entourage-cols">
              <ul
                className="entourage-list"
                aria-label="Principal sponsors left"
              >
                <li>Mrs. Roselyn Jorge</li>
                <li>Mrs. Myrna Gapud</li>
                <li>Mrs. Teresita Depaz</li>
                <li>Mrs. Marites Ilaya</li>
                <li>Mrs. Remedios Celeste</li>
                <li>Gen. Noemie Austero</li>
                <li>Mrs. Felicia Malpal</li>
                <li>Engr. Wilma Bulaong</li>
                <li>Ms. Annalyn Trapani</li>
                <li>Mrs. Abigail Madridano</li>
                <li>Mrs. Lirio Solero</li>
                <li>Mrs. Edna Padlan</li>
                <li>Mrs. Erma Grumez</li>
                <li>Mrs. Ruth Licuanan</li>
                <li>Mrs. Marilyn Paitim</li>
              </ul>

              <ul
                className="entourage-list"
                aria-label="Principal sponsors right"
              >
                <li>Mr. Laurel Depaz</li>
                <li>Mr. Valentino Gapud</li>
                <li>Mr. Danilo Pacanut</li>
                <li>Atty. Dante Ilaya</li>
                <li>Mr. Ramir Celeste</li>
                <li>Mr. Jupiter Alas</li>
                <li>Mr. Rizalino Arreza</li>
                <li>Engr. Edgardo Bulaong</li>
                <br />
                <br />
                <li>Engr. Reynaldo Solero</li>
                <li>Mr. Junior Trigo</li>
                <li>Mr. Joseph Solejon</li>
                <li>Mr. Santiago Arreza</li>
                <li>Mr. Julian Paitim</li>
              </ul>
            </div>
          </section>
          <section
            className="entourage-section"
            aria-label="Secondary sponsors"
          >
            <div className="entourage-section__title">SECONDARY SPONSORS</div>
          </section>
          <div className="entourage-triple">
            <div className="entourage-mini">
              <div className="entourage-block__title">VEIL</div>
              <ul
                className="entourage-list entourage-list--tight"
                aria-label="Candle sponsors"
              >
                <li>Joane Camille Palma</li>
                <li>Roi Rasos</li>
              </ul>
            </div>

            <div className="entourage-mini">
              <div className="entourage-block__title">CANDLE</div>
              <ul
                className="entourage-list entourage-list--tight"
                aria-label="Veil sponsors"
              >
                <li>Joanna Michelle Gapud</li>
                <li>Pocholo Ian Trigo</li>
              </ul>
            </div>

            <div className="entourage-mini">
              <div className="entourage-block__title">CORD</div>
              <ul
                className="entourage-list entourage-list--tight"
                aria-label="Cord sponsors"
              >
                <li>Angela Marie Manalastas-Juezan</li>
                <li>John Daryl Tan</li>
              </ul>
            </div>
          </div>
          <section
            className="entourage-section entourage-section--pair"
            aria-label="Honor attendants"
          >
            <div className="entourage-pair">
              <div className="entourage-block entourage-block--center">
                <div className="entourage-block__title">MAID OF HONOR</div>
                <div className="entourage-block__sub">Shaira Mae Trigo</div>
              </div>

              <div className="entourage-block entourage-block--center">
                <div className="entourage-block__title">BEST MAN</div>
                <div className="entourage-block__sub">Ralph Daniel Ramos</div>
              </div>
            </div>
          </section>
          <section
            className="entourage-section"
            aria-label="Bridesmaids and groomsmen"
          >
            <div className="entourage-cols entourage-cols--wide">
              <div>
                <div className="entourage-section__title">BRIDESMAIDS</div>
                <ul className="entourage-list" aria-label="Bridesmaids">
                  <li>Reyshel Joy Buenviaje-Banta</li>
                  <li>Rina Alimpuyo</li>
                  <li>Maribell Escobar</li>
                  <li>Annabelle Canega</li>
                  <li>Maria Milagros Fiesta</li>
                  <li>Ashley Faith Jorge</li>
                  <li>Minerva Christine Pacanut</li>
                </ul>
              </div>

              <div>
                <div className="entourage-section__title">GROOMSMEN</div>
                <ul className="entourage-list" aria-label="Groomsmen">
                  <li>Karol John Joseph Pfleider</li>
                  <li>Ehrize Guevarra</li>
                  <li>Robin Resplandor</li>
                  <li>Fregie Martin</li>
                  <li>Arkheus Antolin</li>
                  <li>Paolo Ferros</li>
                  <li>Lester Jhon Cabanilla</li>
                </ul>
              </div>
            </div>
          </section>
          <div className="entourage-triple entourage-triple--bottom">
            <div className="entourage-mini">
              <div className="entourage-block entourage-block--center">
                <div className="entourage-block__title">ٍRING BEARER</div>
                <div className="entourage-block__sub">Seth Jurrien Rivera</div>
              </div>
            </div>

            <div className="entourage-mini">
              <div className="entourage-block entourage-block--center">
                <div className="entourage-block__title">COIN BEARER</div>
                <div className="entourage-block__sub">Sid Randall Jorge</div>
              </div>
            </div>

            <div className="entourage-mini">
              <div className="entourage-block entourage-block--center">
                <div className="entourage-block__title">FLOWER GIRL</div>
                <div className="entourage-block__sub">Ayesha Kelly Alvarez</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
