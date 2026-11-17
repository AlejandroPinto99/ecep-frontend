// Ícono de jeringa (Heroicons no incluye uno). Hereda el color con currentColor.
export const SyringeIcon = ({ className = "h-5 w-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M18 2l4 4" />
    <path d="M17 7l3-3" />
    <path d="M19 9L9.5 18.5a2.12 2.12 0 0 1-3 0l-1-1a2.12 2.12 0 0 1 0-3L15 5" />
    <path d="M9 11l4 4" />
    <path d="M5 19l-3 3" />
    <path d="M14 4l6 6" />
  </svg>
);
