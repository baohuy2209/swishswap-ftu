import { getCurrentSession } from "@/actions/auth";
import { getCurrentUserBilling } from "@/actions/billing";
import { getCategoryById } from "@/actions/category";
import { getTitleByListingId } from "@/actions/listings";
import { getUserOffers } from "@/actions/offer";
import { getInfoToReview } from "@/actions/order";
import { getUserSwaps } from "@/actions/swap";
import { getNameUserById } from "@/actions/user";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import UserProfileContent from "@/components/user-profile/user-profile-content";

async function ProfilePage() {
  const { user } = await getCurrentSession();
  const listOffers = await getUserOffers();
  const listSwap = await getUserSwaps();
  const listBillings = await getCurrentUserBilling();
  const listInfoReview = await getInfoToReview(user);
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
        product_price: item.product_price?.toNumber(),
        pickup_time: item.created_at.toISOString(),
        category_id: (await getCategoryById(item.id)).category?.name,
        sender_id: await getNameUserById(item.sender_id),
        listing_id: await getTitleByListingId(item.listing_id),
        created_at: item.created_at.toISOString(),
        updated_at: item.updated_at.toISOString(),
      };
    }),
  );
  const safeListBillings = await Promise.all(
    listBillings.map(async (item) => {
      return {
        ...item,
        amount: item.amount.toNumber(),
        created_at: item.created_at.toISOString(),
        paid_at: item.paid_at?.toISOString(),
      };
    }),
  );
  return (
    <div className="w-full flex flex-col">
      <Header />
      <div className="min-h-screen">
        <UserProfileContent
          safeListOffers={safeListOffers}
          safeListSwaps={safeListSwaps}
          safeListBillings={safeListBillings}
          listInfoReview={listInfoReview}
        />
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;
