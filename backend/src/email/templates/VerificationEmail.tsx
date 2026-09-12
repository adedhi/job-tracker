import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text
} from '@react-email/components';

export default function VerificationEmail({
    verifyUrl,
}: {
    verifyUrl: string;
}) {
    return (
        <Html>
            <Head />
            <Preview>Verify your email for Job Tracker</Preview>
            <Body style={{ padding: "40px 0", backgroundColor: "#f5f5f5", fontFamily: "sans-serif"}}>
                <Container style={{ maxWidth: "480px", borderRadius: "8px", padding: "32px", backgroundColor: "#ffffff" }}>
                    <Heading style={{ fontSize: "20px" }}>
                        Verify your email
                    </Heading>
                    <Text style={{ color: "#444", fontSize: "14px", lineHeight: "22px" }}>
                        Click the button below to verfy your email address. This link expires in 24 hours.
                    </Text>
                    <Section style={{ margin: "24px 0", textAlign: "center" }}>
                        <Link
                            href={verifyUrl}
                            style={{
                                color: "#ffffff",
                                backgroundColor: "#3D4B94",
                                borderRadius: "6px",
                                padding: "12px 24px",
                                textDecoration: "none",
                                fontSize: "14px"
                            }}
                        >
                            Verify Email
                        </Link>
                    </Section>
                    <Text style={{ color: "#999", fontSize: "12px" }}>
                        If you didn't create a Job Tracker account, you can ignore this email.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}
