import { Link } from 'react-router-dom';

export default function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="max-w-md w-full text-center bg-surface rounded-3xl border border-stroke p-12 shadow-2xl">
        <div className="mb-6 flex items-center justify-center">
          <span className="text-5xl">✅</span>
        </div>
        <h1 className="text-4xl font-display text-text-primary mb-4">Thank You!</h1>
        <p className="text-muted text-base leading-relaxed mb-8">
          Your enquiry has been received. Our team will be in touch with you shortly.
        </p>
        <Link
          to="/"
          className="inline-block rounded-xl bg-text-primary px-8 py-3 text-sm font-medium text-bg hover:opacity-80 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
