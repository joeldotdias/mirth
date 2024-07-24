import Link from "next/link";

export default function Header() {
    return (
        <div className="pb-6 pt-5 text-center">
            <Link href={"/"}>
                <div className="hidden lg:block">Mirth</div>
                <div className="block text-xl font-bold lg:hidden">M</div>
            </Link>
        </div>
    );
}
