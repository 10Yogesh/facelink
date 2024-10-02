"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { avatarImages } from "../../constants";
import { useToast } from "./hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { sendEmail } from "@/lib/sendGmail";
import { useState } from "react";

interface MeetingCardProps {
  title: string;
  date: string;
  type: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  type,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { user } = useUser();
  const { toast } = useToast();

  const sendMeetingReminder = async (
    meetingDate: string,
    userEmail: string,
    type: string,
    link: string
  ) => {
    const meetingTime = new Date(meetingDate);
    const now = new Date();

    if (type === "upcoming") {
      const fifteenMinutesBefore = new Date(meetingTime.getTime() - 15 * 60000);

      if (now >= fifteenMinutesBefore && now < meetingTime) {
        try {
          const result = await sendEmail(
            userEmail,
            "Meeting Alert",
            `Your meeting starts in 15 minutes, Meeting link: ${link}`
          );

          console.log("Email sent successfully", result);
        } catch (error) {
          console.error("Error sending email:", error);
          toast({
            title: "Failed to send email reminder",
            description: "Please check your network connection and try again.",
            variant: "destructive",
          });
        }
      }
    }
  };

  if (user?.emailAddresses && user.emailAddresses.length > 0) {
    sendMeetingReminder(date, user.emailAddresses[0].emailAddress, type, link);
  }

  // const [reminderSent, setReminder] = useState(true);

  // const sendMeetingReminder = async (
  //   meetingDate: string,
  //   userEmail: string,
  //   type: string
  // ) => {
  //   if (!reminderSent) {
  //     console.log("Reminder already sent.");
  //     return; // Exit if reminder has already been sent
  //   }

  //   const meetingTime = new Date(meetingDate);
  //   const now = new Date();

  //   try {
  //     const result = await sendEmail(
  //       userEmail,
  //       "Meeting Alert",
  //       "Your meeting starts in 15 minutes"
  //     );

  //     // Check result to ensure email was sent successfully
  //     console.log("Email sent successfully", result);

  //     // Set the flag to true after successful email sending
  //     setReminder(false);
  //   } catch (error) {
  //     setReminder(false);
  //     console.error("Error sending email:", error);
  //     toast({
  //       title: "Failed to send email reminder",
  //       description: "Please check your network connection and try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // // Example usage:
  // sendMeetingReminder(date, "gautambinod629@gmail.com", type);

  return (
    <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
        <Image src={icon} alt="upcoming" width={28} height={28} />
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-base font-normal">{date}</p>
          </div>
        </div>
      </article>
      <article className={cn("flex justify-center relative", {})}>
        <div className="relative flex w-full max-sm:hidden">
          {avatarImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="attendees"
              width={40}
              height={40}
              className={cn("rounded-full", { absolute: index > 0 })}
              style={{ top: 0, left: index * 28 }}
            />
          ))}
          <div className="flex-center absolute left-[136px] size-10 rounded-full border-[5px] border-dark-3 bg-dark-4">
            +5
          </div>
        </div>
        {!isPreviousMeeting && (
          <div className="flex gap-2">
            <Button onClick={handleClick} className="rounded bg-blue-1 px-6">
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt="feature" width={20} height={20} />
              )}
              &nbsp; {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copied",
                });
              }}
              className="bg-dark-4 px-6"
            >
              <Image
                src="/icons/copy.svg"
                alt="feature"
                width={20}
                height={20}
              />
              &nbsp; Copy Link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;
