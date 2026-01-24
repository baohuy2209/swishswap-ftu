import { getCurrentSession } from "@/actions/auth";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MainMarket from "@/components/market/main-market";
import React from "react";

async function MarketPlace() {
  const { user } = await getCurrentSession();
  return (
    <div className="w-full flex flex-col">
      <Header user={user} />
      <div className="min-h-screen">
        <MainMarket />
      </div>
      <Footer />
    </div>
  );
}

export default MarketPlace;
