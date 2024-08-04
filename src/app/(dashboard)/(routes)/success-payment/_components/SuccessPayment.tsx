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
  const amount_cents = searchParams.get("amount_cents");
  const created_at = searchParams.get("created_at");
  const currency = searchParams.get("currency");
  const error_occured = searchParams.get("error_occured");
  const has_parent_transaction = searchParams.get("has_parent_transaction");
  const integration_id = searchParams.get("integration_id");
  const is_3d_secure = searchParams.get("is_3d_secure");
  const is_auth = searchParams.get("is_auth");
  const is_capture = searchParams.get("is_capture");
  const is_refunded = searchParams.get("is_refunded");
  const is_standalone_payment = searchParams.get("is_standalone_payment");
  const is_voided = searchParams.get("is_voided");
  const order = searchParams.get("order");
  const owner = searchParams.get("owner");
  const pending = searchParams.get("pending");
  const source_data_pan = searchParams.get("source_data.pan");
  const source_data_sub_type = searchParams.get("source_data.sub_type");
  const source_data_type = searchParams.get("source_data.type");
  const hmac = searchParams.get("hmac");

  const data = {
    success,
    transaction_id,
    created_at,
    amount_cents,
    currency,
    error_occured,
    has_parent_transaction,
    integration_id,
    is_3d_secure,
    is_auth,
    is_capture,
    is_refunded,
    is_standalone_payment,
    is_voided,
    order,
    owner,
    pending,
    source_data_pan,
    source_data_sub_type,
    source_data_type,
  };

  const successHandler = async () => {
    try {
      setIsLoading(true);
      setIsSuccess(true);

      const res = await axios.post(`/api/verify-hmac`, {
        data,
        hmac,
      });

      const result = res.data.valid;

      if (result) {
        await axios.post(`/api/courses/${courseId}/checkout`, {
          transaction_id,
        });
        toast.success("Course is Open");
        router.push(`/courses/${courseId}/chapters/${chapterId}`);
        router.refresh();
      } else {
        setIsSuccess(false);
        toast.error("Failed Payment");
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
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
