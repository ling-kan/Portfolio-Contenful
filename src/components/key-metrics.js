import React, { useEffect, useState, useRef } from 'react'
import { motion, animate, useInView } from "framer-motion";

const parseValue = (value) => {
  const number = parseFloat(value.replace(/[^\d.-]/g, ""));
  const suffix = value.replace(/[\d.,-]/g, "");
  return { number, suffix };
};

const AnimatedNumber = ({ value, start }) => {
  const { number, suffix } = parseValue(value);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    const controls = animate(0, number, {
      duration: 3,
      ease: "easeOut",
      onUpdate: (v) => {
        if (value.includes(".")) {
          setDisplayValue(v.toFixed(1));
        } else {
          setDisplayValue(Math.floor(v));
        }
      },
    });

    return () => controls.stop();
  }, [number, value, start]);

  return (
    <span>
      {displayValue.toLocaleString()}
      <span className="ml-0.5">{suffix}</span>
    </span>
  );
};

const KeyMetrics = ({ list }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4"
    >
      {list.map((stat) => (
        <motion.div
          key={stat.label}
          className="flex flex-col gap-3 bg-background p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="font-serif text-4xl font-semibold text-foreground sm:text-5xl">
            <AnimatedNumber value={stat.value} start={isInView} />
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.12em] leading-relaxed text-muted-foreground">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

export default KeyMetrics
