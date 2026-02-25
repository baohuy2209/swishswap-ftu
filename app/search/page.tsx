import { getMainImageByListingId, searchListing } from "@/actions/listings";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import SearchResult from "@/components/search/search-result";
import { ListingCatalog } from "@/components/sell/current-listing";
import { removeVietnameseTones } from "@/lib/utils";

type SearchPageProps = {
  searchParams: Promise<{ query: string }>;
};
const SearchListingPage = async ({ searchParams }: SearchPageProps) => {
  const { query } = await searchParams;
  const decodeQuery = removeVietnameseTones(decodeURIComponent(query));
  const listings = await searchListing(decodeQuery);
  const safeListings = (
    await Promise.all(
      listings.map(async (item) => {
        const { listingMedia } = await getMainImageByListingId(item.id);
        if (!listingMedia) {
          return null;
        }
        return {
          ...item,
          image_url: listingMedia.images_url,
          price: Number(item.price),
          created_at: new Date(item.created_at).toISOString(),
          updated_at: new Date(item.updated_at).toISOString(),
          published_at: item.published_at
            ? new Date(item.published_at).toISOString()
            : null,
          reserved_at: item.reserved_at
            ? new Date(item.reserved_at).toISOString()
            : null,
          completed_at: item.completed_at
            ? new Date(item.completed_at).toISOString()
            : null,
        };
      }),
    )
  ).filter((item): item is ListingCatalog => item !== null);
  return (
    <div className="w-full flex flex-col">
      <Header />
      <div className="min-h-screen">
        <SearchResult safeListings={safeListings} />
      </div>
      <Footer />
    </div>
  );
};

export default SearchListingPage;
