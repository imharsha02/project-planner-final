import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ProjectInvitationEmailProps {
  projectName: string;
  inviterName: string;
  inviteUrl: string;
  recipientEmail: string;
}

export default function ProjectInvitationEmail({
  projectName,
  inviterName,
  inviteUrl,
}: ProjectInvitationEmailProps) {
  const previewText = `You've been invited to join ${projectName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              You&apos;ve been invited!
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello,
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              <strong>{inviterName}</strong> has invited you to join the project{" "}
              <strong>{projectName}</strong> on Project Planner.
            </Text>
            <Section className="my-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={inviteUrl}
              >
                Accept Invitation
              </Button>
            </Section>
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              If you didn&apos;t expect this invitation, you can safely ignore
              this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
