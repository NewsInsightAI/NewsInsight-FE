import React, { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Icon } from "@iconify/react";
import { SingleValue } from "react-select";
import ClientOnlySelect from "@/components/ClientOnlySelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface OptionType {
  value: string;
  label: string;
}

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label?: string;
  placeholder?: string;
  type?: string;
  helperText?: string;
  icon?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  selectOptions?: OptionType[];
  onSelectChange?: (
    option: SingleValue<OptionType> | OptionType[] | null
  ) => void;

  value?: string | Date | SingleValue<OptionType> | OptionType[] | null;
  onChangeValue?: (value: string) => void;
  onDateChange?: (date: Date | null) => void;
  isLoading?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder = "",
  type = "text",
  helperText = "",
  icon,
  disabled = false,
  error = false,
  errorMessage = "",
  selectOptions,
  onSelectChange,
  value,
  onChangeValue,
  onDateChange,
  isLoading = false,
  isClearable = true,
  isMulti = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const isDateType = type === "date";
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block font-medium text-gray-800 mb-1">{label}</label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#98A2B3] z-10">
            <Icon icon={icon} width={20} height={20} />
          </div>
        )}

        {/* SELECT */}
        {type === "select" && selectOptions ? (
          <ClientOnlySelect
            classNamePrefix="react-select"
            options={selectOptions}
            value={value as SingleValue<OptionType> | OptionType[]}
            onChange={(option) => {
              onSelectChange?.(
                option as SingleValue<OptionType> | OptionType[] | null
              );
            }}
            isDisabled={disabled}
            isLoading={isLoading}
            isClearable={isClearable}
            isMulti={isMulti}
            placeholder={placeholder}
            styles={{
              control: (base) => ({
                ...base,
                paddingLeft: icon ? "1.8rem" : "0.75rem",
                borderColor: error ? "#EF4444" : "#CED4DA",
                boxShadow: "none",
                backgroundColor: disabled ? "#E9ECEF" : "white",
                borderRadius: "12px",
                paddingRight: "12px",
                paddingTop: "4px",
                paddingBottom: "4px",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "8px",
                zIndex: 20,
                paddingLeft: 0,
              }),
              option: (base, { isFocused }) => ({
                ...base,
                backgroundColor: isFocused ? "#F0F0F0" : "white",
                color: "#374151",
                paddingLeft: "12px",
                paddingTop: "8px",
                paddingBottom: "8px",
              }),
              singleValue: (base) => ({
                ...base,
                color: disabled ? "#98A2B3" : "#374151",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#98A2B3",
              }),
              multiValue: (base) => ({
                ...base,
                background: "linear-gradient(135deg, #3BD5FF 0%, #367AF2 100%)",
                borderRadius: "8px",
                color: "white",
                padding: "3px 6px",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "white",
                fontWeight: 400,
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: "white",
                ":hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                },
              }),
            }}
          />
        ) : isDateType ? (
          <div className="w-full">
            <DatePicker
              selected={value instanceof Date ? value : null}
              onChange={(date) => {
                if (date) {
                  date.setHours(12, 0, 0, 0);
                }
                onDateChange?.(date);
              }}
              disabled={disabled}
              placeholderText={placeholder}
              dateFormat="dd/MM/yyyy"
              showMonthDropdown
              showYearDropdown
              maxDate={new Date()}
              dropdownMode="select"
              wrapperClassName="w-full"
              className={`w-full border border-[#CED4DA] rounded-xl py-2 px-3 ${
                icon ? "pl-10" : ""
              } text-gray-700 focus:outline-none transition-all ${
                disabled
                  ? "bg-[#E9ECEF] text-[#98A2B3] cursor-not-allowed"
                  : error
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>
        ) : (
          <input
            type={inputType}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChangeValue?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
            className={`w-full border border-[#CED4DA] rounded-xl py-2 px-3 placeholder:text-[#98A2B3] ${
              icon ? "pl-10" : ""
            } focus:outline-none transition-all ${
              disabled
                ? "bg-[#E9ECEF] text-[#98A2B3] cursor-not-allowed"
                : error
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            } ${type === "password" ? "pr-10" : ""}`}
          />
        )}

        {/* PASSWORD TOGGLE */}
        {type === "password" && !selectOptions && (
          <button
            type="button"
            onClick={toggleShowPassword}
            aria-label={
              showPassword ? "Sembunyikan Password" : "Tampilkan Password"
            }
            title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* HELPER TEXT / ERROR */}
      {error ||
        errorMessage ||
        (helperText && (
          <div className="min-h-[20px] transition-all mt-1">
            {error && errorMessage ? (
              <p className="text-sm text-red-500">{errorMessage}</p>
            ) : helperText ? (
              <p className="text-sm text-gray-500">{helperText}</p>
            ) : null}
          </div>
        ))}
    </div>
  );
};

export default Input;
