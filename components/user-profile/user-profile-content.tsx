"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/providers/session-provider";
import MainUserProfile from "@/components/user-profile/components/main-user-profile";
import MainBilling from "@/components/user-profile/components/main-billing";
import MainSettings from "@/components/user-profile/components/main-settings";
import MainTransaction from "@/components/user-profile/components/main-transaction";
import { OfferType } from "../sell/current-buy-offer";
import { SwapType } from "../sell/current-swap-offer";
export interface UserProfileContentProps {
  safeListOffers: OfferType[];
  safeListSwaps: SwapType[];
}
function UserProfileContent({
  safeListOffers,
  safeListSwaps,
}: UserProfileContentProps) {
  const user = useSession();
  return (
    <div className="lg:w-[90%] w-[95%] mx-auto mb-8">
      <section className="mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-linear-to-r from-green-600 via-emerald-600 to-teal-700 p-8 text-white"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">
                Tài khoản sinh viên
              </Badge>
              <h2 className="text-3xl font-bold">
                Quản lý tài khoản & giao dịch của bạn
              </h2>
              <p className="max-w-[600px] text-white/80">
                Cập nhật thông tin cá nhân, theo dõi đơn mua bán – trao đổi, và
                quản lý phương thức thanh toán một cách an toàn, tiện lợi trong
                cộng đồng sinh viên.
              </p>
            </div>
            <div className="hidden lg:block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 50,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="relative h-40 w-40"
              >
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />
                <div className="absolute inset-4 rounded-full bg-white/20" />
                <div className="absolute inset-8 rounded-full bg-white/30" />
                <div className="absolute inset-12 rounded-full bg-white/40" />
                <div className="absolute inset-16 rounded-full bg-white/50" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
      <div className="space-y-8 mt-4">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="w-fit flex flex-row gap-2 flex-wrap">
            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="billing">Hóa đơn</TabsTrigger>
            <TabsTrigger value="history-transaction">
              Theo dõi các giao dịch
            </TabsTrigger>
            <TabsTrigger value="preferences">Cài đặt</TabsTrigger>
            <TabsTrigger value="preferences">
              Các đơn hàng cần đánh giá
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <MainUserProfile user={user} />
          </TabsContent>
          <TabsContent value="billing" className="space-y-6">
            <MainBilling />
          </TabsContent>
          <TabsContent value="preferences" className="space-y-6">
            <MainSettings />
          </TabsContent>
          <TabsContent value="history-transaction" className="space-y-6">
            <MainTransaction
              safeListOffers={safeListOffers}
              safeListSwaps={safeListSwaps}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserProfileContent;
