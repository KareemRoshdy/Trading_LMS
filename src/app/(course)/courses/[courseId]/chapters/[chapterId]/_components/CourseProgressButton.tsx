"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCheck, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "rsuite";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
}

const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isCompleted ? XCircle : CheckCheck;

  return (
    <Button
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          {isCompleted ? "Not completed" : "Mark as complete"}
          <Icon className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  );
};

export default CourseProgressButton;
