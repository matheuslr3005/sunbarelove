import { useState } from "react";
import { Plus, WhatsappLogo } from "@phosphor-icons/react";
import { track } from "../analytics";
import { FAQ } from "../content";
import { whatsappLink } from "../lib";
import { Reveal } from "./Reveal";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="duvidas" className="bg-night-2 px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <Reveal>
          <h2 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
            Ficou com <span className="text-sun">dúvida?</span>
          </h2>
          <a
            href={whatsappLink("Oi! Tenho uma dúvida sobre o Sun, Bar & Love.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "faq" })}
            className="mt-8 inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full border border-cream/45 px-6 font-semibold transition hover:border-cream hover:bg-cream/10 active:scale-[0.97]"
          >
            <WhatsappLogo size={20} weight="fill" /> Chamar no WhatsApp
          </a>
        </Reveal>

        <ul>
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-cream/15 first:border-t">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => {
                      setOpen(isOpen ? null : i);
                      if (!isOpen) track("faq_open", { question: item.q });
                    }}
                    className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold md:text-xl"
                  >
                    {item.q}
                    <Plus
                      size={22}
                      className={`shrink-0 text-sun transition-transform duration-300 ease-out-expo ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out-expo ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-prose pb-6 leading-relaxed text-cream/85">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
