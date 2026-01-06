"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PreviewListener: React.FC = () => {
  const router = useRouter();
  const [serverUrl, setServerUrl] = useState<string>("");

  useEffect(() => {
    const url =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000");
    setServerUrl(url);
  }, []);

  if (!serverUrl) {
    return null;
  }

  return <RefreshRouteOnSave refresh={router.refresh} serverURL={serverUrl} />;
};

export default PreviewListener;
