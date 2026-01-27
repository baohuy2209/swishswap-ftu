"use client";

import { useEffect, useRef } from "react";
import { increaseViews } from "@/actions/listings";

export default function ViewCounter({ listingId }: { listingId: string }) {
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;

    increaseViews(listingId);
  }, [listingId]);

  return null;
}
