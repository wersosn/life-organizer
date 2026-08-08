export function parseTimeSpan(value?: string): Date | null {
    if (!value) return null;
    const [hh, mm] = value.split(":").map(Number);
    const date = new Date();
    date.setHours(hh, mm, 0, 0);
    return date;
}

export function formatTimeSpan(date: Date): string {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}:00`;
}

export function formatTimeDisplay(date: Date): string {
    return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
}