import { TransactionType } from "@/types/transaction";
import { formatAmount, formatDateDisplay, todayIso } from "@/utils/transactionFormat";

describe("formatAmount", () => {
    it("prefixes expenses with a minus sign", () => {
        expect(formatAmount(49.99, TransactionType.Expense)).toBe("-49.99 zł");
    });

    it("prefixes income with a plus sign", () => {
        expect(formatAmount(3000, TransactionType.Income)).toBe("+3000.00 zł");
    });

    it("formats whole numbers with two decimal places", () => {
        expect(formatAmount(100, TransactionType.Expense)).toBe("-100.00 zł");
    });

    it("rounds to two decimal places", () => {
        expect(formatAmount(49.999, TransactionType.Expense)).toBe("-50.00 zł");
    });
});

describe("formatDateDisplay", () => {
    it("formats an ISO date string into day and abbreviated month", () => {
        const result = formatDateDisplay("2026-07-25");  // format = "pl-PL"

        expect(result).toContain("25"); 
    });
});

describe("todayIso", () => {
    it("returns today's date in yyyy-MM-dd format", () => {
        const result = todayIso();

        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("matches the actual current date", () => {
        const expected = new Date().toISOString().split("T")[0];
        expect(todayIso()).toBe(expected);
    });
});