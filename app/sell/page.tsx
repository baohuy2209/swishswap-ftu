import { getCurrentSession } from "@/actions/auth";
import { getCategoryById } from "@/actions/category";
import {
  getMainImageByListingId,
  getTitleByListingId,
  getUserCurrentListings,
} from "@/actions/listings";
import { getUserOffers } from "@/actions/offer";
import { getUserSwaps } from "@/actions/swap";
import { getNameUserById } from "@/actions/user";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { ListingCatalog } from "@/components/sell/current-listing";
import MainSell from "@/components/sell/main-sell";

const SellPage = async () => {
  const { user } = await getCurrentSession();
  const { userListings } = await getUserCurrentListings();
  const listOffers = await getUserOffers();
  const listSwap = await getUserSwaps();
  if (userListings === null) {
    return null;
  }
  const safeListOffers = await Promise.all(
    listOffers.map(async (item) => {
      return {
        ...item,
        sender_id: await getNameUserById(user?.id),
        listing_id: await getTitleByListingId(item.listing_id),
        price_offered: item.price_offered?.toNumber(),
        created_at: item.created_at.toISOString(),
        updated_at: item.updated_at.toISOString(),
        pickup_time: item.created_at.toISOString(),
        responded_at: item.updated_at.toISOString(),
      };
    }),
  );
  const safeListSwaps = await Promise.all(
    listSwap.map(async (item) => {
      return {
        ...item,
        category_id: (await getCategoryById(item.id)).category?.name,
        sender_id: await getNameUserById(item.sender_id),
        listing_id: await getTitleByListingId(item.listing_id),
        created_at: item.created_at.toISOString(),
        updated_at: item.updated_at.toISOString(),
      };
    }),
  );
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
        <MainSell
          safeListings={safeListings}
          listOffers={safeListOffers}
          safeListSwaps={safeListSwaps}
        />
      </div>
      <Footer />
    </div>
  );
};
export default SellPage;
