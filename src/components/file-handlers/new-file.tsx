import save from "../../utils/file-handlers/save-file";
import reset from "../../utils/file-handlers/reset-file";

const NewFile = () => {
    const handleNewFile = async () => {
        // ask if the user wants to save first
        const shouldSave = window.confirm(
            "Do you want to save your current project?"
        );

        if (shouldSave) {
            // save current state, then reset
            await save();
            reset();
        } else {
            // double-check if they want to discard unsaved changes
            const confirmDiscard = window.confirm(
                "Start a new file without saving? Unsaved changes will be lost."
            );

            if (confirmDiscard) {
                reset();
            }
        }
    };

    return (
        <button
            type="button"
            className="cursor-pointer"
            onClick={handleNewFile}
        >
            NEW
        </button>
    );
};

export default NewFile;