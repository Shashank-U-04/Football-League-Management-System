import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
                <input
                    ref={ref}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-slate-700 text-slate-900 dark:text-white dark:border-slate-600 ${error ? 'border-red-500' : 'border-slate-300'
                        } ${className}`}
                    {...props}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';

export default FormInput;
