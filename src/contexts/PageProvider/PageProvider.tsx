"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Page provider context type
type PageProviderContextType = {
  currentPage: string;
  currentPageSlug: string;
  setCurrentPage: (label: string) => void;
  setCurrentPageSlug: (slug: string) => void;
};

// Create the context
const PageProviderContext = createContext<PageProviderContextType | undefined>(
  undefined,
);

type PageProviderProps = {
  children: ReactNode;
  initialPage: string;
};

export const PageProvider = ({ children, initialPage }: PageProviderProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentPageSlug, setCurrentPageSlug] = useState("");

  return (
    <PageProviderContext.Provider
      value={{
        currentPage,
        currentPageSlug,
        setCurrentPage,
        setCurrentPageSlug,
      }}
    >
      {children}
    </PageProviderContext.Provider>
  );
};

// Hook to access the page context
export const usePage = () => {
  const context = useContext(PageProviderContext);

  if (!context) {
    throw new Error("usePage must be used within a PageProvider");
  }

  return context;
};
