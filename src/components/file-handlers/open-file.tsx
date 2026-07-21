import { useRef } from "react";
import open from "../../utils/file-handlers/open-file";
import save from "../../utils/file-handlers/save-file";

const OpenFile = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleOpenClick = async () => {
        // ask if the user wants to save first
        const shouldSave = window.confirm(
            "Do you want to save your current project?"
        );

        if (shouldSave) await save();
        fileInputRef.current?.click();
    };

    return (
        <>
            <button
                type="button"
                className="cursor-pointer"
                onClick={handleOpenClick}
            >
                OPEN
            </button>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) open(file);
                    // reset input value so selecting the same file twice still triggers onChange
                    e.target.value = "";
                }}
            />
        </>
    );
};

export default OpenFile;