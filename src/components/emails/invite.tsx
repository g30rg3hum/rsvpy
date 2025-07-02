import { primaryColor } from "@/lib/helpers/utils";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface Props {
  organiserName: string;
  eventName: string;
  inviteUrl: string;
}
export default function InviteEmail({
  organiserName,
  eventName,
  inviteUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>
            {organiserName} is inviting you to {eventName}
          </Preview>
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
              <strong>{organiserName}</strong> is inviting you
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello,
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              <strong>{organiserName}</strong> is inviting you to join{" "}
              <strong>{eventName}</strong>.
            </Text>

            <Text className="text-[14px] text-black leading-[24px]">
              Login to or create your account on{" "}
              <Link href={process.env.NEXT_PUBLIC_APP_URL}>rsvpy</Link>, and
              then use the link below to accept the invitation.
            </Text>

            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className={`rounded bg-[${primaryColor}] px-5 py-3 text-center font-semibold text-[12px] text-black no-underline`}
                href={inviteUrl}
              >
                Join
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

InviteEmail.PreviewProps = {
  organiserName: "George Hum",
  eventName: "Test Event",
  inviteUrl: "https://rsvpy.app/invite/12345",
};
