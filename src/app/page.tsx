import PageWrapper from "@/components/layout/page-wrapper";
import ChatAnimation from "@/components/pages/home/chat-animation";
import Card from "@/components/reusables/card";
import HyperLink from "@/components/reusables/hyperlink";
import Image from "next/image";

const organiserPoints = [
  "Create new events",
  "Re-run existing events",
  "Invite attendees (share link/by email)",
  "Track who has(n't) paid",
  "Request payment from all unpaid attendees",
];

const attendeePoints = [
  "Join events",
  "Keep updated on event changes",
  "Be reminded of upcoming events",
  "Mark payments by cash/bank transfer",
  "Be notified of newly freed-up spots",
];

export default async function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <PageWrapper>
      <div className="px-6 sm:px-16">
        <div className="w-full text-center flex flex-col justify-center items-center mb-10">
          <h1 className="font-black text-4xl sm:text-6xl mb-3">
            Event management <br />
            made more <span className="text-primary italic">seamless.</span>
          </h1>
          <p className="text-lg sm:text-2xl max-w-3xl">
            Collect attendees, track their payments, and always stay in the
            loop.
          </p>
        </div>
        <div className="text-center mb-10">
          <p className="mb-5 text-md">
            <strong className="underline">Gone are the days</strong> where we
            inefficiently manage and track events through{" "}
            <Image
              src="/images/whatsapp.png"
              alt="WhatsApp icon"
              height="25"
              width="25"
              className="inline-block mx-1"
            />{" "}
            messages.
          </p>
          <div className="w-full flex justify-center py-5">
            <ChatAnimation />
          </div>
        </div>
        <div className="mb-16">
          <h2 className="font-bold text-2xl mb-5 text-center w-full">
            <span className="text-primary">Create an account</span> and become
            an:
          </h2>
          <div className="flex flex-col sm:flex-row gap-5 max-w-3xl mx-auto">
            <Card>
              <h2 className="card-title">Organiser</h2>
              <ul className="list-image-[url(/images/star.svg)] ml-5">
                {organiserPoints.map((point, index) => (
                  <li key={index} className="pl-1">
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="card-title">Attendee</h2>
              <ul className="list-image-[url(/images/star.svg)] ml-5">
                {attendeePoints.map((point, index) => (
                  <li key={index} className="pl-1">
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="font-bold text-2xl mb-5 text-center w-full">FAQs</h2>
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <div className="collapse collapse-arrow bg-base-200 border border-base-100 p-2">
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title font-semibold text-lg">
                Is rsvpy free to use?
              </div>
              <div className="collapse-content text-sm">
                Yes, <strong>rsvpy</strong> is completely free to use. However,
                it is not free to maintain so your{" "}
                <HyperLink href="#">support</HyperLink> would be greatly
                appreciated.
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 border border-base-100 p-2">
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title font-semibold text-lg">
                What is rsvpy's purpose?
              </div>
              <div className="collapse-content text-sm">
                WhatsApp is often used to manage events - keeping track of who
                is attending, who has paid, and who hasn't. Attendees copy and
                paste the previous message to mark their attendance/payment, and
                it quickly becomes an inefficient mess. <strong>rsvpy</strong>{" "}
                is a platform to streamline this entire process.
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 border border-base-100 p-2">
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title font-semibold text-lg">
                Why can't I make payments through rsvpy?
              </div>
              <div className="collapse-content text-sm">
                A decision has been made to rely on attendee-trust, where they
                make the payment through cash or bank transfer, and correctly
                mark their payment status. Processing transactions through rsvpy
                would add additional fees, which is not ideal for both attendees
                and organisers. This is thus avoided, but can be added in the
                future if there is demand for it.
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200 border border-base-100 p-2">
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title font-semibold text-lg">
                Are there plans to add more features?
              </div>
              <div className="collapse-content text-sm">
                Definitely! There is still more room for improvement and to{" "}
                {/* TODO: add form hyperlink */}
                better help you manage your events. We've got a couple ideas
                ourselves on some more features we could add. Do{" "}
                <HyperLink href="#">let us know</HyperLink> if you have any
                suggestions.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-5 text-center">
        <p>&copy; {currentYear} rsvpy | All rights reserved.</p>
        <p>
          Developed by{" "}
          <HyperLink href="www.georgehum.com">George Hum</HyperLink>
        </p>
      </div>
    </PageWrapper>
  );
}
