// Footer.tsx
import "./Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__heart" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="footer__heartIcon"
          >
            <path
              d="M12.001 20.3s-7.2-4.35-9.6-8.55C.851 9.1 1.6 6.55 3.55 5.1c1.8-1.35 4.35-1 5.95.65L12 8.35l2.5-2.6c1.6-1.65 4.15-2 5.95-.65 1.95 1.45 2.7 4 1.15 6.65-2.4 4.2-9.6 8.55-9.6 8.55Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 className="footer__names">Rafael &amp; Yasmine</h3>
        <p className="footer__date">14 February 2026</p>
        <p className="footer__credit">With all our love</p>
      </div>
    </footer>
  )
}
