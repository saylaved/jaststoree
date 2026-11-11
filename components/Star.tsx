/** The broken star from the JASST wordmark, redrawn as a glyph. */
export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 1.5l2.3 6.6 6.9-.6-5.4 4.4 2.6 6.5L12 14.6 5.6 18.4l2.6-6.5L2.8 7.5l6.9.6L12 1.5z" />
    </svg>
  );
}
