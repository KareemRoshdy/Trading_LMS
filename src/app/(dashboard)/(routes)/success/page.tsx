"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Verified } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "rsuite";

const SuccessPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();

  const success = searchParams.get("success");
  const transaction_id = searchParams.get("id");
  const hmac = searchParams.get("hmac");

  let courseId = "";
  let chapterId = "";

  const cleanURL = () => {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, "", cleanUrl);
  };

  const successHandler = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/courses/${courseId}/checkout`, {
        transaction_id,
      });

      toast.success("Course is Open");
      cleanURL();
    } catch (error: any) {
      console.log(error.message);
      // toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    courseId = window.localStorage.getItem("courseId") || "";
    chapterId = window.localStorage.getItem("chapterId") || "";

    if (success) {
      successHandler();
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <div>
        {isLoading ? (
          <h2 className="mb-5 text-center">Loading...</h2>
        ) : (
          <>
            <Verified className="flex items-center justify-center my-3 mx-auto text-green-700 w-40 h-40" />

            <h2 className="mb-5 text-center">Payment Success</h2>

            <Button size="sm" className="text-center">
              {isLoading ? (
                <Loader />
              ) : (
                <Link
                  className="m-auto"
                  href={`/courses/${courseId}/chapters/${chapterId}`}
                >
                  Back to the Course
                </Link>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
