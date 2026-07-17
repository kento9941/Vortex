import { useGlobalStore } from "../../stores/useGlobalStore";

const STEP = 1;
const MIN = 20;
const MAX = 300;

const BPMSelector = () => {
    const BPM = useGlobalStore((state) => state.BPM );
    const setBPM = useGlobalStore((state) => state.setBPM );

    const handleChange = (value: number | string) => {
        let num = typeof value === "number" ? value : parseFloat(value);
        if (isNaN(num)) return;
        num = Math.max(MIN, Math.min(MAX, num));
        setBPM(num);
    };

    return (
        <div className="value-selector">
            <button
                type="button"
                className="value-button"
                onClick={() => handleChange(BPM - STEP)}
            >
                <svg className="w-full h-full" viewBox="0 0 13 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 0.5H12.1667" stroke="#C0C0C0"/>
                </svg>
            </button>
            <input
                className="value-input"
                type="number"
                step={STEP}
                min={MIN}
                max={MAX}
                value={BPM}
                onChange={(e) => handleChange(e.target.value)}
            />
            <button
                type="button"
                className="value-button"
                onClick={() => handleChange(BPM + STEP)}
            >
                <svg className="w-full h-full" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.33333 0.5V12.1667M0.5 6.33333H12.1667" stroke="#C0C0C0" />
                </svg>
            </button>
        </div>
    )
}

export default BPMSelector;