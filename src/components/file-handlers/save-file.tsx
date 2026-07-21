import save from "../../utils/file-handlers/save-file";

const SaveFile = () => {
    return (
        <button
            type="button"
            className="cursor-pointer"
            onClick={() => void save()}
        >
            SAVE
        </button>
    );
};

export default SaveFile;