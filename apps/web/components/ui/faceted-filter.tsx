"use client"

import { useCallback, useState, type ComponentType } from "react"
import { Check, PlusCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type FacetedOption = {
  label: string
  value: string
  icon?: ComponentType<{ className?: string }>
}

type FacetedFilterProps = {
  title: string
  icon?: ComponentType<{ className?: string }>
  options: FacetedOption[]
  value: string[]
  onChange: (value: string[]) => void
  multiple?: boolean
}

export function FacetedFilter({
  title,
  icon: Icon,
  options,
  value,
  onChange,
  multiple = true,
}: FacetedFilterProps) {
  const [open, setOpen] = useState(false)
  const selectedValues = new Set(value)

  const onItemSelect = useCallback(
    (option: FacetedOption, isSelected: boolean) => {
      if (multiple) {
        const next = new Set(value)
        if (isSelected) {
          next.delete(option.value)
        } else {
          next.add(option.value)
        }
        const filterValues = Array.from(next)
        onChange(filterValues.length ? filterValues : [])
      } else {
        onChange(isSelected ? [] : [option.value])
        setOpen(false)
      }
    },
    [multiple, onChange, value],
  )

  const onReset = useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation()
      onChange([])
    },
    [onChange],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 border-dashed",
              selectedValues.size > 0 && "border-solid",
            )}
          />
        }
      >
        {Icon ? (
          <Icon data-icon="inline-start" />
        ) : (
          <PlusCircle data-icon="inline-start" />
        )}
        {title}
        {selectedValues.size > 0 ? (
          <>
            <Separator
              orientation="vertical"
              className="mx-0.5 hidden h-4 sm:block"
            />
            <Badge
              variant="secondary"
              className="rounded-sm px-1 font-normal lg:hidden"
            >
              {selectedValues.size}
            </Badge>
            <div className="hidden items-center gap-1 lg:flex">
              {selectedValues.size > 2 ? (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedValues.size} selecionados
                </Badge>
              ) : (
                options
                  .filter((option) => selectedValues.has(option.value))
                  .map((option) => (
                    <Badge
                      variant="secondary"
                      key={option.value}
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.label}
                    </Badge>
                  ))
              )}
            </div>
          </>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Nenhum resultado.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                const OptionIcon = option.icon

                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    data-checked={isSelected ? true : undefined}
                    onSelect={() => onItemSelect(option, isSelected)}
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 opacity-50",
                      )}
                    >
                      {isSelected ? <Check className="size-3" /> : null}
                    </span>
                    {OptionIcon ? <OptionIcon /> : null}
                    <span className="flex-1">{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 ? (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    value="__clear__"
                    onSelect={() => onReset()}
                    className="justify-center text-center"
                  >
                    Limpar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
