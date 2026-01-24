import { getCurrentSession } from "@/actions/auth";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MainSell from "@/components/sell/main-sell";
import React from "react";

const SellPage = async () => {
  const { user } = await getCurrentSession();

  return (
    <div className="w-full flex flex-col">
      <Header user={user} />
      <div className="min-h-screen">
        <MainSell />
      </div>
      <Footer />
    </div>
  );
};
export default SellPage;
