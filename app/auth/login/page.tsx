import LoginForm from "@/components/auth/login-form";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="w-full flex min-h-screen bg-zinc-50  dark:bg-transparent">
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <LoginForm />
      </div>
      <div className="relative h-screen overflow-hidden md:flex w-1/2 bg-gradient justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-5xl font-sans">SwishSwap</h1>
          <p className="text-white mt-1 text-lg">
            Chợ trao đổi hàng hóa dành cho sinh viên
          </p>
          <Link
            href="/"
            className="block w-28 text-green-800 bg-white text-center mt-4 py-2 rounded-2xl font-bold mb-2"
          >
            Khám phá
          </Link>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 text-white"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 text-white"></div>
        <div className="absolute -top-40 right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 text-white"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 text-white"></div>
      </div>
    </div>
  );
};

export default LoginPage;
