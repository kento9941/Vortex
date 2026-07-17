interface AddDeleteButtonProps {
    onAdd: () => void;
    onDelete: () => void;
}

const AddDeleteButton = ({ onAdd, onDelete }: AddDeleteButtonProps) => {
    return (
        <div className="w-[3.5rem] h-[1.6rem] flex items-center justify-center gap-[0.1rem] bg-[#252525]">
            <button
                className="w-[1.5rem] h-[1.5rem] p-[0.3rem] cursor-pointer"
                onClick={onDelete}
            >
                <svg className="w-full h-full" viewBox="0 0 13 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 0.5H12.1667" stroke="#C0C0C0"/>
                </svg>
            </button>
            <button
                className="w-[1.5rem] h-[1.5rem] p-[0.3rem] cursor-pointer"
                onClick={onAdd}
            >
                <svg className="w-full h-full" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.33333 0.5V12.1667M0.5 6.33333H12.1667" stroke="#C0C0C0" />
                </svg>
            </button>
        </div>
    );
};

export default AddDeleteButton;