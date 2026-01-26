import { getCurrentSession } from "@/actions/auth";
import {
  getMainImageByListingId,
  getUserCurrentListings,
} from "@/actions/listings";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { ListingCatalog } from "@/components/sell/current-listing";
import MainSell from "@/components/sell/main-sell";

const SellPage = async () => {
  const { user } = await getCurrentSession();
  const { userListings } = await getUserCurrentListings();
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
  return (
    <div className="w-full flex flex-col">
      <Header user={user} />
      <div className="min-h-screen">
        <MainSell safeListings={safeListings} />
      </div>
      <Footer />
    </div>
  );
};
export default SellPage;
