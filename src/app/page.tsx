'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { pageVariants, staggerContainer, staggerItem, fadeIn } from '@/lib/animations';
import { Gift, Lock, Sparkles, ArrowRight, Wallet } from 'lucide-react';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="flex-1 w-full"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={staggerItem}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">Decentralized Gifting Protocol</span>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
            >
              Send Value, <br />
              <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                Not Just Hashes.
              </span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
            >
              Transform sending ETH into an immersive unboxing experience.
              Wrap your gift in a premium digital box and let your recipient
              enjoy the magic of unwrapping.
            </motion.p>

            <motion.div variants={staggerItem} className="flex flex-wrap justify-center gap-4">
              {isConnected ? (
                <Link href="/create">
                  <Button size="lg" className="h-12 px-8 text-lg rounded-full">
                    <Gift className="mr-2 h-5 w-5" />
                    Wrap a Gift
                  </Button>
                </Link>
              ) : (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <Button size="lg" onClick={openConnectModal} className="h-12 px-8 text-lg rounded-full">
                      <Wallet className="mr-2 h-5 w-5" />
                      Connect to Start
                    </Button>
                  )}
                </ConnectButton.Custom>
              )}
              <Link href="/about">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: '0.0', label: 'ETH Gifted', suffix: 'ETH' },
              { value: '0', label: 'Gifts Wrapped', suffix: '' },
              { value: '100%', label: 'On-Chain', suffix: '' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Premium Gifting Experience</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We've reimagined how value is transferred on-chain, making it personal and memorable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Gift,
                title: 'Wrap with Style',
                description: 'Choose from Silver, Gold, or Obsidian boxes. Each one crafted for maximum impact.',
              },
              {
                icon: Lock,
                title: 'Secure Escrow',
                description: 'ETH is locked in the smart contract until your recipient unwraps their gift.',
              },
              {
                icon: Sparkles,
                title: 'Immersive Reveal',
                description: '3D unboxing experience with particles, animations, and that satisfying moment of discovery.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-border/40">
        <div className="container px-4 mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about the new standard of gifting.
            </p>
          </div>

          <div className="space-y-4">
            <Accordion>
              <AccordionItem value="item-1" trigger="How does EtherGift work?">
                EtherGift allows you to wrap ETH in a digital gift box using a smart contract. You send a link to your recipient, and they can unwrap it to claim the funds directly to their wallet. It's safe, on-chain, and memorable.
              </AccordionItem>
              <AccordionItem value="item-2" trigger="Is it safe?">
                Yes. The ETH is held in a secure, verified smart contract until the recipient claims it. Only the recipient with the correct link/token ID can unwrap the gift.
              </AccordionItem>
              <AccordionItem value="item-3" trigger="Do I need a wallet to receive a gift?">
                Yes, you need an Ethereum wallet (like MetaMask or Coinbase Wallet) to claim your gift. If you don't have one, we'll guide you through setting one up.
              </AccordionItem>
              <AccordionItem value="item-4" trigger="Are there any fees?">
                EtherGift is free to use! You only pay the standard Ethereum network gas fees for the transaction. We don't take a cut of your gift.
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <Card className="bg-primary text-primary-foreground overflow-hidden border-none text-center py-16">
            <div className="bg-gradient-to-br from-white/10 to-transparent absolute inset-0" />
            <div className="relative z-10 max-w-3xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Send Something Special?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Create your first gift in under a minute. No hidden fees, just pure on-chain magic.
              </p>
              {isConnected ? (
                <Link href="/create">
                  <Button size="lg" variant="secondary" className="h-12 px-8 rounded-full text-lg">
                    Create Your First Gift
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <Button size="lg" variant="secondary" onClick={openConnectModal} className="h-12 px-8 rounded-full text-lg">
                      Connect Wallet
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  )}
                </ConnectButton.Custom>
              )}
            </div>
          </Card>
        </div>
      </section>
    </motion.div>
  );
}

