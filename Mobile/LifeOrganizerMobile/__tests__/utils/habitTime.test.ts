import { formatTimeDisplay, formatTimeSpan, parseTimeSpan } from "@/utils/habitTime";

describe("parseTimeSpan", () => {
    it("returns null when value is undefined", () => {
        expect(parseTimeSpan(undefined)).toBeNull();
    });

    it("returns null when value is an empty string", () => {
        expect(parseTimeSpan("")).toBeNull();
    });

    it("parses a valid HH:mm:ss string into a Date with matching hours and minutes", () => {
        const result = parseTimeSpan("20:30:00");

        expect(result).not.toBeNull();
        expect(result!.getHours()).toBe(20);
        expect(result!.getMinutes()).toBe(30);
        expect(result!.getSeconds()).toBe(0);
    });

    it("parses midnight correctly", () => {
        const result = parseTimeSpan("00:00:00");

        expect(result!.getHours()).toBe(0);
        expect(result!.getMinutes()).toBe(0);
    });
});

describe("formatTimeSpan", () => {
    it("formats a Date into HH:mm:00 with zero-padding", () => {
        const date = new Date();
        date.setHours(9, 5, 0, 0);

        expect(formatTimeSpan(date)).toBe("09:05:00");
    });

    it("formats a Date with double-digit hours and minutes correctly", () => {
        const date = new Date();
        date.setHours(23, 59, 0, 0);

        expect(formatTimeSpan(date)).toBe("23:59:00");
    });
});

describe("parseTimeSpan + formatTimeSpan round-trip", () => {
    it("produces the same string after parsing and re-formatting", () => {
        const original = "14:45:00";
        const parsed = parseTimeSpan(original);
        const formatted = formatTimeSpan(parsed!);

        expect(formatted).toBe(original);
    });
});

describe("formatTimeDisplay", () => {
    it("returns a non-empty, human-readable time string", () => {
        const date = new Date();
        date.setHours(20, 30, 0, 0);

        const result = formatTimeDisplay(date);

        expect(result).toContain("20");
        expect(result).toContain("30");
    });
});