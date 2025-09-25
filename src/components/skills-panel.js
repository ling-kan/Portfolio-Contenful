import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';



const AccordionSkills = ({ list }) => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleAccordion = (index) => {
    setOpenIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const skillVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: "easeInOut" },
    }),
  };

  return (
    <section >

      <div className="space-y-6">
        {list.map((section, index) => (
          <div key={index} className="border border-grey-light rounded-lg py-4 px-6 shadow-sm">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center text-left text-grey font-semibold focus:outline-none"
            >
              <h3 className="text-black">{section.category}</h3>
              <p className="mx-3">{openIndexes.includes(index) ? "−" : "+"}</p>
            </button>

            <AnimatePresence>
              {openIndexes.includes(index) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="mt-4 flex flex-wrap gap-3"
                >
                  {section.skills.map((skill, i) => (
                    <Tippy key={skill.name} content={skill.description} placement="top" arrow={true}>
                      <motion.span
                        custom={i}
                        variants={skillVariants}
                        initial="hidden"
                        animate="visible"
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium hover:bg-blue-200 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                      >
                        {skill.name}
                      </motion.span>
                    </Tippy>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section >
  );
};

export default AccordionSkills;
