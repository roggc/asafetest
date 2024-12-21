"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface CryptoSelectProps {
  cryptoList: { id: string; name: string }[];
  selectedCrypto: { id: string; name: string };
  onSelectCrypto: (value: string) => void;
  onLoadMore: (page: number) => void;
}

export function CryptoSelect({
  cryptoList,
  selectedCrypto,
  onSelectCrypto,
  onLoadMore,
}: CryptoSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  //   console.log(cryptoList);

  const filteredCryptos = cryptoList?.filter((crypto) =>
    crypto.name.toLowerCase().includes(search.toLowerCase())
  );
  //   console.log(filteredCryptos);

  const handleScrollToBottom = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom) {
      setPage((prev) => {
        const nextPage = prev + 1;
        onLoadMore(nextPage);
        return nextPage;
      });
    }
  };

  //   React.useEffect(() => {
  //     if (page > 1) {
  //       onLoadMore(page);
  //     }
  //   }, [page]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCrypto ? selectedCrypto.name : "Select a cryptocurrency..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search cryptocurrency..."
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No cryptocurrencies found.</CommandEmpty>
            <CommandGroup
              className="max-h-60 overflow-y-auto"
              onScroll={handleScrollToBottom}
            >
              {filteredCryptos?.length > 0 ? (
                filteredCryptos?.map((crypto) => (
                  <CommandItem
                    key={crypto.id}
                    onSelect={() => {
                      onSelectCrypto(crypto.id);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCrypto.id === crypto.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {crypto.name}
                  </CommandItem>
                ))
              ) : (
                <CommandItem>Loading cryptocurrencies...</CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
