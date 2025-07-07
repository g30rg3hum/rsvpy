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
  optOutUrl: string;
}
export default function LeftOptInEmail({ eventName, optOutUrl }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>
            Opted in for notification reminders about available space for{" "}
            {eventName}
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
              clicking this <Link href={optOutUrl}>link</Link>.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

LeftOptInEmail.PreviewProps = {
  eventName: "Event Name",
  optOutUrl: "https://example.com/opt-out",
};
