import React, { InputHTMLAttributes, useEffect, useState } from "react";
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
  errorMessage?: string;  selectOptions?: OptionType[];
  onSelectChange?: (
    option: SingleValue<OptionType> | OptionType[] | null
  ) => void;
  onInputChange?: (inputValue: string) => void;

  value?: string | Date | SingleValue<OptionType> | OptionType[] | null;
  onChangeValue?: (value: string) => void;
  onDateChange?: (date: Date | null) => void;
  onFileChange?: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  currentFileName?: string;

  isLoading?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  isSearchable?: boolean;
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
  onInputChange,
  value,
  onChangeValue,
  onDateChange,  onFileChange,  accept,
  multiple = false,
  currentFileName,
  isLoading = false,
  isClearable = true,
  isMulti = false,
  isSearchable = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const isDateType = type === "date";
  const isDateTimeType = type === "datetime";
  const isFileType = type === "file";
  const isSelectType = type === "select";
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  useEffect(() => {
    if (type === "file" && value == null) {
      setSelectedFiles(null);
    }
  }, [value, type]);
  const fileExtension =
    selectedFiles && selectedFiles.length > 0
      ? selectedFiles[0].name.split(".").pop()?.toUpperCase() ?? ""
      : currentFileName
      ? currentFileName.split(".").pop()?.toUpperCase() ?? ""
      : "";

  const getCurrentFileName = () => {
    if (selectedFiles && selectedFiles.length > 0) {
      return Array.from(selectedFiles).map((f) => f.name).join(", ");
    }
    if (currentFileName) {
      return currentFileName;
    }
    return placeholder || "Tidak ada file dipilih";
  };

  const fileBadge = (extension: string) => {
    const fileIcon = extension
      ? `bxs:file-${extension.toLowerCase()}`
      : "tabler:file-filled";

    const fileColor = extension
      ? extension === "PDF"
        ? "bg-red-500"
        : extension === "DOCX" || extension === "DOC"
        ? "bg-blue-500"
        : extension === "XLSX" || extension === "XLS"
        ? "bg-green-500"
        : extension === "PNG" || extension === "JPG" || extension === "JPEG"
        ? "bg-yellow-500"
        : "bg-gray-600"
      : "bg-gray-200";

    return (
      <div
        className={`flex items-center ${fileColor} px-4 py-2 ${
          extension ? "text-white" : "text-gray-500"
        }`}
      >
        <Icon icon={fileIcon} width={20} height={20} />
        <span className="ml-2">{extension || "Unggah File"}</span>
      </div>
    );
  };

  return (
    <div className="w-full">
      {label && <label className="font-medium text-gray-800">{label}</label>}

      <div className="relative mt-1.5">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#98A2B3] z-10">
            <Icon icon={icon} width={20} height={20} />
          </div>
        )}

        
        {isFileType ? (
          <div
            className={`w-full border rounded-xl overflow-hidden transition-all focus-within:ring-2 ${
              disabled
                ? "border-gray-200 bg-gray-100"
                : error
                ? "border-red-500 focus-within:ring-red-300"
                : "border-gray-300 focus-within:ring-blue-300"
            }`}
          >            <div className="flex items-center">
              {(selectedFiles && selectedFiles.length > 0) || currentFileName
                ? fileBadge(fileExtension)
                : fileBadge("")}
              <div className="flex-1 px-4 py-2 text-gray-700 truncate">
                {getCurrentFileName()}
              </div>

              <input
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={(e) => {
                  const files = e.target.files;
                  setSelectedFiles(files);
                  onFileChange?.(files);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                {...props}
              />
            </div>
          </div>        ) : isSelectType && selectOptions ? (
          <ClientOnlySelect
            classNamePrefix="react-select"
            options={selectOptions}
            value={value as SingleValue<OptionType> | OptionType[]}
            onChange={(option) => {
              onSelectChange?.(
                option as SingleValue<OptionType> | OptionType[] | null
              );
            }}
            onInputChange={(inputValue) => {
              onInputChange?.(inputValue);
            }}
            isDisabled={disabled}
            isLoading={isLoading}
            isClearable={isClearable}
            isMulti={isMulti}
            isSearchable={isSearchable}
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
                cursor: disabled ? "not-allowed" : "pointer",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "8px",
                zIndex: 20,
                paddingLeft: 0,
                cursor: disabled ? "not-allowed" : "default",
              }),
              option: (base, { isFocused, isDisabled: optDisabled }) => ({
                ...base,
                backgroundColor: isFocused ? "#F0F0F0" : "white",
                color: "#374151",
                paddingLeft: "12px",
                paddingTop: "8px",
                paddingBottom: "8px",
                cursor: disabled || optDisabled ? "not-allowed" : "pointer",
              }),
              singleValue: (base) => ({
                ...base,
                color: disabled ? "#98A2B3" : "#374151",
                cursor: disabled ? "not-allowed" : "default",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#98A2B3",
                cursor: disabled ? "not-allowed" : "default",
              }),
              multiValue: (base) => ({
                ...base,
                background: "linear-gradient(135deg, #3BD5FF 0%, #367AF2 100%)",
                borderRadius: "8px",
                color: "white",
                padding: "3px 6px",
                cursor: "default",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "white",
                fontWeight: 400,
                cursor: "default",
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: "white",
                cursor: disabled ? "not-allowed" : "pointer",
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
              } focus:outline-none transition-all ${
                disabled
                  ? "bg-[#E9ECEF] text-[#98A2B3] cursor-not-allowed"
                  : error
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>
        ) : isDateTimeType ? (
          <div className="w-full">
            <DatePicker
              selected={value instanceof Date ? value : null}
              onChange={(date) => {
                if (date) {
                  date.setSeconds(0, 0);
                }
                onDateChange?.(date);
              }}
              disabled={disabled}
              placeholderText={placeholder}
              dateFormat="dd/MM/yyyy HH:mm:ss"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Waktu"
              showMonthDropdown
              showYearDropdown
              maxDate={new Date()}
              dropdownMode="select"
              wrapperClassName="w-full"
              className={`w-full border border-[#CED4DA] rounded-xl py-2 px-3 ${
                icon ? "pl-10" : ""
              } focus:outline-none transition-all ${
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
