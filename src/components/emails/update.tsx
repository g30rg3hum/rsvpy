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

export default function UpdateEmail({ eventName }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>There are updates to {eventName}</Preview>
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
              Details for <strong>{eventName}</strong> have been updated
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello,
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              The event organiser has made updates to{" "}
              <strong>{eventName}</strong>.
            </Text>
            <Text>
              Please log into{" "}
              <Link href={process.env.NEXT_PUBLIC_APP_URL}>rsvpy</Link> to view
              the changes.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

UpdateEmail.PreviewProps = {
  eventName: "Event Name",
};
