import Image from "next/image";
import {
  Globe,
  CreditCard,
  Clock,
  TrendingUp,
  Shield,
  Headset,
} from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: <Globe className="h-6 w-6 text-emerald-600" />,
      title: "Kết nối sinh viên toàn trường",
    },
    {
      icon: <CreditCard className="h-6 w-6 text-emerald-600" />,
      title: "Thanh toán linh hoạt, an toàn",
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-600" />,
      title: "Đăng bán & trao đổi chỉ trong vài phút",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      title: "Giúp sinh viên tiết kiệm chi phí",
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      title: "Xác thực sinh viên, hạn chế lừa đảo",
    },
    {
      icon: <Headset className="h-6 w-6 text-emerald-600" />,
      title: "Hỗ trợ nhanh chóng khi cần",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Vì sao sinh viên chọn chợ trao đổi này?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Một nền tảng đơn giản, an toàn và tiết kiệm – được thiết kế riêng
            cho cộng đồng sinh viên.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-center"
            >
              <div className="mr-4 p-2 bg-emerald-100 rounded-lg">
                {benefit.icon}
              </div>
              <h3 className="font-heading font-medium text-lg text-gray-900">
                {benefit.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-16 bg-emerald-50 rounded-xl p-8 relative overflow-hidden">
          {/* Decorative shape */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#10B981"
                d="M47.7,-61.1C59.9,-51.3,67.2,-35.5,71.2,-19.1C75.1,-2.7,75.8,14.3,69.8,28.5C63.8,42.8,51.2,54.4,36.8,61.5C22.4,68.6,6.1,71.2,-8.3,68.7C-22.7,66.1,-35.3,58.3,-46.6,48C-57.9,37.6,-67.9,24.7,-70.8,10.2C-73.7,-4.2,-69.4,-20.3,-61.3,-33.6C-53.1,-46.9,-41.2,-57.4,-28,-63.5C-14.9,-69.5,-0.5,-71,13.8,-69.5C28.1,-68,45.4,-63.5,47.7,-61.1Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <Image
                src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=300&fit=crop"
                alt="Sinh viên sử dụng chợ đồ"
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            <div>
              <blockquote className="text-lg md:text-xl text-gray-800 italic mb-4">
                “Từ khi dùng chợ sinh viên, mình bán lại sách cũ và mua đồ điện
                tử rẻ hơn rất nhiều. Vừa tiết kiệm tiền, vừa giúp đồ không bị
                lãng phí.”
              </blockquote>
              <div className="font-heading font-semibold">Nguyễn Minh Anh</div>
              <div className="text-gray-600">Sinh viên Công nghệ Thông tin</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
