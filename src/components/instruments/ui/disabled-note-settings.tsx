export default function DisabledNoteSettings() {
    return (
        <div className="w-[calc(100vw-57.2rem)] max-w-[35rem] h-[5.5rem] flex flex-col justify-center gap-[0.2rem] px-[1rem] z-10">
            <div className="grey-text mb-[0.5rem]">NOTE SETTINGS</div>
            <div className="small-text w-full flex justify-between">
                <span className="w-[16rem]">OCTAVE</span>
                <span className="w-[7rem]">RELEASE</span>
                <span className="w-[7rem]">VOLUME</span>
            </div>

            <div className="w-full flex items-center justify-between">
                {/* octave */}
                <div className="w-[16rem] flex justify-start">
                    <OctaveRadio />
                </div>

                {/* release */}
                <div className="w-[7rem] flex justify-start">
                    <ReleaseSelector />
                </div>

                {/* volume */}
                <div className="w-[7rem] flex items-center justify-start gap-[0.2rem]">
                    <svg className="h-[0.8rem] aspect-[35/25]" viewBox="0 0 35 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.95 0.5C32.0745 3.62546 33.8298 7.86393 33.8298 12.2833C33.8298 16.7027 32.0745 20.9412 28.95 24.0667M23.0667 6.38333C24.6289 7.94606 25.5066 10.0653 25.5066 12.275C25.5066 14.4847 24.6289 16.6039 23.0667 18.1667M15.5 0.616668L7.16667 7.28333H0.5V17.2833H7.16667L15.5 23.95V0.616668Z" stroke="#C0C0C0" strokeWidth="0.15rem" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <VolumeSlider />
                </div>
            </div>
        </div>
    );
}

const OctaveRadio = () => {
    return (
        <div className="radio-container">
            {[1, 2, 3, 4, 5, 6].map((octave) => {
                return (
                    <div className="radio-wrapper" key={octave}>
                        <label className="radio-button">
                            <span className="radio-label">{`${octave}`}</span>
                            <input
                                type="radio"
                                value={0}
                                disabled
                            />
                            <span className="radio-checkmark"></span>
                        </label>
                    </div>
                );
            })}
        </div>
    );
}

const ReleaseSelector = () => {
    return (
        <div className="value-selector">
            <button
                type="button"
                className="value-button"
                disabled
            >
                <svg className="w-full h-full" viewBox="0 0 13 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 0.5H12.1667" stroke="#C0C0C0"/>
                </svg>
            </button>
            <input
                className="value-input"
                type="number"
                value={0}
                disabled
            />
            <button
                type="button"
                className="value-button"
                disabled
            >
                <svg className="w-full h-full" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.33333 0.5V12.1667M0.5 6.33333H12.1667" stroke="#C0C0C0" />
                </svg>
            </button>
        </div>
    );
}

const VolumeSlider = () => {
    return (
        <label className="slider">
            <input
                type="range"
                className="level"
                value={0}
                disabled
            />
        </label>
    );
};
