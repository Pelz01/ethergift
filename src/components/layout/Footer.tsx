export function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="container flex flex-col md:flex-row items-center justify-between py-8 mx-auto px-4 gap-4">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} EtherGift. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        Terms
                    </a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        Privacy
                    </a>
                    <a href="https://github.com/faley/ethergift" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    )
}
