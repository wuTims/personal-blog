import { Container, Text, SocialLinks } from '~/components/ui'

const socialLinks = [
    { platform: 'github' as const, href: 'https://github.com/wuTims' },
    { platform: 'linkedin' as const, href: 'https://www.linkedin.com/in/timlwu' },
]

export function Footer() {
    return (
        <footer className="border-t border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-950">
            <Container>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Social / Legal */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                            Connect
                        </h3>
                        <div className="mt-4">
                            <SocialLinks links={socialLinks} layout="vertical" />
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800">
                    <Text variant="muted" size="sm" className="text-center">
                        &copy; {new Date().getFullYear()} wutims
                    </Text>
                </div>
            </Container>
        </footer>
    )
}
