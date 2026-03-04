// RegaloPage.tsx
// import { useState } from "react";
import "./RegaloPage.css";

export default function RegaloPage() {
  // ✅ default should be CLOSED on initial load / refresh
  // const [isAportacionOpen, setIsAportacionOpen] = useState(false);
  // const [showIban, setShowIban] = useState(false);

  // const toggleAportacion = () => {
  //   setIsAportacionOpen((v) => {
  //     const next = !v;
  //     if (!next) setShowIban(false);
  //     return next;
  //   });
  // };

  return (
    <section className="regalo-page">
      <div className="regalo-page__inner">
        {/* Left */}
        <div className="regalo-page__left">
          <h1 className="regalo-page__title">Gift</h1>
          <h1 className="regalo-page__registry">REGISTRY</h1>

          <img
            className="regalo-page__bird"
            src="/bird.png"
            alt="Bird illustration"
            loading="lazy"
          />
        </div>

        {/* Right */}
        <div className="regalo-page__right">
          <h2 className="regalo-page__headline">
            Your presence is the
            <br />
            greatest gift of all.
          </h2>

          <p className="regalo-page__text">
            Having you there is the best gift we could ask for. If you’d like to
            contribute to our new chapter together, we welcome gifts that are
            light weight and could fit into our medium sized luggage.
          </p>
          <p className="regalo-page__text">
            Alternatively, we’d appreciate any monetary contributions to help us
            start our new journey together. It will be greatly appreciated and
            would be easier to take with us to Dubai.
          </p>

          {/* Collapsible: Aportación */}
          {/* <div className="regalo-page__collapse">
            <button
              type="button"
              className="regalo-page__collapseHeader"
              onClick={toggleAportacion}
              aria-expanded={isAportacionOpen}
            >
              <span className="regalo-page__collapseTitle">
                Bless us with a gift
              </span>
              <span
                className={`regalo-page__chev ${isAportacionOpen ? "is-open" : ""}`}
                aria-hidden="true"
              >
                ▴
              </span>
            </button>

            <div
              className={`regalo-page__collapseBody ${isAportacionOpen ? "is-open" : ""}`}
            >
              <p className="regalo-page__collapseText">
           
              </p>

              {!showIban ? (
                <button
                  type="button"
                  className="regalo-page__ibanBtn"
                  onClick={() => setShowIban(true)}
                >
                  Show IBAN
                </button>
              ) : (
                <div className="regalo-page__ibanBox">
                  <div className="regalo-page__ibanLabel">IBAN</div>
                  <div className="regalo-page__ibanValue">
                    AE00 0000 0000 0000 0000 0000
                  </div>
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
