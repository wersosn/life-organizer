import { TransactionType } from "@/types/transaction";

export function formatAmount(amount: number, type: TransactionType): string {
    const sign = type === TransactionType.Expense ? "-" : "+";
    return `${sign}${amount.toFixed(2)} zł`;
}

export function formatDateDisplay(dateString: string): string {
    return new Date(dateString).toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "short",
    });
}

export function todayIso(): string {
    return new Date().toISOString().split("T")[0];
}