// src/components/ui/card.js

import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl shadow bg-zinc-200 border border-zinc-700 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);
