import React from "react";
import MainOfferTransaction from "./main-offer-transaction";
import MainSwapTransaction from "./main-swap-transaction";
import { UserProfileContentProps } from "../user-profile-content";

function MainTransaction({
  safeListOffers,
  safeListSwaps,
}: UserProfileContentProps) {
  return (
    <div className="flex flex-col gap-8 items-center w-full mx-4 my-4 p-2">
      <MainOfferTransaction safeListOffers={safeListOffers} />
      <MainSwapTransaction safeListSwaps={safeListSwaps} />
    </div>
  );
}

export default MainTransaction;
