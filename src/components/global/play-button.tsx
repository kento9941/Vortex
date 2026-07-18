import { useStrudelStore } from "../../stores/useStrudelStore";

const PlayButton = () => {
    const play = useStrudelStore((state) => state.play);
    const stop = useStrudelStore((state) => state.stop);
    const proc = useStrudelStore((state) => state.proc);
    const isPlaying = useStrudelStore((state) => state.isPlaying);

    return (
        <button
            type="button"
            aria-label={isPlaying ? "Stop" : "Play"}
            className="cursor-pointer"
            onClick={async () => {
                if (isPlaying) { stop?.() }
                else { await proc?.(); play?.(); }
            }}
        >
            {isPlaying ? <StopIcon /> : <PlayIcon />}
        </button>
    )
}

const PlayIcon = () => {
    return (
        <svg className="h-[0.8rem]" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 14V0L11 7L0 14Z" fill="#C0C0C0"/>
        </svg>
    )
}

const StopIcon = () => {
    return (
        <svg className="h-[0.8rem]" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14V0H12V14H8ZM0 14V0H4V14H0Z" fill="#C0C0C0"/>
        </svg>
    )
}

export default PlayButton;
