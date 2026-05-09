export const WHATSAPP_NUMBER = "919370476464";
export const WHATSAPP_MESSAGE = "Hello Mad Mistri, I would like to discuss a commercial furniture project.";
export const whatsappUrl = (msg: string = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-gold/40 blur-xl group-hover:bg-gold/60 transition-all duration-700 animate-pulse" />
      <span className="absolute inset-0 rounded-full bg-gold/30 animate-ping" />
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gold text-ink shadow-[0_10px_40px_-10px_rgba(199,166,106,0.6)] hover:scale-110 transition-transform duration-500">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
          <path d="M19.05 4.91A10 10 0 0 0 4.6 17.61L3 22l4.49-1.57A10 10 0 1 0 19.05 4.91Zm-7.04 15.4a8.42 8.42 0 0 1-4.3-1.18l-.31-.18-2.66.93.89-2.59-.2-.33a8.43 8.43 0 1 1 6.58 3.35Zm4.62-6.31c-.25-.13-1.49-.74-1.72-.82s-.4-.13-.57.13-.65.82-.8.99-.3.19-.55.06a6.85 6.85 0 0 1-2.02-1.25 7.6 7.6 0 0 1-1.4-1.74c-.15-.25 0-.39.11-.51.11-.11.25-.3.38-.45a1.7 1.7 0 0 0 .25-.42.46.46 0 0 0 0-.44c-.06-.13-.57-1.37-.78-1.88s-.41-.43-.57-.43h-.49a.94.94 0 0 0-.68.32 2.85 2.85 0 0 0-.9 2.13 4.94 4.94 0 0 0 1.04 2.64 11.34 11.34 0 0 0 4.34 3.84c2.71 1.07 2.71.71 3.2.67a2.6 2.6 0 0 0 1.74-1.22 2.15 2.15 0 0 0 .15-1.22c-.06-.11-.23-.18-.48-.31Z"/>
        </svg>
      </span>
    </a>
  );
}
