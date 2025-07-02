import { primaryColor } from "@/lib/helpers/utils";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface Props {
  eventName: string;
  recipientEmail: string;
  inviteUrl: string;
}
export default function LeftEventEmail({
  eventName,
  // recipientEmail,
  inviteUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>An attendee has left {eventName}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-lg border border-[#eaeaea] border-solid p-[30px]">
            <Section className="mt-[32px]">
              <Img
                src="https://rsvpy.s3.eu-north-1.amazonaws.com/icon.png"
                width="75"
                alt="rsvpy logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[20px] text-black">
              There is new space available for <strong>{eventName}</strong>
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello,
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              An attendee has left <strong>{eventName}</strong> and there is now
              space left for you to join.
            </Text>

            <Text className="text-[14px] text-black leading-[24px]">
              Login to or create your account on{" "}
              <Link href={process.env.NEXT_PUBLIC_APP_URL}>rsvpy</Link>, and
              then use the link below to formally join the event.
            </Text>

            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className={`rounded bg-[${primaryColor}] px-5 py-3 text-center font-semibold text-[12px] text-black no-underline`}
                href={inviteUrl}
              >
                Join
              </Button>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />

            <Text className="text-[12px] text-black leading-[24px]">
              Please note that you are receiving this email because you have
              submitted to be notified. You can remove yourself from the
              notification list by clicking <Link href="#">here</Link>.
              {/* TODO: add the correct api url for leaving mailing list. */}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

LeftEventEmail.PreviewProps = {
  eventName: "Event Name",
  recipientEmail: "hmw.geo@gmail.com",
  inviteUrl: "https://rsvpy.app/join-event",
};
