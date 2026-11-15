"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { formatTemp } from "@/lib/utils";

type UnitType = "C" | "F";

interface UnitContextType {
  unit: UnitType;
  setUnit: (unit: UnitType) => void;
  toggleUnit: () => void;
  formatTemperature: (celsius: number) => string;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnitState] = useState<UnitType>("C");

  useEffect(() => {
    const saved = localStorage.getItem("weathernow_unit");
    if (saved === "C" || saved === "F") {
      setUnitState(saved);
    }
  }, []);

  const setUnit = (newUnit: UnitType) => {
    setUnitState(newUnit);
    localStorage.setItem("weathernow_unit", newUnit);
  };

  const toggleUnit = () => {
    setUnit(unit === "C" ? "F" : "C");
  };

  const formatTemperature = (celsius: number) => {
    return formatTemp(celsius, unit);
  };

  return (
    <UnitContext.Provider value={{ unit, setUnit, toggleUnit, formatTemperature }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error("useUnit must be used within a UnitProvider");
  }
  return context;
}

