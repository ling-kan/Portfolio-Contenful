import React, { useEffect, useState, useRef } from 'react'
import { motion, animate, useInView } from "framer-motion";

// Split numeric part + suffix/prefix
const parseValue = (value) => {
  const number = parseFloat(value.replace(/[^\d.-]/g, "")); // numeric part
  const suffix = value.replace(/[\d.,-]/g, ""); // non-numeric part
  return { number, suffix };
};

const AnimatedNumber = ({ value, start }) => {
  const { number, suffix } = parseValue(value);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!start) return; // only animate when in view

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
  const isInView = useInView(ref, { once: true, margin: "-100px" }); // trigger when near viewport

  return (
    <div ref={ref} className="flex flex-wrap justify-left gap-8">
      {list.map((stat) => (
        <motion.div
          key={stat.label}
          className="rounded-lg w-35"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-2">
            <AnimatedNumber value={stat.value} start={isInView} />
          </h2>
          <p className="text-sm text-grey">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default KeyMetrics
