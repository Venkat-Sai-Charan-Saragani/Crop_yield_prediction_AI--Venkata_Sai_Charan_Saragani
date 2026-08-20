export default function AdminLoading({
    rows = 6,
}: {
    rows?: number;
}) {

    return (

        <div className="space-y-3">

            {Array.from({
                length: rows,
            }).map(
                (_, index) => (

                    <div
                        key={index}
                        className="h-16 animate-pulse rounded-xl bg-slate-100"
                    />

                )
            )}

        </div>
    );
}