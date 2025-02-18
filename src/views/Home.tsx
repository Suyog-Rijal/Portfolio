import {FC, Fragment, useEffect, useState} from "react";
import {motion} from "framer-motion";
import CustomButton from "../components/CustomButton";

export const Home: FC = () => {
    const [count, setCount] = useState<number>(0);
    const [explode, setExplode] = useState<boolean>(false);

    useEffect(() => {
        if (count >= 5) {
            setExplode(true);
            setTimeout(() => {
                setExplode(false);
                setCount(0);
            }, 1500);
        }
    }, [count]);

    const particleTypes = [
        {size: "w-4 h-4", color: "bg-zinc-400", count: 12},
        {size: "w-3 h-3", color: "bg-zinc-300", count: 8},
        {size: "w-2 h-2", color: "bg-zinc-500", count: 15}
    ];

    const generateExplosionVariants = (index: number, total: number) => ({
        hidden: {opacity: 0, scale: 0, x: 0, y: 0},
        visible: {
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0.8],
            x: Math.cos(index * (2 * Math.PI / total)) * (Math.random() * 100 + 50),
            y: Math.sin(index * (2 * Math.PI / total)) * (Math.random() * 100 + 50),
            transition: {duration: 1.2, ease: [0.4, 0, 0.2, 1], times: [0, 0.2, 1]}
        }
    });

    const explosionContainer = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {staggerChildren: 0.02, delayChildren: 0.02}
        }
    };

    return (
        <div className="text-zinc-100 flex w-full px-24 flex-col">
            <div className="flex w-full gap-4 h-[90vh] items-center">

                <div className="w-1/2 flex flex-col gap-8">
                    <h1 className="text-6xl font-bold leading-tight">
                        Hi, I'm Suyog Rijal Building Tomorrow's Web
                        <motion.span
                            whileTap={{scale: 0.9}}
                            onClick={() => setCount(count + 1)}
                            className="cursor-pointer relative select-none inline-block"
                        >
                            🎯
                            {explode && (
                                <motion.div
                                    className="absolute top-0 left-0 w-full h-full"
                                    variants={explosionContainer}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {particleTypes.map((type, typeIndex) => (
                                        <Fragment key={typeIndex}>
                                            {[...Array(type.count)].map((_, i) => (
                                                <motion.div
                                                    key={`${typeIndex}-${i}`}
                                                    className={`absolute top-1/2 left-1/2 ${type.size} ${type.color} rounded-full blur-[1px] mix-blend-screen`}
                                                    variants={generateExplosionVariants(i, type.count)}
                                                    style={{transformOrigin: "center center"}}
                                                />
                                            ))}
                                        </Fragment>
                                    ))}
                                </motion.div>
                            )}
                        </motion.span>
                    </h1>
                    <p className="text-xl text-zinc-300 select-none">
                        Merging code with creativity to create digital excellence.
                    </p>
                    <div className={'select-none'}>
                        <CustomButton label="View My Work"/>
                    </div>
                </div>

                <div className="w-1/2 h-[450px] overflow-hidden flex justify-center items-center z-50 p-8">
                </div>
            </div>

        </div>
    );
};