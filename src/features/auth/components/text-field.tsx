import React, { forwardRef } from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, id, type = "text", className, ...props }, ref) => {
    return (
      <div className="flex flex-col  w-full group">
        <label
          htmlFor={id}
          className={`text-sm font-medium ml-1 transition-colors ${
            error
              ? "text-danger"
              : "text-body-soft group-focus-within:text-primary"
          }`}
        >
          {label}
        </label>

        <div className="relative">
          <input
            {...props}
            ref={ref}
            id={id}
            type={type}
            className={`
              w-full px-4 py-3.5 bg-surface border rounded-2xl text-body outline-none transition-all duration-200
              placeholder:text-text-muted/40
              ${
                error
                  ? "border-danger focus:ring-4 focus:ring-danger/10"
                  : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm"
              }
              ${className}
            `}
          />

        </div>

        {error && (
          <p className="text-danger text-xs font-medium mt-1 ml-2 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";
