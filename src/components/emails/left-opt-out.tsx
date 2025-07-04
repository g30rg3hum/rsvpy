import {
  Body,
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
  eventName: string;
  recipientEmail: string;
}
export default function LeftOptOutEmail({
  eventName /* recipientEmail */,
}: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>
            Notification reminder for available space for {eventName}
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
              You opted to be notified about available space for{" "}
              <strong>{eventName}</strong>
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello,
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              You recently submitted to be notified when space becomes available
              for {eventName}.
            </Text>

            <Text className="text-[14px] text-black leading-[24px]">
              If this was a mistake, you can ignore this email or opt out by
              clicking this <Link href="#">link</Link>.
              {/* TODO: opt out API link  */}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

LeftOptOutEmail.PreviewProps = {
  eventName: "Event Name",
  recipientEmail: "hmw.geo@gmail.com",
  inviteUrl: "https://rsvpy.app/join-event",
};
