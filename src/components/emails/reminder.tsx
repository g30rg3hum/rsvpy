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

export default function ReminderEmail({ eventName }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{eventName} is tomorrow!</Preview>
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
              <strong>{eventName}</strong> is coming!
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello,
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              This is a reminder that <strong>{eventName}</strong> is happening
              tomorrow. Don't forget to attend!
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ReminderEmail.PreviewProps = {
  eventName: "Event Name",
  recipientEmail: "hmw.geo@gmail.com",
  inviteUrl: "https://rsvpy.app/join-event",
};
