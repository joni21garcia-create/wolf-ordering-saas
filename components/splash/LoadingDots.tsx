"use client";

export default function LoadingDots() {
  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <span className="wolf-dot wolf-dot-1" />
        <span className="wolf-dot wolf-dot-2" />
        <span className="wolf-dot wolf-dot-3" />
      </div>

      <style jsx>{`
        .wolf-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #f97316;
          opacity: .25;
          box-shadow: 0 0 8px rgba(249,115,22,.35);
          animation: wolfLoading 1.2s infinite ease-in-out;
        }

        .wolf-dot-2 {
          animation-delay: .2s;
        }

        .wolf-dot-3 {
          animation-delay: .4s;
        }

        @keyframes wolfLoading {
          0%,
          100% {
            opacity: .25;
            transform: scale(.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.35);
            box-shadow:
              0 0 12px rgba(249,115,22,.6),
              0 0 28px rgba(249,115,22,.35);
          }
        }
      `}</style>
    </>
  );
}