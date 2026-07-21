"use client";

import { ReactNode } from "react";

interface Props {
  settings: ReactNode;
  preview: ReactNode;
}

export default function MarketingLayout({
  settings,
  preview,
}: Props) {
  return (
    <>
      <style>{`
        .wolf-marketing{
          display:grid;
          grid-template-columns:1fr;
          gap:32px;
          align-items:start;
        }

        .wolf-settings{
          min-width:0;
        }

        .wolf-preview{
          min-width:0;
        }

        @media (min-width:1100px){

          .wolf-marketing{

            grid-template-columns:
              minmax(360px,420px)
              minmax(0,1fr);

            gap:40px;

          }

          .wolf-settings{

            position:sticky;

            top:24px;

            align-self:start;

          }

        }

        @media (min-width:1400px){

          .wolf-marketing{

            grid-template-columns:
              420px
              minmax(700px,1fr);

          }

        }
      `}</style>

      <div className="wolf-marketing">

        <aside className="wolf-settings">
          {settings}
        </aside>

        <section className="wolf-preview">
          {preview}
        </section>

      </div>
    </>
  );
}


