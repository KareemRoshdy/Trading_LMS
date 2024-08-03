"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { BadgeX, Verified } from "lucide-react";
import { Loader } from "rsuite";

const SuccessPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const searchParams = useSearchParams();

  const success = searchParams.get("success");
  const transaction_id = searchParams.get("id");
  const hmac = searchParams.get("hmac");

  const courseId = window.localStorage.getItem("courseId");
  const chapterId = window.localStorage.getItem("chapterId");

  const cleanURL = () => {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, "", cleanUrl);
  };

  const successHandler = async () => {
    try {
      setIsLoading(true);
      setIsSuccess(true);

      await axios.post(`/api/courses/${courseId}/checkout`, {
        transaction_id,
      });

      toast.success("Course is Open");
    } catch (error: any) {
      console.log(error.message);
      setIsSuccess(false);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      // cleanURL();
    }
  };

  useEffect(() => {
    if (success) {
      successHandler();

      router.push(`/courses/${courseId}/chapters/${chapterId}`);
      router.refresh();
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <div>
        {isLoading ? (
          <Loader inverse center content="loading..." />
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
                <BadgeX className="flex items-center justify-center my-3 mx-auto text-red-700 w-40 h-40" />

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
