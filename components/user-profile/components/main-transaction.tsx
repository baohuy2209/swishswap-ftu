import React from "react";
import MainOfferTransaction from "./main-offer-transaction";
import MainSwapTransaction from "./main-swap-transaction";
import { OfferType } from "@/components/sell/current-buy-offer";
import { SwapType } from "@/components/sell/current-swap-offer";
export interface MainTransactionProps {
  safeListOffers: OfferType[];
  safeListSwaps: SwapType[];
}
function MainTransaction({
  safeListOffers,
  safeListSwaps,
}: MainTransactionProps) {
  return (
    <div className="flex flex-col gap-8 items-center w-full mx-4 my-4 p-2">
      <MainOfferTransaction safeListOffers={safeListOffers} />
      <MainSwapTransaction safeListSwaps={safeListSwaps} />
    </div>
  );
}

export default MainTransaction;
