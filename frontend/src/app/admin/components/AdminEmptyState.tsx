import {
    Inbox,
} from "lucide-react";


export default function AdminEmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {

    return (

        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">

                <Inbox size={25} />

            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
                {title}
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
                {description}
            </p>

        </div>
    );
}