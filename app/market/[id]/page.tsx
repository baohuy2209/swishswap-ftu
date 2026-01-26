import { getCurrentSession } from "@/actions/auth";
import { getDetailListingsById } from "@/actions/listings";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MarketDetails from "@/components/market/market-details";

async function MarketDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = await getCurrentSession();
  const { id } = await params;
  const { listingInfo, listMedia } = await getDetailListingsById(id);
  if (!listingInfo || !listMedia) {
    return null;
  }
  const safeListing = {
    ...listingInfo,
    price: listingInfo.price.toNumber(),
    created_at: listingInfo.created_at.toISOString(),
    updated_at: listingInfo.updated_at.toISOString(),
    published_at: listingInfo.published_at?.toISOString() ?? null,
    reserved_at: listingInfo.reserved_at?.toISOString() ?? null,
    completed_at: listingInfo.completed_at?.toISOString() ?? null,
  };
  return (
    <div className="w-full flex-col">
      <Header user={user} />
      <div className="min-h-screen">
        <MarketDetails listingInfo={safeListing} listMedia={listMedia} />
      </div>
      <Footer />
    </div>
  );
}

export default MarketDetailsPage;
