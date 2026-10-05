import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BaseballCap, Hoodie, Storefront, Sunglasses, TShirt } from "@phosphor-icons/react";
import { track } from "../analytics";
import { PRODUCTS, SHOP, type SbProduct } from "../content";
import { starClip, whatsappLink } from "../lib";
import { Reveal } from "./Reveal";

const KIND_ICON = { hoodie: Hoodie, tshirt: TShirt, glasses: Sunglasses, cap: BaseballCap } as const;

/** Fundo e cor do desenho de cada peça, todos da paleta da marca. */
const TONES = {
  rose: "bg-rose text-cream",
  teal: "bg-teal text-deep",
  sun: "bg-sun text-deep",
  flame: "bg-flame text-deep",
} as const;

const RAYS = starClip(16, 44);
const SPEED = 38; // pixels por segundo
const GAP = 20;

function productHref(p: SbProduct): string {
  return p.url || SHOP.url || whatsappLink(`Oi! Quero comprar: ${p.name} do Sun, Bar & Love.`);
}

function ProductCard({ product, hidden }: { product: SbProduct; hidden?: boolean }) {
  const Icon = KIND_ICON[product.kind];
  return (
    <a
      href={productHref(product)}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      tabIndex={hidden ? -1 : undefined}
      onClick={() => track("shop_click", { product_id: product.id })}
      className="group block w-[min(68vw,264px)] shrink-0 select-none"
      aria-label={`Comprar: ${product.name}`}
    >
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-card transition-transform duration-500 ease-out-expo group-hover:-translate-y-1.5 ${TONES[product.color]}`}
      >
        {product.image ? (
          <img src={product.image} alt="" draggable={false} loading="lazy" className="size-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-[8%] bg-current opacity-15" style={{ clipPath: RAYS }} />
            <Icon className="absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2" weight="duotone" />
          </>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl uppercase leading-tight">{product.name}</h3>
          {product.price && <p className="mt-0.5 text-cream/75">{product.price}</p>}
        </div>
        <span className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-sun px-4 text-sm font-semibold text-deep transition group-hover:bg-[#ffd24d]">
          Comprar <ArrowUpRight size={16} />
        </span>
      </div>
    </a>
  );
}

/**
 * Esteira: os produtos passam da esquerda para a direita sozinhos, param quando o mouse ou o foco
 * estão em cima, e podem ser arrastados. As cópias extras são só para o laço não ter emenda.
 */
function Conveyor() {
  const x = useMotionValue(0);
  const viewport = useRef<HTMLDivElement>(null);
  const firstSet = useRef<HTMLDivElement>(null);
  const loop = useRef(0);
  const paused = useRef(false);
  const dragging = useRef(false);
  const [copies, setCopies] = useState(3);

  useEffect(() => {
    const measure = () => {
      const set = firstSet.current;
      const view = viewport.current;
      if (!set || !view) return;
      loop.current = set.offsetWidth;
      setCopies(Math.max(2, Math.ceil(view.offsetWidth / set.offsetWidth) + 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (firstSet.current) ro.observe(firstSet.current);
    if (viewport.current) ro.observe(viewport.current);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    const width = loop.current;
    if (!width || dragging.current) return;
    let next = x.get();
    if (!paused.current) next += (SPEED * delta) / 1000; // os produtos andam da esquerda para a direita
    // o conteúdo se repete a cada `width`, então voltar o deslocamento não aparece na tela
    if (next > 0) next -= width;
    if (next <= -width) next += width;
    if (next !== x.get()) x.set(next);
  });

  const step = useCallback(
    (dir: 1 | -1) => {
      paused.current = true;
      void animate(x, x.get() - dir * (264 + GAP), { duration: 0.55, ease: [0.16, 1, 0.3, 1] }).then(() => {
        paused.current = false;
      });
    },
    [x],
  );

  // quem navega por teclado: o card focado entra na área visível
  const onFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    paused.current = true;
    const view = viewport.current;
    const card = (e.target as HTMLElement).closest("a");
    if (!view || !card) return;
    const v = view.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    if (c.left < v.left + 16) void animate(x, x.get() + (v.left + 16 - c.left), { duration: 0.4 });
    else if (c.right > v.right - 16) void animate(x, x.get() - (c.right - (v.right - 16)), { duration: 0.4 });
  };

  return (
    <div>
      <div
        ref={viewport}
        className="overflow-hidden"
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") paused.current = true;
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") paused.current = false;
        }}
        onFocus={onFocus}
        onBlur={() => {
          paused.current = false;
        }}
      >
        <motion.div
          className="flex w-max cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragMomentum={false}
          dragElastic={0}
          onDragStart={() => {
            dragging.current = true;
          }}
          onDragEnd={() => {
            dragging.current = false;
          }}
        >
          {Array.from({ length: copies }, (_, c) => (
            <div
              key={c}
              ref={c === 0 ? firstSet : undefined}
              className="flex shrink-0"
              style={{ gap: GAP, paddingRight: GAP }}
              aria-hidden={c > 0 || undefined}
              {...(c > 0 ? { inert: true } : {})}
            >
              {PRODUCTS.map((p) => (
                <ProductCard key={p.id} product={p} hidden={c > 0} />
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <ShopButton />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Produtos anteriores"
            className="flex size-12 items-center justify-center rounded-full border border-cream/30 transition hover:bg-cream/10 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Próximos produtos"
            className="flex size-12 items-center justify-center rounded-full bg-sun text-deep transition hover:bg-[#ffd24d] active:scale-95"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Com "reduzir movimento": lista simples que rola com o dedo ou o mouse, sem esteira automática. */
function StaticRail() {
  return (
    <div>
      <ul className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-[max(2rem,calc((100vw-72rem)/2+2rem))]">
        {PRODUCTS.map((p) => (
          <li key={p.id} className="snap-start">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-6 max-w-6xl px-5 md:px-8">
        <ShopButton />
      </div>
    </div>
  );
}

function ShopButton() {
  return (
    <a
      href={SHOP.url || whatsappLink("Oi! Quero ver a loja do Sun, Bar & Love.")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("shop_all_click")}
      className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full border border-cream/45 px-6 font-semibold text-cream transition hover:border-cream hover:bg-cream/10 active:scale-[0.97]"
    >
      <Storefront size={20} /> Ver a loja
    </a>
  );
}

export function Shop() {
  const reduce = useReducedMotion();
  return (
    <section id="loja" className="relative overflow-clip bg-[linear-gradient(to_bottom,#07232c,#0b3341_55%,#07232c)] py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
            Vista o <span className="text-sun">sol</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/85">
            Moletom, camiseta, óculos e chapéu da festa para levar o pôr do sol com você.
          </p>
        </Reveal>
      </div>
      <div className="mt-12">{reduce ? <StaticRail /> : <Conveyor />}</div>
    </section>
  );
}
