import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/CourseProgressButton";
import { firstStep } from "@/utils/paymobToken";

import Heading from "@/utils/Heading";

interface ChapterIdPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  const token = await firstStep(course.price || 0);

  return (
    <div>
      <Heading
        title={chapter.title}
        description="Watch and enjoy our curated video content designed to enhance your knowledge and skills. Explore videos on various topics, including trading strategies, market analysis, and more. Our videos are tailored to provide you with valuable insights and practical tips to help you achieve your financial goals. Stay tuned for new updates and featured content. شاهد واستمتع بمحتوى الفيديوهات المخصص الذي يهدف إلى تعزيز معرفتك ومهاراتك. استعرض الفيديوهات حول مواضيع متنوعة، بما في ذلك استراتيجيات التداول، تحليل السوق، والمزيد. تم تصميم فيديوهاتنا لتزويدك برؤى قيمة ونصائح عملية تساعدك في تحقيق أهدافك المالية. ترقب التحديثات الجديدة والمحتوى المميز."
      />

      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}

      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>

        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>

            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
                token={token}
                chapterId={params.chapterId!}
              />
            )}
          </div>

          <Separator />

          <div>
            <Preview value={chapter.description!} />
          </div>

          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
