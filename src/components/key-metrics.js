import React, { useEffect, useState } from 'react'
import { motion, animate } from "framer-motion";

// Split numeric part + suffix/prefix
const parseValue = (value) => {
  const number = parseFloat(value.replace(/[^\d.-]/g, "")); // numeric part
  const suffix = value.replace(/[\d.,-]/g, ""); // non-numeric part
  return { number, suffix };
};

const AnimatedNumber = ({ value }) => {
  const { number, suffix } = parseValue(value);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, number, {
      duration: 3, // slower (was 1.5)
      ease: "easeOut",
      onUpdate: (v) => {
        // keep decimals if original had them
        if (value.includes(".")) {
          setDisplayValue(v.toFixed(1));
        } else {
          setDisplayValue(Math.floor(v));
        }
      },
    });
    return () => controls.stop();
  }, [number, value]);

  return (
    <span>
      {displayValue.toLocaleString()}
      <span className="ml-0.5">{suffix}</span> {/* tiny spacing */}
    </span>
  );
};

const KeyMetrics = ({ list }) => {
  return (
    <div className="flex flex-wrap justify-left gap-8">
      {list.map((stat) => (
        <motion.div
          key={stat.label}
          className="rounded-lg w-35"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-2">
            <AnimatedNumber value={stat.value} />
          </h2>
          <p className="text-sm text-grey">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default KeyMetrics;
