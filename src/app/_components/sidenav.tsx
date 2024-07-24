import NavLinks from "./navlinks";
import { ThemeSwitcher } from "./theme-switcher";
import Avatar from "./avatar";
import Link from "next/link";

export default function SideNav() {
    return (
        <nav className="b-4 flex h-screen flex-col justify-between border-r border-gray-600 px-2 pb-4">
            <div>
                <div className="pb-6 pt-5 text-center">
                    <Link href={"/"}>
                        <div className="hidden lg:block">Mirth</div>
                        <div className="block text-xl font-bold lg:hidden">
                            M
                        </div>
                    </Link>
                </div>

                <NavLinks />

                <div className="flex w-full justify-center py-4">
                    <Avatar />
                </div>
            </div>

            <ThemeSwitcher />
        </nav>
    );
}