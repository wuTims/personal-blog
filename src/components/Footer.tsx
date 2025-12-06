import { Container, Text, SocialLinks, NewsletterSubscribe } from '~/components/ui'
import { Rss } from 'lucide-react'

const socialLinks = [
    { platform: 'github' as const, href: 'https://github.com/wuTims' },
    { platform: 'linkedin' as const, href: 'https://www.linkedin.com/in/timlwu' },
]

export function Footer() {
    return (
        <footer className="border-t border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-950">
            <Container>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Social */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                            Connect
                        </h3>
                        <div className="mt-4">
                            <SocialLinks links={socialLinks} layout="vertical" />
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                            Newsletter & Updates
                        </h3>
                        <div className="mt-4">
                            <NewsletterSubscribe
                                variant="inline"
                                subheading=""
                            />
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <a
                                href="https://newsletter.wutims.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted hover:text-foreground transition-colors"
                            >
                                Newsletter Archive
                            </a>
                            <a
                                href="/feed.xml"
                                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
                            >
                                <Rss className="h-3.5 w-3.5" />
                                RSS Feed
                            </a>
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
