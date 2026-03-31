import * as React from "react"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { 
  format, 
  subDays, 
  startOfDay, 
  endOfDay, 
  subWeeks, 
  subMonths, 
  subQuarters 
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimeRangePickerProps {
  from?: string; // Format: YYYY-MM-DDTHH:mm
  to?: string;   // Format: YYYY-MM-DDTHH:mm
  onChange: (range: { from?: string; to?: string }) => void;
  placeholder?: string;
  className?: string;
}

const PRESETS = [
  {
    label: "Hoje",
    getRange: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) })
  },
  {
    label: "Ontem",
    getRange: () => ({ from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)) })
  },
  {
    label: "Última semana",
    getRange: () => ({ from: startOfDay(subWeeks(new Date(), 1)), to: endOfDay(new Date()) })
  },
  {
    label: "Último mês",
    getRange: () => ({ from: startOfDay(subMonths(new Date(), 1)), to: endOfDay(new Date()) })
  },
  {
    label: "Último trimestre",
    getRange: () => ({ from: startOfDay(subQuarters(new Date(), 1)), to: endOfDay(new Date()) })
  }
];

export function DateTimeRangePicker({
  from,
  to,
  onChange,
  placeholder = "Selecione a data",
  className
}: DateTimeRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const initialRange: DateRange | undefined = React.useMemo(() => {
    if (from && to) return { from: new Date(from), to: new Date(to) };
    if (from) return { from: new Date(from) };
    if (to) return { from: undefined, to: new Date(to) };
    return undefined;
  }, [from, to]);

  const [date, setDate] = React.useState<DateRange | undefined>(initialRange);

  React.useEffect(() => {
    if (isOpen) {
      setDate(initialRange);
    }
  }, [isOpen, initialRange]);

  const [startTime, setStartTime] = React.useState(from ? format(new Date(from), "HH:mm") : "00:00");
  const [endTime, setEndTime] = React.useState(to ? format(new Date(to), "HH:mm") : "23:59");

  const handleApply = () => {
    const formatDateTime = (d: Date, t: string) => {
      const [hours, minutes] = t.split(":");
      const newD = new Date(d);
      newD.setHours(parseInt(hours, 10));
      newD.setMinutes(parseInt(minutes, 10));
      return format(newD, "yyyy-MM-dd'T'HH:mm");
    };

    const fromDate = date?.from ? formatDateTime(date.from, startTime) : undefined;
    const toDate = date?.to ? formatDateTime(date.to, endTime) : undefined;

    onChange({ from: fromDate, to: toDate });
    setIsOpen(false);
  };

  const handleReset = () => {
    setDate(undefined);
    setStartTime("00:00");
    setEndTime("23:59");
    onChange({ from: undefined, to: undefined });
    setIsOpen(false);
  };

  const setPreset = (presetRange: { from: Date; to: Date }) => {
    setDate(presetRange);
    setStartTime(format(presetRange.from, "HH:mm"));
    setEndTime(format(presetRange.to, "HH:mm"));
  };

  const formatDisplay = () => {
    if (from && to) {
      return `${format(new Date(from), "dd MMM yy", { locale: ptBR })} - ${format(new Date(to), "dd MMM yy", { locale: ptBR })}`;
    }
    if (from) return format(new Date(from), "dd MMM yy", { locale: ptBR });
    return placeholder;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            !from && !to && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="truncate max-w-[140px] text-left">{formatDisplay()}</span>
          </div>
          {(from || to) && (
            <div 
              className="ml-2 hover:bg-accent rounded-full p-1 -mr-2 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleReset();
              }}
            >
              <X className="h-3 w-3" />
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col md:flex-row">
          {/* Presets Sidebar */}
          <div className="flex flex-col gap-1 border-r border-border p-3 w-full md:w-40 bg-accent/20">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setPreset(preset.getRange())}
                className="text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors text-foreground font-medium"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendar & Time */}
          <div className="flex flex-col">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              locale={ptBR}
            />
            
            <div className="border-t border-border p-3 grid grid-cols-2 gap-4">
              <div className="space-y-1 text-sm">
                <label className="text-muted-foreground text-xs font-semibold">Hora (Início)</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full flex h-8 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-muted-foreground text-xs font-semibold">Hora (Fim)</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full flex h-8 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="flex justify-between border-t border-border p-3 bg-accent/10">
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-primary font-normal">
                Limpar
              </Button>
              <Button size="sm" onClick={handleApply}>
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
