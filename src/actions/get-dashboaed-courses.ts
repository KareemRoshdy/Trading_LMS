import { Category, Chapter, Course } from "@prisma/client";

import prisma from "@/lib/db";
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await prisma.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses: CourseWithProgressWithCategory[] = await Promise.all(
      purchasedCourses.map(async (purchase) => {
        const course = purchase.course as Course;
        const progress = await getProgress(userId, course.id);
        return {
          ...course,
          category: purchase.course.category as Category,
          chapters: purchase.course.chapters as Chapter[],
          progress: progress,
        };
      })
    );

    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );

    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
