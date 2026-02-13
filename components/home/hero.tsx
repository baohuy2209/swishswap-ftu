"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, PlayCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-50 to-white -z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/5 rounded-bl-full -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Chợ sinh viên <br />
              <span className="text-emerald-600">trao đổi mọi thứ</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-lg">
              Nơi sinh viên mua bán, trao đổi sách vở, đồ dùng học tập, đồ điện
              tử và nhiều hơn nữa – nhanh chóng, an toàn trong cộng đồng trường.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/sell">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-3 h-auto text-lg w-full sm:w-auto">
                  Đăng sản phẩm
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/market">
                <Button
                  variant="outline"
                  className="border-emerald-500 text-emerald-700 hover:bg-indigo-50 px-2 py-3 h-auto text-lg w-full sm:w-auto"
                >
                  Khám phá chợ sinh viên
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center text-sm text-gray-500">
              <div className="flex -space-x-2 mr-3">
                <Image
                  src="/user/image1.png"
                  alt="Student"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white object-cover"
                />
                <Image
                  src="/user/image2.png"
                  alt="Student"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white object-cover"
                />
                <Image
                  src="/user/image3.png"
                  alt="Student"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white object-cover"
                />
              </div>
              <span>
                Đã có <strong>1.200+</strong> sinh viên tham gia
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative animate-fade-in">
            <div className="aspect-video bg-white rounded-lg shadow-xl overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1605379399642-870262d3d051"
                alt="Student Marketplace"
                fill
                className="object-cover opacity-95"
                priority
              />

              <div className="absolute inset-0 bg-linear-to-tr from-indigo-600/30 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="secondary"
                  className="rounded-full h-16 w-16 p-0"
                >
                  <PlayCircle className="h-16 w-16 text-white" />
                </Button>
              </div>
            </div>

            {/* Badge bottom right */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2 text-green-600">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Giao dịch nhanh chóng
                  </h3>
                  <p className="text-sm text-gray-600">
                    Liên hệ trực tiếp – không phí trung gian
                  </p>
                </div>
              </div>
            </div>

            {/* Badge top left */}
            <div className="absolute -top-6 -left-6 bg-emerald-500 rounded-lg shadow-lg p-3 text-white">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">100%</span>
                <span className="text-sm">
                  Sinh viên
                  <br />
                  trong trường
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
