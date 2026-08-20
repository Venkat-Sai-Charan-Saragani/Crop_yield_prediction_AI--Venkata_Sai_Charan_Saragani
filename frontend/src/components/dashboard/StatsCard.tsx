import type {
    LucideIcon,
} from "lucide-react";


interface StatsCardProps {

    title: string;

    value: number | string;

    description?: string;

    icon: LucideIcon;

    loading?: boolean;

}


export default function StatsCard({

    title,

    value,

    description,

    icon: Icon,

    loading = false,

}: StatsCardProps) {

    return (

        <div
            className="
                group
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
            "
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            font-medium
                            text-slate-500
                        "
                    >

                        {title}

                    </p>


                    {loading ? (

                        <div
                            className="
                                mt-3
                                h-9
                                w-24
                                animate-pulse
                                rounded-lg
                                bg-slate-100
                            "
                        />

                    ) : (

                        <p
                            className="
                                mt-2
                                text-3xl
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                        >

                            {value}

                        </p>

                    )}

                </div>


                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-emerald-50
                        text-emerald-600
                        transition
                        group-hover:bg-emerald-600
                        group-hover:text-white
                    "
                >

                    <Icon
                        size={21}
                    />

                </div>

            </div>


            {description && (

                <div
                    className="
                        mt-4
                        border-t
                        border-slate-100
                        pt-3
                    "
                >

                    <p
                        className="
                            text-xs
                            text-slate-500
                        "
                    >

                        {description}

                    </p>

                </div>

            )}

        </div>

    );

}