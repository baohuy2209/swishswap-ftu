import {
  ShoppingBag,
  Users,
  RefreshCcw,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

export default function FeaturesSection() {
  const features = [
    {
      icon: <ShoppingBag className="h-10 w-10 text-emerald-600" />,
      title: "Mua bán đồ sinh viên",
      description:
        "Dễ dàng mua, bán hoặc thanh lý sách vở, đồ điện tử, đồ dùng cá nhân ngay trong cộng đồng sinh viên.",
    },
    {
      icon: <Users className="h-10 w-10 text-emerald-600" />,
      title: "Cộng đồng sinh viên",
      description:
        "Kết nối sinh viên trong cùng trường hoặc khu vực để trao đổi đồ nhanh chóng, an toàn và tiện lợi.",
    },
    {
      icon: <RefreshCcw className="h-10 w-10 text-emerald-600" />,
      title: "Trao đổi – tái sử dụng",
      description:
        "Trao đổi đồ không dùng tới, giúp tiết kiệm chi phí và góp phần bảo vệ môi trường.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-emerald-600" />,
      title: "Giao dịch an toàn",
      description:
        "Xác thực người dùng sinh viên, hạn chế rủi ro và xây dựng môi trường mua bán đáng tin cậy.",
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-emerald-600" />,
      title: "Quản lý tin đăng",
      description:
        "Theo dõi, chỉnh sửa và quản lý các sản phẩm đã đăng một cách trực quan và dễ dàng.",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-900">
            Chợ sinh viên – Trao đổi đồ thông minh
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nền tảng giúp sinh viên mua bán, trao đổi đồ cũ một cách nhanh
            chóng, tiết kiệm và thân thiện với môi trường.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="
                group rounded-xl border border-gray-100 p-6
                hover:border-l-4 hover:border-l-emerald-600
                hover:shadow-md transition-all duration-300
              "
            >
              <div className="mb-4">{feature.icon}</div>

              <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-emerald-700 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Banner */}
        <div className="mt-20 relative rounded-xl overflow-hidden">
          <div className="aspect-video bg-emerald-50 rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-black" />
            <Image
              src="/features.png"
              alt="Student marketplace"
              fill
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-10">
              <div className="max-w-2xl">
                <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-white">
                  Một nền tảng – Mọi nhu cầu trao đổi
                </h3>

                <p className="text-lg text-white mb-6">
                  Chợ sinh viên giúp bạn tìm kiếm đồ cần thiết, đăng bán đồ
                  không còn dùng tới và kết nối với những người bạn cùng môi
                  trường học tập – tất cả chỉ trong một nền tảng duy nhất.
                </p>

                <Button variant="outline">
                  <div className="inline-flex items-center text-emerald-700 font-medium cursor-pointer hover:underline">
                    <span>Khám phá chợ sinh viên</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
