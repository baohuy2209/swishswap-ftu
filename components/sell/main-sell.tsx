"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateListings from "@/components/sell/create-listing";
import CurrentListing, {
  ListingCatalog,
} from "@/components/sell/current-listing";
import {
  OfferType,
  CurrentBuyOffer,
} from "@/components/sell/current-buy-offer";
import {
  CurrentSwapOffer,
  SwapType,
} from "@/components/sell/current-swap-offer";
export interface MainSellProps {
  safeListings: ListingCatalog[];
  listOffers: OfferType[];
  safeListSwaps: SwapType[];
}
function MainSell({ safeListings, listOffers, safeListSwaps }: MainSellProps) {
  const [activeTab, setActiveTab] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const menuSidebar = [
    { id: 1, title: "Đăng sản phẩm", content: <CreateListings /> },
    {
      id: 2,
      title: "Các sản phẩm đang bán",
      content: <CurrentListing safeListings={safeListings} />,
    },
    {
      id: 3,
      title: "Các yêu cầu mua hàng",
      content: <CurrentBuyOffer listOffers={listOffers} />,
    },
    {
      id: 4,
      title: "Các yêu cầu trao đổi",
      content: <CurrentSwapOffer listSwaps={safeListSwaps} />,
    },
  ];
  React.useEffect(() => {
    if (activeTab) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);
  return (
    <div className="mt-4 mb-4 md:w-[90%] mx-auto w-full flex flex-col sm:flex-row gap-6 overflow-hidden">
      <div className="sm:w-56 h-fit flex sm:flex-col rounded-md bg-[#F3F4F4] dark:bg-white/5 backdrop-filter backdrop-blur-lg">
        {menuSidebar.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
                relative group flex items-center w-full px-4 py-3 sm:py-4 transition-all
                ${
                  activeTab === tab.id
                    ? "text-white dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                }
              `}
          >
            {/* Background highlight for active tab */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tabBackground"
                className="absolute inset-0 bg-gradient rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}

            {/* Tab content with icon and text */}
            <div className="flex items-center gap-3 z-10">
              <span className="font-medium">{tab.title}</span>
            </div>

            {/* Small dot indicator */}
            {activeTab === tab.id ? (
              <motion.div
                layoutId="activeDot"
                className="absolute right-3 w-2 h-2 rounded-full bg-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              />
            ) : (
              <div className="absolute right-3 w-2 h-2 rounded-full bg-gray-400/0 group-hover:bg-gray-400/30 transition-colors" />
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 h-fit relative rounded-md bg-white dark:bg-gray-900/80 backdrop-filter backdrop-blur-lg shadow-lg overflow-hidden">
        {/* Loading overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loader"
              className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                className="animate-spin h-8 w-8 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab content with animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="p-6 h-full overflow-y-auto"
          >
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <span>{menuSidebar.find((t) => t.id === activeTab)?.title}</span>
            </h3>
            <div className="prose dark:prose-invert mt-4">
              {menuSidebar.find((t) => t.id === activeTab)?.content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MainSell;
