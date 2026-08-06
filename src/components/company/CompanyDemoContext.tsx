"use client";

import React, { createContext, useContext, useState } from "react";
import CompanyDemoModal from "./CompanyDemoModal";

interface CompanyDemoContextType {
  openCompanyModal: () => void;
  closeCompanyModal: () => void;
  isCompanyModalOpen: boolean;
}

const CompanyDemoContext = createContext<CompanyDemoContextType>({
  openCompanyModal: () => {},
  closeCompanyModal: () => {},
  isCompanyModalOpen: false,
});

export function CompanyDemoProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CompanyDemoContext.Provider
      value={{
        openCompanyModal: () => setIsOpen(true),
        closeCompanyModal: () => setIsOpen(false),
        isCompanyModalOpen: isOpen,
      }}
    >
      {children}
      <CompanyDemoModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </CompanyDemoContext.Provider>
  );
}

export function useCompanyDemoModal() {
  return useContext(CompanyDemoContext);
}
