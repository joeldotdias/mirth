import NavLinks from "./navlinks";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";
import { getUser } from "@/server/queries";

export default async function SideNav() {
    const user = await getUser();

    return (
        <nav className="b-4 flex h-screen flex-col justify-between border-r border-gray-600 px-2 pb-4 lg:pr-5">
            <div>
                <div className="pb-6 pt-5 text-center">
                    <Link href={"/"}>
                        <div className="hidden lg:block">Mirth</div>
                        <div className="block text-xl font-bold lg:hidden">
                            M
                        </div>
                    </Link>
                </div>
                <NavLinks pfpUrl={user?.pfpUrl} />
            </div>

            <ThemeSwitcher />
        </nav>
    );
}
