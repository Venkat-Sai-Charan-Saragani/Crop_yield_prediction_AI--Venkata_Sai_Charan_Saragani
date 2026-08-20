export function kgToTonsPerHectare(
    value: number | string | null | undefined
): number {
    const kg = Number(value);

    if (!Number.isFinite(kg)) {
        return 0;
    }

    return kg / 1000;
}