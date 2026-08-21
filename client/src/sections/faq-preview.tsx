import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useFaqItems } from "@/lib/queries";

export function FaqPreview() {
  const { data: items, isLoading } = useFaqItems();
  const [openId, setOpenId] = useState<string | null>(null);

  if (!isLoading && !items?.length) return null;

  const preview = items?.slice(0, 5);

  return (
    <section className="py-14 sm:py-20 lg:py-28">
      <div className="container-kk grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="eyebrow text-gold">Good to Know</span>
          <h2 className="mt-4 text-[2rem] leading-tight xs:text-4xl sm:text-5xl">
            Questions,
            <br />
            <span className="italic">answered.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate">
            The things guests ask us most. If yours isn't here, we're one message away.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              to="/faq"
              className="font-sans text-sm font-semibold text-terracotta underline-offset-4 hover:underline"
            >
              Read all FAQs →
            </Link>
            <Link to="/contact" className="font-sans text-sm font-semibold text-teal underline-offset-4 hover:underline">
              Contact us
            </Link>
          </div>
        </motion.div>

        <div className="flex flex-col">
          {isLoading
            ? [0, 1, 2].map((i) => <div key={i} className="mb-3 h-16 animate-pulse rounded-xl bg-teal/5" />)
            : preview?.map((item, index) => {
                const open = openId === item._id;
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
                    className="border-b border-teal/12 first:border-t"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : item._id)}
                      aria-expanded={open}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left sm:gap-6"
                    >
                      <span className="font-display text-base leading-snug text-teal xs:text-lg sm:text-xl">{item.question}</span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal/8 text-teal">
                        {open ? <Minus size={15} /> : <Plus size={15} />}
                      </span>
                    </button>
                    {open && <p className="pb-6 pr-4 text-sm leading-relaxed text-slate sm:pr-14">{item.answer}</p>}
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
