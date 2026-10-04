import { motion, type MotionValue } from "motion/react";
import { starClip } from "../lib";

const LONG = starClip(30, 40);
const SHORT = starClip(30, 44);

/** Sol da marca: dois anéis de raios pontudos e um disco, feitos só com CSS (clip-path). */
export function Sun({
  rotate,
  className = "",
}: {
  rotate?: MotionValue<number>;
  className?: string;
}) {
  return (
    <motion.div className={`relative aspect-square ${className}`} style={{ rotate }} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          clipPath: LONG,
          background: "radial-gradient(circle, #ff8a1f 0%, #ffb21a 38%, #ffd23f 72%)",
        }}
      />
      <div
        className="absolute inset-[13%] rotate-[6deg]"
        style={{
          clipPath: SHORT,
          background: "radial-gradient(circle, #f0286e 0%, #ff4e3c 45%, #ff6a2b 80%)",
        }}
      />
      <div
        className="absolute inset-[27%] rounded-full"
        style={{ background: "radial-gradient(circle at 50% 62%, #f0286e 0%, #ff4e5a 55%, #ff7a2b 100%)" }}
      />
    </motion.div>
  );
}
