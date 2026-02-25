export const dynamic = "force-dynamic";
import {
  getListHasSameUniversity,
  getMainImageByListingId,
  getMarketList,
} from "@/actions/listings";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MainMarket from "@/components/market/main-market";
import { ListingCatalog } from "@/components/sell/current-listing";

async function MarketPlace() {
  const { userListings } = await getMarketList();
  const listing_from_same_university = await getListHasSameUniversity();
  if (userListings === null) {
    return null;
  }
  const safeListings = (
    await Promise.all(
      userListings.map(async (item) => {
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
  const listingFromSameUni = await Promise.all(
    listing_from_same_university.map(async (item) => {
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
  );
  return (
    <div className="w-full flex flex-col">
      <Header />
      <div className="min-h-screen">
        <MainMarket
          safeListings={safeListings}
          listingFromSameUni={listingFromSameUni}
        />
      </div>
      <Footer />
    </div>
  );
}

export default MarketPlace;
