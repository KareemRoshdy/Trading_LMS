"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { BadgeX, Verified } from "lucide-react";
import { helix } from "ldrs";
helix.register();

const SuccessPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const searchParams = useSearchParams();

  const cleanURL = () => {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, "", cleanUrl);
  };

  const success = searchParams.get("success");
  const transaction_id = searchParams.get("id");
  const hmac = searchParams.get("hmac");

  const courseId = window.localStorage.getItem("courseId");
  const chapterId = window.localStorage.getItem("chapterId");

  const successHandler = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/courses/${courseId}/checkout`, {
        transaction_id,
      });

      toast.success("Course is Open");
    } catch (error: any) {
      console.log(error.message);
      setIsSuccess(false);
      // toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      setIsSuccess(true);
      successHandler();
      router.push(`/courses/${courseId}/chapters/${chapterId}`);
      cleanURL();
    } else {
      setIsSuccess(false);
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <div>
        {isLoading ? (
          <l-helix size="45" speed="2.5" color="#0369a1"></l-helix>
        ) : (
          <>
            {isSuccess && (
              <>
                <Verified className="flex items-center justify-center my-3 mx-auto text-green-700 w-40 h-40" />

                <h2 className="mb-5 text-center">Payment Success</h2>
              </>
            )}

            {!isSuccess && (
              <>
                <BadgeX className="flex items-center justify-center my-3 mx-auto text-green-700 w-40 h-40" />

                <h2 className="mb-5 text-center">Payment Failed</h2>
              </>
            )}

            <Button size="sm" className="text-center">
              <Link
                className="m-auto"
                href={`/courses/${courseId}/chapters/${chapterId}`}
              >
                Back to the Course
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
