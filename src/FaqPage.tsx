/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import "./FaqPage.css";

type FaqItem = {
  q: string;
  a: string;
};

export default function FaqPage() {
  const faqs: FaqItem[] = useMemo(
    () => [
      {
        q: "Do I have to RSVP?",
        a: `**Yes, absolutely!** Even if we've already talked and you’ve told us you’re coming, we still need you to RSVP through the official form. If you're not on the confirmed list, our coordinators won't be able to let you into the reception venue!

If you haven’t RSVP'd yet, please scroll down on the website and click on the RSVP form to confirm your attendance.`,
      },
      {
        q: "Mobile Free Ceremony",
        a: "Help us stay in the moment! We’re keeping the ceremony camera-free, so please silence your phones and keep them away during the ceremony. Once the party starts at cocktail hour, we’d love for you to take as many photos as you’d like.",
      },
      {
        q: "Can I bring Children?",
        a: "While we love your little ones, our celebration will be an adults-only event, with the exception of children involved in the ceremony.",
      },
      {
        q: "Can I bring a plus one?",
        a: "We would like to celebrate this special moment with the people we love and dear to our hearts. Only those who are officially part of the guest list will be allowed to enter. We kindly ask that you respect our wishes on our special day.",
      },
      // {
      //   q: "Is there a dress code?",
      //   a: "Yes, we kindly request that guests wear semi-formal attire. To compliment our celebration, we also ask that you follow the wedding color theme provided on this website.",
      // },
      {
        q: "What time do I have to be at the church?",
        a: `The ceremony will begin promptly at 2:00 PM, so we kindly ask all guests to arrive by that time to allow time to get seated and settled before we begin. 
        
        For our **principal sponsors**, please also arrive by 2:00 PM or earlier if possible. Our coordinators will be there to hand you your boutonnieres and bouquets before the ceremony begins.`,
      },
      {
        q: "Is there parking space available?",
        a: "Yes, there is ample parking available at the church and reception venue for all our guests. ",
      },
      {
        q: "Are both venues accessible?",
        a: `Yes, both venues are accessible. If you are coming from Manila, we highly recommend planning your trip in advance and considering carpooling or arranging private transportation ahead of time to avoid any stress on the day. 

To make things easier, we’ve included location pins for both venues on Google Maps. The distance between the church and the reception area is only about 5 mins drive.

Kindly note that transportation to and from the wedding venues will be at guests’ own arrangement.
`,
      },
      {
        q: "What should I do if I have dietary restrictions?",
        a: "When you RSVP, there’s a space to let us know about any allergies or dietary restrictions—please don’t skip it! We’ll make sure our caterer takes care of you.",
      },
      // {
      //   q: "Do you have a gift registry?",
      //   a: "Having you there is the best gift we could ask for. If you’d like to contribute to our new chapter together, we welcome gifts that could fit into our medium sized luggage bags! Alternatively, we’d appreciate any monetary contributions to help us start our new journey together. It will be greatly appreciated and would be easier to take with us to Dubai.",
      // },
      // {
      //   q: "Is there accomodation?",
      //   a: `There are several Airbnb options and hotels nearby. We suggest checking out properties near San Antonio De Padua Church – Kaylaway, Nasugbu, Batangas.	
      //   *Please note that the cost of rooms will be covered by the guests.`,
      // },
    ],
    [],
  );

  const [openIndex, setOpenIndex] = useState<number>(-1);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  const renderAnswer = (text: string) => {
    const lines = text.split("\n");

    return lines.map((line, li) => {
      const parts = line.split("**");

      return (
        <p key={li} className="faq-item__p">
          {parts.map((part, pi) =>
            pi % 2 === 1 ? (
              <strong key={pi} className="faq-item__strong">
                {part}
              </strong>
            ) : (
              <span key={pi}>{part}</span>
            ),
          )}
        </p>
      );
    });
  };

  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  // ✅ ADD: compute correct maxHeight when opening + on resize
  useEffect(() => {
    const updateOpenPanel = () => {
      if (openIndex < 0) return;
      const panel = panelRefs.current[openIndex];
      if (!panel) return;
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    };

    updateOpenPanel();
    window.addEventListener("resize", updateOpenPanel);
    return () => window.removeEventListener("resize", updateOpenPanel);
  }, [openIndex]);

  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);
  const [memorialStarted, setMemorialStarted] = useState(false);

  const memorialQuoteFull =
    "“Those we love don’t go away, they walk beside us every day. Unseen, unheard, but always near, still loved, still missed, and very dear.”";

  const memorialNamePrefixFull = `In loving memory of ${""}`;
  const memorialStrongFull = "Mr. Alejandro M. Morales";
  const memorialNameSuffixFull = " – Father of the Bride";

  const [typedQuote, setTypedQuote] = useState("");
  const [typedNamePrefix, setTypedNamePrefix] = useState("");
  const [typedStrong, setTypedStrong] = useState("");
  const [typedNameSuffix, setTypedNameSuffix] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  // keep timeout ids so we can cancel on unmount
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    const el = bottomSentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          // ✅ reset states here (external callback) to avoid the React warning
          setTypedQuote("");
          setTypedNamePrefix("");
          setTypedStrong("");
          setTypedNameSuffix("");
          setTypingDone(false);

          setMemorialStarted(true);
          obs.disconnect();
        }
      },
      { root: null, threshold: 0.15 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!memorialStarted) return;

    let cancelled = false;

    const clearAllTimeouts = () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };

    const typeText = (
      full: string,
      setText: React.Dispatch<React.SetStateAction<string>>,
      speedMs: number,
    ) =>
      new Promise<void>((resolve) => {
        let i = 0;

        const tick = () => {
          if (cancelled) return;
          i += 1;
          setText(full.slice(0, i));

          if (i >= full.length) {
            resolve();
            return;
          }

          const id = window.setTimeout(tick, speedMs);
          timeoutsRef.current.push(id);
        };

        const first = window.setTimeout(tick, speedMs);
        timeoutsRef.current.push(first);
      });

    (async () => {
      await typeText(memorialQuoteFull, setTypedQuote, 32);
      await typeText(memorialNamePrefixFull, setTypedNamePrefix, 28);
      await typeText(memorialStrongFull, setTypedStrong, 32);
      await typeText(memorialNameSuffixFull, setTypedNameSuffix, 28);
      if (!cancelled) setTypingDone(true);
    })();

    return () => {
      cancelled = true;
      clearAllTimeouts();
    };
  }, [memorialStarted]);

  return (
    <section className="faq-page">
      <div className="faq-page__inner">
        {/* <img
          className="faq-page__titleImg"
          src="/faq.png"
          alt="Preguntas frecuentes"
          draggable={false}
        /> */}
        <h2 className="faq-page__heading">Guest Information</h2>

        <div className="faq-page__list">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={item.q}
                className={`faq-item ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-item__trigger"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-item__q">{item.q}</span>

                  <span className="faq-item__chev" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="faq-item__chevIcon"
                    >
                      <path
                        d="M7 10l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  ref={(el) => {
                    panelRefs.current[idx] = el;
                  }}
                  className="faq-item__panel"
                  style={{
                    maxHeight: isOpen
                      ? `${panelRefs.current[idx]?.scrollHeight ?? 0}px`
                      : 0,
                  }}
                >
                  <div className="faq-item__a">{renderAnswer(item.a)}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          ref={bottomSentinelRef}
          className="faq-page__bottomSentinel"
          aria-hidden="true"
        />

        <div
          className={`faq-page__memorial ${memorialStarted ? "is-typing" : ""} ${typingDone ? "is-done" : ""}`}
        >
          <p className="faq-page__memorialQuote">
            {memorialStarted ? typedQuote : memorialQuoteFull}
            <span className="faq-page__typeCaret" aria-hidden="true" />
          </p>

          <p className="faq-page__memorialName">
            {memorialStarted ? typedNamePrefix : memorialNamePrefixFull}{" "}
            <span className="faq-page__memorialNameStrong">
              {memorialStarted ? typedStrong : memorialStrongFull}
            </span>
            {memorialStarted ? typedNameSuffix : memorialNameSuffixFull}
          </p>
        </div>
      </div>
    </section>
  );
}
