import React from 'react';
import { motion } from 'framer-motion';

export function StatsStrip({ stats }) {
  return (
    <div className="stats-strip">
      {stats.map((s) => (
        <motion.div
          key={s.label}
          className="stat-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}</div>
        </motion.div>
      ))}
    </div>
  );
}


