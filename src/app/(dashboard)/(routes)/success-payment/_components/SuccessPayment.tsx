"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { BadgeX, Verified } from "lucide-react";
import { Loader } from "rsuite";

const SuccessPayment = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [courseId, setCourseId] = useState("");
  const [chapterId, setChapterId] = useState("");

  const searchParams = useSearchParams();

  const success = searchParams.get("success");
  const transaction_id = searchParams.get("id");
  const hmac = searchParams.get("hmac");

  const successHandler = async () => {
    try {
      setIsLoading(true);
      setIsSuccess(true);

      await axios.post(`/api/courses/${courseId}/checkout`, {
        transaction_id,
      });

      toast.success("Course is Open");
    } catch (err: any) {
      setIsLoading(false);
      console.log("error");
      console.log("error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setCourseId(window.localStorage.getItem("courseId") || "");
      setChapterId(window.localStorage.getItem("chapterId") || "");

      if (success === "true") {
        setIsSuccess(true);
        successHandler();
        router.push(`/courses/${courseId}/chapters/${chapterId}`);
      } else {
        setIsSuccess(false);
        toast.error("Failed Payment");
        setIsLoading(false);
      }
    }
  }, [success, isMounted, courseId, chapterId, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div>
        {isLoading ? (
          <div>
            <Loader
              center
              content="loading..."
              className="text-center m-auto"
            />
          </div>
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

export default SuccessPayment;
