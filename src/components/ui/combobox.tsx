import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { XIcon } from "lucide-react"
import React from "react";
import { ElementType } from "react";

interface ComboBoxItem {
  value: string;
  label: string;
}

interface ComboBoxProps {
  Icon?: ElementType;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  items: ComboBoxItem[];
  selectedItem?: ComboBoxItem | null;
  onItemSelect: (item: ComboBoxItem | null) => void;
}

export function ComboBox({
  Icon,
  placeholder = "Select an item",
  searchPlaceholder = "Search items...",
  emptyMessage = "No items found.",
  items,
  selectedItem,
  onItemSelect
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between md:w-72"
        >
          <div className="flex items-center gap-2 truncate">
            {Icon && <Icon className="size-4" />}
            <span className="truncate">
              {selectedItem?.label || placeholder}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:w-72">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {selectedItem && (
                <>
                  <CommandItem
                    onSelect={() => {
                      onItemSelect(null);
                      setOpen(false);
                    }}
                    className="text-muted-foreground"
                  >
                    <XIcon className="mr-2 size-4" />
                    Clear preset
                  </CommandItem>
                  <div className="h-px bg-border my-1" />
                </>
              )}
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => {
                    onItemSelect(item);
                    setOpen(false);
                  }}
                >
                  {Icon && <Icon className="mr-2 size-4" />}
                  <span className="truncate">{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
