// "use client";

// import React, { useState } from "react";
// import HomeCard from "./HomeCard";
// import { useRouter } from "next/navigation";
// import MeetingModal from "./MeetingModal";
// import { useUser } from "@clerk/nextjs";
// import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
// import { useToast } from "./hooks/use-toast";
// import { Textarea } from "@/components/ui/textarea"
// import ReactDatePicker from 'react-datepicker'
// import { Input } from "@/components/ui/input"




// const MeetingTypeList = () => {
//   const router = useRouter();
//   const [meetingState, setMeetingState] = useState<
//     "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
//   >();

//   const {user} = useUser();
//   const client = useStreamVideoClient();
//   const [values, setValues] = useState({
//     dateTime: new Date(),
//     description:'',
//     link:''
//   })
  
//   const [callDetails, setcallDetails] = useState<Call>()
//   const { toast } = useToast()

//   const createMeeting = async() => {
//     if(!client || !user) return;
    
//     try {
// 1
//       if(!values.dateTime){
//         toast({title: 'Please select a date and time'})
//         return;
//       }

//       const id = crypto.randomUUID();
//       const call = client.call('default', id)

//       if(!call) throw new Error("Failed to create call")

//       const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();

//       const description = values.description || 'Instant meeting'

//       await call.getOrCreate({
//         data: {
//           starts_at: startsAt,
//           custom: {
//             description
//           }
//         }
//       })

//       setcallDetails(call)
//       console.log('Meeting Created:', { id, startsAt, description })

//       if(!values.description){
//         router.push(`/meeting/${call.id}`)
//       }

//       toast({title: 'Meeting created'})

      
//     } catch (error) {
//       console.log(error)
//       toast({
//         title: "Failed to create meeting",
        
//       })
//     }
//   };

//   const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

//   return (
    
    
//     <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
//       <HomeCard
//         img="/icons/add-meeting.svg"
//         title="New Meeting"
//         description="Start an instant meeting"
//         handleClick={() => setMeetingState("isInstantMeeting")}
//         className="bg-orange-1"
//       />
//       <HomeCard
//         img="/icons/schedule.svg"
//         title="Schedule Meeting"
//         description="Plan your meeting"
//         handleClick={() => setMeetingState("isScheduleMeeting")}
//         className="bg-blue-1"
//       />
//       <HomeCard
//         img="/icons/recordings.svg"
//         title="View Recordings"
//         description="Check your recordings"
//         handleClick={() => router.push("/recordings")}
//         className="bg-purple-1"
//       />
//       <HomeCard
//         img="/icons/join-meeting.svg"
//         title="Join Meeting"
//         description="Via invitation link"
//         handleClick={() => setMeetingState("isJoiningMeeting")}
//         className="bg-yellow-1"
//       />

//       {!callDetails ? (
//         <MeetingModal
//         isOpen={meetingState === "isScheduleMeeting"}
//         onClose={() => setMeetingState(undefined)}
//         title="Create Meeting"       
//         handleClick={createMeeting}
//         >
//           <div className="flex flex-col gap-2.5">
//             <label className="text-base text-normal leading-[22ox] text-sky-2 ">
//               Add a description
//               <Textarea className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
//               onChange={(e)=>{
//                 setValues({...values, description: e.target.value})
//               }}
//               />
//             </label>
//           </div>
//           <div className="flex w-full felx-col gap-2.5">
//           <label className="text-base text-normal leading-[22ox] text-sky-2 ">
//               Select Date and Time             
//             </label>
//             <ReactDatePicker
//               selected={values.dateTime}
//               onChange={(date)=> setValues({...values,
//                 dateTime: date!
//               })}
//               showTimeSelect
//               timeFormat="HH:mm"
//               timeIntervals={15}
//               timeCaption="time"
//               dateFormat="MMMM d, yyyy h:mm aa"
//               className="w-full rounded bg-dark-2 p-2 focus:outline-none"
//             />
//           </div>

//         </MeetingModal>
//       ) :(
//         <MeetingModal
//         isOpen={meetingState === "isScheduleMeeting"}
//         onClose={() => setMeetingState(undefined)}
//         title="Meeting Created"
//         className="text-center"       
//         handleClick={()=>{
//           navigator.clipboard.writeText(meetingLink);
//           toast({title: 'Link copied'})
//         }}
//         image="/icons/checked.svg"
//         buttonIcon="/icons/copy.svg"
//         buttonText="Copy Meeting Link"
//       />
//       )}

//       <MeetingModal
//         isOpen={meetingState === "isInstantMeeting"}
//         onClose={() => setMeetingState(undefined)}
//         title="Start instant meeting"
//         className="text-center"
//         buttonText="Start Meeting"
//         handleClick={createMeeting}
//       />

//       <MeetingModal
//         isOpen={meetingState === "isJoiningMeeting"}
//         onClose={() => setMeetingState(undefined)}
//         title="Type the link here"
//         className="text-center"
//         buttonText="Join Meeting"
//         handleClick={()=> router.push(values.link)}
//       >
//         <Input
//           placeholder="Meeting link"
//           onChange={(e) => setValues({ ...values, link: e.target.value })}
//           className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
//         />

//       </MeetingModal>

//     </section>
    
//   );
// };


// export default MeetingTypeList;


"use client";

import React, { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "./hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "@/components/ui/input";
import { useGetCalls } from '../../hooks/useGetCalls'; // Hook to fetch upcoming calls

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { upcomingCalls } = useGetCalls(); // Fetch upcoming meetings
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const { toast } = useToast();

  // Conflict detection function
  const hasMeetingConflict = (newMeetingStart: Date) => {
    return upcomingCalls.some(({ state: { startsAt, endsAt } }:any) => {
      const existingStart = new Date(startsAt);
      const existingEnd = endsAt ? new Date(endsAt) : new Date(existingStart.getTime() + 60 * 60 * 1000); // Assume 1-hour meeting if endsAt is missing

      return (
        (newMeetingStart >= existingStart && newMeetingStart < existingEnd) || // Overlaps start
        (newMeetingStart < existingStart && newMeetingStart > existingStart)   // Overlaps end
      );
    });
  };

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" });
        return;
      }

      const newMeetingStart = new Date(values.dateTime);

      // Check for meeting conflict
      if (hasMeetingConflict(newMeetingStart)) {
        toast({ title: "Meeting time conflicts with another meeting. Please choose a different time." });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);
      console.log("Meeting Created:", { id, startsAt, description });

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({ title: "Meeting created" });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-blue-1"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check your recordings"
        handleClick={() => router.push("/recordings")}
        className="bg-purple-1"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Via invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-yellow-1"
      />

      {/* Meeting Modals */}
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22ox] text-sky-2 ">
              Add a description
              <Textarea
                className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e) => {
                  setValues({ ...values, description: e.target.value });
                }}
              />
            </label>
          </div>
          <div className="flex w-full felx-col gap-2.5">
            <label className="text-base text-normal leading-[22ox] text-sky-2 ">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) =>
                setValues({
                  ...values,
                  dateTime: date!,
                })
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-2 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link copied" });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start instant meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;



