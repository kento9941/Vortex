import type { MelodicInstrumentSettings, MelodicInstrumentData } from "../../../stores/types";
import BankSelector from "../ui/bank-selector";
import Speaker from "../ui/speaker";
import VolumeSlider from "../ui/volume-slider";

interface InstrumentSettingsProps {
    banks: { value: string, label: string }[];
    settings: MelodicInstrumentSettings;
    updateInstrument: <K extends keyof MelodicInstrumentData>(name: K, updates: Partial<MelodicInstrumentData[K]>) => void;
}

export default function InstrumentSettings({ banks, settings, updateInstrument }: InstrumentSettingsProps) {
    return (
        <div className="w-[17rem] h-[4rem] bg-[#252525] flex flex-col justify-center gap-[0.2rem]">
            <div className="small-text flex px-[1rem]">
                <span className="w-[9.5rem]">BANK</span>
                <span>VOLUME</span>
            </div>

            <div className="flex items-center px-[1rem]">
                <div className="w-[9.5rem]">
                    <BankSelector
                        banks={banks}
                        bank={settings.bank}
                        onChange={(bank) => updateInstrument("settings", { bank })}
                    />
                </div>

                <div className="flex items-center gap-[0.2rem]">
                    <Speaker
                        play={settings.play}
                        onToggle={() => updateInstrument("settings", { play: !settings.play })}
                    />
                    <VolumeSlider
                        gain={settings.gain}
                        onChange={(gain) => updateInstrument("settings", { gain })}
                    />
                </div>
            </div>
        </div>
    );
}