import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-600 to-emerald-800 opacity-95 -z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 rounded-bl-full -z-10" />

      <div className="container mx-auto relative z-10">
        <div className="text-center text-white max-w-3xl mx-auto">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Tham gia chợ sinh viên ngay hôm nay
          </h2>

          {/* Subtitle */}
          <p className="text-xl opacity-90 mb-8">
            Mua bán – trao đổi đồ dùng sinh viên một cách nhanh chóng, tiết kiệm
            và an toàn trong cộng đồng của bạn.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="bg-white text-emerald-700 hover:bg-gray-100 border-2 border-white px-3 py-2 h-auto text-lg">
                Đăng ký miễn phí
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/market">
              <Button className="bg-white text-emerald-700 hover:bg-gray-100 border-2 border-white px-3 py-2 h-auto text-lg">
                Khám phá chợ đồ cũ
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">5 phút</div>
              <div className="text-sm opacity-80">Đăng tin bán</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm opacity-80">Sinh viên xác thực</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Tiết kiệm</div>
              <div className="text-sm opacity-80">Chi phí sinh hoạt</div>
            </div>
            <div>
              <div className="text-3xl font-bold">1.000+</div>
              <div className="text-sm opacity-80">Món đồ đã trao đổi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
