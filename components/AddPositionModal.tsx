"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";

interface AddPositionModalProps {
  onAddPosition: (position: {
    symbol: string;
    volume: string;
    openPrice: string;
  }) => void;
}

export function AddPositionModal({ onAddPosition }: AddPositionModalProps) {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [volume, setVolume] = useState("");
  const [openPrice, setOpenPrice] = useState("");
  const [errors, setErrors] = useState<{
    symbol?: string;
    volume?: string;
    openPrice?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!symbol.trim()) {
      newErrors.symbol = "Symbol is required";
    }

    if (!volume.trim()) {
      newErrors.volume = "Volume is required";
    } else if (isNaN(Number(volume)) || Number(volume) <= 0) {
      newErrors.volume = "Volume must be a positive number";
    }

    if (!openPrice.trim()) {
      newErrors.openPrice = "Open price is required";
    } else if (isNaN(Number(openPrice)) || Number(openPrice) <= 0) {
      newErrors.openPrice = "Open price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onAddPosition({
        symbol: symbol.trim().toUpperCase(),
        volume: volume.trim(),
        openPrice: openPrice.trim(),
      });

      // Reset form
      setSymbol("");
      setVolume("");
      setOpenPrice("");
      setErrors({});
      setOpen(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setSymbol("");
      setVolume("");
      setOpenPrice("");
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Add Position
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Position</DialogTitle>
          <DialogDescription>
            Add a new position to your portfolio manually. Enter the symbol,
            volume, and open price.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Field data-invalid={!!errors.symbol}>
              <FieldLabel htmlFor="symbol">Symbol</FieldLabel>
              <Input
                id="symbol"
                placeholder="e.g., AAPL"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                aria-invalid={!!errors.symbol}
              />
              <FieldDescription>
                Enter the stock ticker symbol
              </FieldDescription>
              {errors.symbol && (
                <FieldError errors={[{ message: errors.symbol }]} />
              )}
            </Field>

            <Field data-invalid={!!errors.volume}>
              <FieldLabel htmlFor="volume">Volume</FieldLabel>
              <Input
                id="volume"
                type="number"
                step="any"
                placeholder="e.g., 100"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                aria-invalid={!!errors.volume}
              />
              <FieldDescription>
                Number of shares you own
              </FieldDescription>
              {errors.volume && (
                <FieldError errors={[{ message: errors.volume }]} />
              )}
            </Field>

            <Field data-invalid={!!errors.openPrice}>
              <FieldLabel htmlFor="openPrice">Open Price</FieldLabel>
              <Input
                id="openPrice"
                type="number"
                step="any"
                placeholder="e.g., 150.50"
                value={openPrice}
                onChange={(e) => setOpenPrice(e.target.value)}
                aria-invalid={!!errors.openPrice}
              />
              <FieldDescription>
                Price per share when you bought it
              </FieldDescription>
              {errors.openPrice && (
                <FieldError errors={[{ message: errors.openPrice }]} />
              )}
            </Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Position</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
