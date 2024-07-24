import ProfileHeader from "./_components/profile-header";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto min-h-screen pt-6">
            <div className="flex flex-col gap-4">
                <ProfileHeader />
                <main className="w-full">{children}</main>
            </div>
        </div>
    );
}
