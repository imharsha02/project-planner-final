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
  projectName?: string;
  inviterName?: string;
  inviteUrl?: string;
  recipientEmail?: string;
}

export const ProjectInvitationEmail = ({
  projectName = "Project",
  inviterName = "Team member",
  inviteUrl = "#",
  recipientEmail = "user@example.com",
}: ProjectInvitationEmailProps) => {
  const previewText = `${inviterName} has invited you to join ${projectName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white border border-gray-200 rounded-lg my-10 mx-auto p-8 max-w-[465px]">
            <Heading className="text-2xl font-normal text-center p-0 my-8 mx-0 text-gray-900">
              You&apos;ve been invited to join <strong>{projectName}</strong>
            </Heading>

            <Text className="text-sm text-gray-600">Hello,</Text>

            <Text className="text-sm text-gray-600 leading-relaxed">
              <strong>{inviterName}</strong> has invited you to collaborate on
              the project <strong>{projectName}</strong>.
            </Text>

            <Text className="text-sm text-gray-600 leading-relaxed">
              Click the button below to accept the invitation and join the team.
              You&apos;ll be able to access the project and start collaborating
              right away.
            </Text>

            <Section className="text-center mt-8 mb-8">
              <Button
                className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md no-underline text-center inline-block"
                href={inviteUrl}
              >
                Accept Invitation
              </Button>
            </Section>

            <Text className="text-xs text-gray-500 mt-8">
              If you didn&apos;t expect this invitation, you can safely ignore
              this email.
            </Text>

            <Text className="text-xs text-gray-500 mt-4">
              This invitation link will expire in 7 days.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ProjectInvitationEmail;
