import Link from "next/link";

export function Hero() {
  return (
    <>
      <section className="mobile-hero lg:hidden">
        <div className="mobile-hero-content">
          <h1>
            WELLNESS
            <br />
            REFINED<span>.</span>
          </h1>
          <p>PERSONALIZED AROUND YOU.</p>
          <Link href="/products" className="mobile-hero-button">
            LEARN MORE
          </Link>
        </div>
      </section>

      <section className="desktop-hero hidden lg:block">
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-tag">ELEVATED WELLNESS</span>
          <h1>
            Personalized
            <br />
            Wellness<span>.</span>
          </h1>
          <p>PERSONALIZED AROUND YOU.</p>
          <div className="hero-actions">
            <Link href="/products" className="primary-btn">
              LEARN MORE
            </Link>
            <Link href="/become-a-patient" className="secondary-btn">
              GET STARTED
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
