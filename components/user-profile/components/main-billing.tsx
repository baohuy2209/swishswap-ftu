import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Download } from "lucide-react";
import React from "react";

function MainBilling() {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Thanh toán & Phí giao dịch</CardTitle>
        <CardDescription>
          Quản lý thông tin thanh toán và các khoản phí trên sàn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Gói hiện tại</h3>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-lg">
                Gói người dùng tiêu chuẩn
              </div>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                Đang áp dụng
              </Badge>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Phí chỉ được thu khi giao dịch hoàn tất giữa người mua và người
              bán.
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                CXem chi tiết phí
              </Button>
              <Button variant="outline" size="sm">
                Quy định & điều khoản
              </Button>
            </div>
          </div>
        </div>

        {/* <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Phương thức thanh toán</h3>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div className="font-medium">•••• •••• •••• 4242</div>
              <Badge variant="secondary">Default</Badge>
            </div>
            <div className="text-sm text-gray-600 mb-4">Expires 12/2027</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Update Card
              </Button>
              <Button variant="outline" size="sm">
                Add Payment Method
              </Button>
            </div>
          </div>
        </div> */}

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Lịch sử thanh toán</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">15/12/2024</div>
                <div className="text-sm text-gray-600">
                  Phí giao dịch – Đơn trao đổi thành công
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">29.000 VNĐ</span>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">15/11/2024</div>
                <div className="text-sm text-gray-600">
                  Phí giao dịch – Đơn trao đổi thành công
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">29.000 VNĐ</span>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MainBilling;
