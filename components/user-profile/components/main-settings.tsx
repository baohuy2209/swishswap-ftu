import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Download, Save, Trash2 } from "lucide-react";
function MainSettings() {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Tùy chọn ứng dụng</CardTitle>
        <CardDescription>
          Cá nhân hóa trải nghiệm sử dụng của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Giao diện</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select defaultValue="light">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Sáng</SelectItem>
                  <SelectItem value="dark">Tối</SelectItem>
                  <SelectItem value="system">Mặc định</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">
            Dữ liệu & Quyền riêng tư
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Phân tích & Dữ liệu sử dụng</div>
                <div className="text-sm text-gray-600">
                  Giúp chúng tôi cải thiện hệ thống bằng cách chia sẻ dữ liệu sử
                  dụng ẩn danh.
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Thông tin tiếp thị</div>
                <div className="text-sm text-gray-600">
                  Nhận thông báo cập nhật sản phẩm và email khuyến mãi từ hệ
                  thống.
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Xuất dữ liệu</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Xuất toàn bộ dữ liệu của bạn, bao gồm lịch sử giao dịch, nhật ký
              hoạt động và thông tin tài khoản.
            </p>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Xuất dữ liệu
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-red-600">Khu vực nguy hiểm</h3>
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="space-y-4">
              <div>
                <div className="font-medium text-red-900">Xóa tài khoản</div>
                <div className="text-sm text-red-700">
                  Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu liên quan. Hành
                  động này không thể hoàn tác.
                </div>
              </div>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Xóa tài khoản
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MainSettings;
