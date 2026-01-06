"use client";

import { ReactNode, useEffect } from "react";
import { usePage } from "@/contexts";

type PageWrapperProps = {
  children: ReactNode;
  currentPage: string;
  currentPageSlug?: string;
};

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  currentPage,
  currentPageSlug = "",
}: PageWrapperProps) => {
  const page = usePage();

  useEffect(() => {
    page.setCurrentPage(currentPage);
    page.setCurrentPageSlug(currentPageSlug);
  }, [currentPage, currentPageSlug, page]);

  return <>{children}</>;
};

export default PageWrapper;
