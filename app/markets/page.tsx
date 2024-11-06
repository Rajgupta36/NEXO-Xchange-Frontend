"use client";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    router.push('/');
    return <div className="flex flex-row flex-1">
        <div className="flex flex-col justify-center items-center flex-1 pt-[100px]">
            Markets page
            
        </div>
    </div>
}