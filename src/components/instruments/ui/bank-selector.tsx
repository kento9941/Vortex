import { useState, useRef, useEffect } from "react";

interface Bank {
    value: string;
    label: string;
}

interface BankSelectorProps {
    banks: Bank[];
    bank: string;
    onChange: (bank: string) => void;
}

const BankSelector = ({ banks, bank, onChange }: BankSelectorProps) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selected = banks.find((b) => b.value === bank);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="dropdown-container" ref={containerRef}>
            <button
                type="button"
                className="dropdown-trigger"
                onClick={() => setOpen((o) => !o)}
            >
                <span>{selected?.label ?? "Select"}</span>

                {open ? (
                    // upward arrow when dropdown is open
                    <svg className="w-[0.5rem] h-[0.3rem]" viewBox="0 0 21 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.5 10.5L10.5 0.5L20.5 10.5" stroke="#C0C0C0" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    // downward arrow when dropdown closed
                    <svg className="w-[0.5rem] h-[0.3rem]" viewBox="0 0 21 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.5 0.5L10.5 10.5L0.5 0.5" stroke="#C0C0C0" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>

            {open && (
                <ul className="dropdown-list">
                    {banks.map((b) => (
                        <li
                            key={b.value}
                            className={`dropdown-option ${b.value === bank ? "is-selected" : ""}`}
                            onClick={() => {
                                onChange(b.value);
                                setOpen(false);
                            }}
                        >
                            {b.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BankSelector;