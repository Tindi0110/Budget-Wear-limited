import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '../utils';

interface Option {
    value: string;
    label: string;
}

interface SearchSelectProps {
    options?: Option[];
    value?: string;
    onChange: (val: string) => void;
    onSearch?: (query: string) => void;
    isLoading?: boolean;
    placeholder?: string;
}

export function SearchSelect({
    options = [],
    value,
    onChange,
    onSearch,
    isLoading = false,
    placeholder = "Search..."
}: SearchSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (onSearch) {
            const timeoutId = setTimeout(() => {
                onSearch(query);
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [query, onSearch]);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div
                className="w-full min-h-[42px] px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
                onClick={() => setIsOpen(true)}
            >
                {!isOpen ? (
                    <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                ) : (
                    <div className="flex items-center w-full gap-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            autoFocus
                            type="text"
                            className="w-full bg-transparent outline-none py-0 text-sm"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={placeholder}
                        />
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {isLoading ? (
                        <div className="p-4 flex justify-center text-gray-500">
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                    ) : options.length > 0 ? (
                        <ul>
                            {options.map((opt) => (
                                <li
                                    key={opt.value}
                                    className={cn(
                                        "px-4 md:py-2 py-4 cursor-pointer hover:bg-gray-100 text-sm",
                                        opt.value === value && "bg-blue-50 text-blue-600 font-medium"
                                    )}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                        setQuery('');
                                    }}
                                >
                                    {opt.label}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
