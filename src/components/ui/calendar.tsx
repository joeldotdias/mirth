"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, useDayPicker, useNavigation } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { format, setMonth } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "relative flex items-center justify-center pt-1",
                caption_label: "hidden text-sm font-medium",
                nav: "flex items-center space-x-1",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground",
                row: "mt-2 flex w-full",
                cell: "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside:
                    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                caption_dropdowns: "flex gap-2",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => (
                    <ChevronRight className="h-4 w-4" />
                ),
                Dropdown: (props) => {
                    const { fromMonth, fromYear, toMonth, toYear } =
                        useDayPicker();

                    const { goToMonth, currentMonth } = useNavigation();

                    if (props.name === "months") {
                        const monthsSelection = Array.from(
                            { length: 12 },
                            (_, idx) => ({
                                value: idx.toString(),
                                label: format(setMonth(new Date(), idx), "MMM"),
                            }),
                        );
                        return (
                            <Select
                                onValueChange={(newValue) => {
                                    const newDate = new Date(currentMonth);
                                    newDate.setMonth(parseInt(newValue));
                                    goToMonth(newDate);
                                }}
                                value={props.value?.toString()}
                            >
                                <SelectTrigger>
                                    {format(currentMonth, "MMM")}
                                </SelectTrigger>
                                <SelectContent>
                                    {monthsSelection.map((mnth) => (
                                        <SelectItem
                                            value={mnth.value}
                                            key={mnth.value}
                                        >
                                            {mnth.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    } else if (props.name === "years") {
                        const earliestYear =
                            fromYear ?? fromMonth?.getFullYear();
                        const latestYear = toYear ?? toMonth?.getFullYear();

                        let yearsSelection: { label: string; value: string }[] =
                            [];

                        if (earliestYear && latestYear) {
                            const yearsLength = latestYear - earliestYear + 1;
                            yearsSelection = Array.from(
                                { length: yearsLength },
                                (_, i) => ({
                                    label: (earliestYear + i).toString(),
                                    value: (earliestYear + i).toString(),
                                }),
                            );
                        }

                        return (
                            <Select
                                onValueChange={(newValue) => {
                                    const newDate = new Date(currentMonth);
                                    newDate.setFullYear(parseInt(newValue));
                                    goToMonth(newDate);
                                }}
                                value={props.value?.toString()}
                            >
                                <SelectTrigger>
                                    {currentMonth.getFullYear()}
                                </SelectTrigger>
                                <SelectContent>
                                    {yearsSelection.map((year) => (
                                        <SelectItem
                                            value={year.value}
                                            key={year.value}
                                        >
                                            {year.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    }

                    return null;
                },
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
