import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import { cn } from "@/lib/utils";

interface StaticInterviewCardProps {
  userId?: string;
  role: string;
  type: string;
  techstack: readonly string[];
  companyImage: string;
  templateId: string;
}

const StaticInterviewCard = async ({
  role,
  type,
  techstack,
  companyImage,
  templateId,
}: StaticInterviewCardProps) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg",
              badgeColor
            )}>
            <p className="badge-text">{normalizedType}</p>
          </div>

          {/* Company Cover Image */}
          <Image
            src={companyImage}
            alt="company-logo"
            width={90}
            height={90}
            className="rounded-full object-cover size-[90px] bg-white p-2"
          />

          {/* Interview Role */}
          <h3 className="mt-5 capitalize">{role} Interview</h3>

          {/* Level & New Badge */}
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image src="/star.svg" width={22} height={22} alt="level" />
              <p>Practice Interview</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-green-600 text-sm">Available</p>
            </div>
          </div>

          {/* Description */}
          <p className="line-clamp-2 mt-5">
            Practice your {role.toLowerCase()} skills with our AI interviewer.
            Get real-time feedback and improve your technical knowledge.
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary">
            <Link href={`/interview?template=${templateId}`}>
              Start Interview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StaticInterviewCard;
