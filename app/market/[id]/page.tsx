import {
  getDetailListingsById,
  getListingSameCategoryById,
  getMainImageByListingId,
} from "@/actions/listings";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MarketDetails from "@/components/market/market-details";
import { ListingCatalog } from "@/components/sell/current-listing";

async function MarketDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { listingInfo, listMedia } = await getDetailListingsById(id);
  if (!listingInfo || !listMedia) {
    return null;
  }
  const { listingsSameCategory } = await getListingSameCategoryById(id);

  const safeListing = {
    ...listingInfo,
    price: listingInfo.price.toNumber(),
    created_at: listingInfo.created_at.toISOString(),
    updated_at: listingInfo.updated_at.toISOString(),
    published_at: listingInfo.published_at?.toISOString() ?? null,
    reserved_at: listingInfo.reserved_at?.toISOString() ?? null,
    completed_at: listingInfo.completed_at?.toISOString() ?? null,
  };
  let safeListingSameCategory;
  if (listingsSameCategory) {
    safeListingSameCategory = (
      await Promise.all(
        listingsSameCategory.map(async (item) => {
          const { listingMedia } = await getMainImageByListingId(item.id);
          if (!listingMedia) {
            return null;
          }
          return {
            ...item,
            image_url: listingMedia.images_url,
            price: item.price.toNumber(),
            created_at: item.created_at.toISOString(),
            updated_at: item.updated_at.toISOString(),
            published_at: item.published_at?.toISOString() ?? null,
            reserved_at: item.reserved_at?.toISOString() ?? null,
            completed_at: item.completed_at?.toISOString() ?? null,
          };
        }),
      )
    ).filter((item): item is ListingCatalog => item !== null);
  }

  return (
    <div className="w-full flex-col">
      <Header />
      <div className="min-h-screen">
        <MarketDetails
          listingInfo={safeListing}
          listMedia={listMedia}
          listingsSameCategory={safeListingSameCategory}
        />
      </div>
      <Footer />
    </div>
  );
}

export default MarketDetailsPage;
