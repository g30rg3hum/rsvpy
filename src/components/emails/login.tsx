import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface Props {
  url: string;
}
export default function LoginEmail({ url }: Props) {
  const primaryColor = "#31e4ff";

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>Login to your account</Preview>
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
              Login to your account on <strong>rsvpy</strong>
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello,
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              You recently registered or requested to login to your account on{" "}
              <strong>rsvpy</strong>. Click on the button below to proceed.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className={`rounded bg-[${primaryColor}] px-5 py-3 text-center font-semibold text-[12px] text-black no-underline`}
                href={url}
              >
                Login
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
