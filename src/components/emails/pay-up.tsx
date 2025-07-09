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
  organiserName: string;
  eventName: string;
  recipientName: string;
}
export default function PayUpEmail({
  organiserName,
  eventName,
  recipientName,
}: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>
            {organiserName} has requested payment for {eventName}
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
              <strong>{organiserName}</strong> is requesting payment
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello {recipientName},
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              <strong>{organiserName}</strong> is requesting that you pay for
              your attendance at the event, <strong>{eventName}</strong>.
            </Text>

            <Text className="text-[14px] text-black leading-[24px]">
              Please make the payment accordingly and login to your account on{" "}
              <Link href={process.env.NEXT_PUBLIC_APP_URL}>rsvpy</Link> to then
              mark that you&#39;ve paid.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

PayUpEmail.PreviewProps = {
  organiserName: "George Hum",
  eventName: "Test Event",
  recipientName: "John Doe",
};
