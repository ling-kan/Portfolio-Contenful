import React from 'react'
import { motion } from "motion/react";

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
          <h2 className="text-3xl font-bold mb-2">{stat.value}</h2>
          <p className="text-sm text-grey">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default KeyMetrics
