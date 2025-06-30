"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, Plus, X } from "lucide-react";

interface PropertyFieldProps {
  label: string;
  value: any;
  type: "text" | "textarea" | "boolean" | "array" | "url" | "color" | "select";
  onChange: (value: any) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export const PropertyField: React.FC<PropertyFieldProps> = ({
  label,
  value,
  type,
  onChange,
  placeholder,
  options,
}) => {
  switch (type) {
    case "select":
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue
                placeholder={placeholder || `Select ${label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case "textarea":
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] resize-none"
          />
        </div>
      );
    case "boolean":
      return (
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <Switch checked={value || false} onCheckedChange={onChange} />
        </div>
      );
    case "array":
      const arrayValue = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <div className="space-y-2">
            {arrayValue.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    onChange(newArray);
                  }}
                  placeholder={`${label} ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    onChange(newArray);
                  }}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange([...arrayValue, ""])}
              className="w-full"
            >
              <Plus size={14} className="mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      );
    case "url":
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <div className="relative">
            <Link
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "https://example.com"}
              className="pl-10"
            />
          </div>
        </div>
      );
    case "color":
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <Input
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>
      );
    default:
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        </div>
      );
  }
};
