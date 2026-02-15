import {
  getMainImageByListingId,
  getMarketList,
  getSellerListing,
} from "@/actions/listings";
import { getSellerReview } from "@/actions/reviews";
import { getSellerById, getUserById } from "@/actions/user";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import SellerProfile from "@/components/seller-profile/seller-profile";

async function VendorProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await getSellerById(id);
  return (
    <div className="w-full flex-col">
      <Header />
      <div className="min-h-screen">
        <SellerProfile safeUser={user} />
      </div>
      <Footer />
    </div>
  );
}

export default VendorProfileDetailPage;
