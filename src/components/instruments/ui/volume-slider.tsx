interface VolumeSliderProps {
    gain: number;
    onChange: (gain: number) => void;
}

const VolumeSlider = ({ gain, onChange }: VolumeSliderProps) => {
    return (
        <label className="slider">
            <input
                type="range"
                className="level"
                min="0"
                max="1"
                step="0.05"
                value={gain}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        </label>
    );
};

export default VolumeSlider;