import { getCurrentSession } from "@/actions/auth";
import HomePage from "@/components/home";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
export default async function Home() {
  const { user } = await getCurrentSession();

  return (
    <div className="w-full flex flex-col">
      <Header user={user} />
      <main className="min-h-screen">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}
