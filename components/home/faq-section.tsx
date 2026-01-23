"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqSection() {
  const faqs = [
    {
      question: "Chợ sinh viên hoạt động như thế nào?",
      answer:
        "Sinh viên có thể đăng bán, trao đổi hoặc cho tặng các món đồ không còn sử dụng như sách, đồ điện tử, đồ gia dụng, quần áo… Người mua có thể liên hệ trực tiếp với người bán để giao dịch.",
    },
    {
      question: "Tôi có cần trả phí khi sử dụng nền tảng không?",
      answer:
        "Không. Nền tảng hoàn toàn miễn phí cho sinh viên. Bạn có thể đăng bài, tìm kiếm và trao đổi đồ mà không mất bất kỳ khoản phí nào.",
    },
    {
      question: "Làm sao để đảm bảo người bán là sinh viên thật?",
      answer:
        "Người dùng cần đăng ký bằng email sinh viên hoặc xác thực thông tin học tập. Điều này giúp tạo ra một cộng đồng an toàn và hạn chế tối đa các hành vi lừa đảo.",
    },
    {
      question: "Việc thanh toán và giao hàng diễn ra như thế nào?",
      answer:
        "Người mua và người bán tự thỏa thuận hình thức thanh toán và giao nhận (trực tiếp trong khuôn viên trường hoặc chuyển khoản). Nền tảng đóng vai trò kết nối, không can thiệp vào giao dịch.",
    },
    {
      question: "Tôi có thể đăng bán những loại đồ nào?",
      answer:
        "Bạn có thể đăng bán hoặc trao đổi sách giáo trình, đồ điện tử, đồ dùng học tập, đồ gia dụng, quần áo, phụ kiện và nhiều vật dụng khác miễn là phù hợp với quy định cộng đồng.",
    },
    {
      question: "Nếu gặp người dùng vi phạm thì phải làm sao?",
      answer:
        "Bạn có thể báo cáo bài đăng hoặc người dùng vi phạm trực tiếp trên nền tảng. Đội ngũ quản trị sẽ kiểm tra và xử lý nhanh chóng để đảm bảo môi trường trao đổi lành mạnh.",
    },
    {
      question: "Thông tin cá nhân của tôi có được bảo mật không?",
      answer:
        "Có. Chúng tôi cam kết bảo vệ dữ liệu cá nhân của sinh viên, không chia sẻ thông tin cho bên thứ ba và áp dụng các biện pháp bảo mật cần thiết.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Câu hỏi thường gặp
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Giải đáp những thắc mắc phổ biến khi sinh viên tham gia chợ trao đổi
            đồ.
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 font-heading font-medium text-gray-900 hover:text-emerald-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Bạn vẫn còn câu hỏi?
            <a
              href="/contact"
              className="text-emerald-600 hover:text-emerald-700 ml-1 font-medium"
            >
              Liên hệ với chúng tôi
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
