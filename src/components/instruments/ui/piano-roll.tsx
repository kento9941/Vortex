const PianoRoll = () => {
    return (
        <div className="relative">
            {/* white keys */}
            <div className="w-[4.8rem] flex flex-col gap-[0.2rem]">
                <div className="w-full h-[4.6rem] bg-[#C0C0C0] rounded-r-[0.1rem]" />
                <div className="w-full h-[4.6rem] bg-[#C0C0C0] rounded-r-[0.1rem]" />
                <div className="w-full h-[4.6rem] bg-[#C0C0C0] rounded-r-[0.1rem]" />
                <div className="w-full h-[4.6rem] bg-[#C0C0C0] rounded-r-[0.1rem]" />
                <div className="w-full h-[4.6rem] bg-[#C0C0C0] rounded-r-[0.1rem]" />
                <div className="w-full h-[4.6rem] bg-[#C0C0C0] rounded-r-[0.1rem]" />
                <div className="w-full h-[4.6rem] bg-[#C0C0C0] rounded-r-[0.1rem]" />
            </div>

            {/* black keys */}
            <div className="absolute top-[2.9rem] -left-[0.05rem] w-[2.4rem] flex flex-col gap-[0.2rem] z-10">
                <div className="w-full h-[2.4rem] bg-[#151515] rounded-r-[0.1rem]" />
                <div className="w-full h-[2.4rem] bg-[#151515] rounded-r-[0.1rem] mt-[3rem]" />
                <div className="w-full h-[2.4rem] bg-[#151515] rounded-r-[0.1rem] mt-[3rem]" />
                <div className="w-full h-[2.4rem] bg-[#151515] rounded-r-[0.1rem] mt-[5.8rem]" />
                <div className="w-full h-[2.4rem] bg-[#151515] rounded-r-[0.1rem] mt-[3rem]" />
            </div>
        </div>
    )
}

export default PianoRoll;