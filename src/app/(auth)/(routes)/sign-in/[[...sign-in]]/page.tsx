import { SignIn } from "@clerk/nextjs";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign-in",
  description:
    "Log in to access your account and enjoy personalized features. Enter your email and password to securely access your dashboard, view your activities, and manage your settings. If you don't have an account, you can easily create one by signing up. قم بتسجيل الدخول للوصول إلى حسابك والاستفادة من الميزات الشخصية. أدخل بريدك الإلكتروني وكلمة المرور للوصول بأمان إلى لوحة التحكم الخاصة بك، عرض نشاطاتك، وإدارة إعداداتك. إذا لم يكن لديك حساب، يمكنك بسهولة إنشاء واحد من خلال التسجيل",
};

export default function Page() {
  return <SignIn />;
}
