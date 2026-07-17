import type { InstrumentSettings } from "../../../stores/types";
import type { DrumState } from "../../../stores/useDrumStore";
import BankSelector from "../ui/bank-selector";
import Speaker from "../ui/speaker";
import VolumeSlider from "../ui/volume-slider";

interface DrumSettingsProps {
    banks: { value: string; label: string }[];
    settings: InstrumentSettings;
    updateDrum: <K extends keyof DrumState>(name: K, updates: Partial<DrumState[K]>) => void;
}

export default function DrumSettings({ banks, settings, updateDrum }: DrumSettingsProps) {
    return (
        <div className="w-[17rem] h-[5.5rem] flex flex-col justify-center gap-[0.2rem] px-[1rem] z-10">
            <div className="grey-text mb-[0.5rem]">INSTRUMENT SETTINGS</div>
            <div className="small-text flex">
                <span className="w-[9.5rem]">BANK</span>
                <span>VOLUME</span>
            </div>

            <div className="flex items-center">
                <div className="w-[9.5rem]">
                    <BankSelector
                        banks={banks}
                        bank={settings.bank}
                        onChange={(bank) => updateDrum("settings", { bank })}
                    />
                </div>

                <div className="flex items-center gap-[0.2rem]">
                    <Speaker
                        play={settings.play}
                        onToggle={() => updateDrum("settings", { play: !settings.play })}
                    />
                    <VolumeSlider
                        gain={settings.gain}
                        onChange={(gain) => updateDrum("settings", { gain })}
                    />
                </div>
            </div>
        </div>
    );
}