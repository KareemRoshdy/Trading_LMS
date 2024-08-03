import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description:
    "Log in to access your account and enjoy personalized features. Enter your email and password to securely access your dashboard, view your activities, and manage your settings. If you don't have an account, you can easily create one by signing up. قم بتسجيل الدخول للوصول إلى حسابك والاستفادة من الميزات الشخصية. أدخل بريدك الإلكتروني وكلمة المرور للوصول بأمان إلى لوحة التحكم الخاصة بك، عرض نشاطاتك، وإدارة إعداداتك. إذا لم يكن لديك حساب، يمكنك بسهولة إنشاء واحد من خلال التسجيل",
};

interface LayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-full flex items-center justify-center">{children}</div>
  );
};

export default AuthLayout;
