import { getCurrentSession } from "@/actions/auth";
import { get3TopsListing, getMainImageByListingId } from "@/actions/listings";
import HomePage from "@/components/home";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { ListingCatalog } from "@/components/sell/current-listing";
export default async function Home() {
  const { user } = await getCurrentSession();
  const { topListings } = await get3TopsListing();
  let safeListings;
  if (!topListings) {
    console.log("Không Load được dữ liệu từ server");
  } else {
    safeListings = (
      await Promise.all(
        topListings.map(async (item) => {
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
    <div className="w-full flex flex-col">
      <Header />
      <main>
        <HomePage safeListings={safeListings} />
      </main>
      <Footer />
    </div>
  );
}
