import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Pipe {
    id: number;
    gapPosition: number;
    scored?: boolean;
}

export const Game = () => {
    const [birdY, setBirdY] = useState<number>(window.innerHeight / 2);
    const [pipes, setPipes] = useState<Pipe[]>([]);
    const [score, setScore] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const velocityRef = useRef<number>(0);

    const CONFIG = {
        gravity: 0.1,
        jumpForce: 3,
        birdSize: 20,
        pipeWidth: 30,
        pipeGap: 250,
        pipeSpeed: 100,
        pipeFrequency: 1500,
    };

    const jump = () => {
        if (gameOver) return;
        velocityRef.current = -CONFIG.jumpForce;
        setBirdY((prevY) => Math.max(prevY - CONFIG.jumpForce * 2, 0));
    };

    const checkCollision = (birdYPos: number) => {
        const birdLeft = window.innerWidth / 2 - CONFIG.birdSize / 2;
        const birdRight = birdLeft + CONFIG.birdSize;
        const birdTop = birdYPos;
        const birdBottom = birdYPos + CONFIG.birdSize;

        if (birdBottom > window.innerHeight || birdTop < 0) {
            return true;
        }

        for (const pipe of pipes) {
            const pipeX = window.innerWidth - CONFIG.pipeWidth;
            if (pipeX <= birdRight && pipeX + CONFIG.pipeWidth >= birdLeft) {
                if (birdTop < pipe.gapPosition || birdBottom > pipe.gapPosition + CONFIG.pipeGap) {
                    return true;
                }
            }
        }

        return false;
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                if (gameOver) {
                    setGameOver(false);
                    setScore(0);
                    setPipes([]);
                    setBirdY(window.innerHeight / 2);
                    velocityRef.current = 0;
                } else {
                    jump();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameOver]);

    useEffect(() => {
        if (gameOver) return;

        let animationFrameId: number;
        const update = () => {
            velocityRef.current += CONFIG.gravity;
            setBirdY(prevY => {
                const newY = prevY + velocityRef.current;
                if (checkCollision(newY)) {
                    setGameOver(true);
                    return prevY;
                }
                return newY;
            });

            if (!gameOver) {
                animationFrameId = requestAnimationFrame(update);
            }
        };

        animationFrameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrameId);
    }, [pipes, gameOver]);

    useEffect(() => {
        if (gameOver) return;

        const pipeInterval = setInterval(() => {
            const minGapPosition = 100;
            const maxGapPosition = window.innerHeight - CONFIG.pipeGap - 100;
            const newPipe: Pipe = {
                id: Date.now(),
                gapPosition: Math.floor(Math.random() * (maxGapPosition - minGapPosition + 1)) + minGapPosition,
                scored: false
            };
            setPipes(prevPipes => [...prevPipes, newPipe]);
        }, CONFIG.pipeFrequency);

        return () => clearInterval(pipeInterval);
    }, [gameOver]);

    return (
        <div
            className="w-full h-full relative overflow-hidden"
            onClick={gameOver ? () => {
                setGameOver(false);
                setScore(0);
                setPipes([]);
                setBirdY(window.innerHeight / 2);
                velocityRef.current = 0;
            } : jump}
        >
            <div className="absolute top-4 left-4 text-white text-2xl font-bold">
                Score: {score}
            </div>

            {gameOver && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
                    <p className="text-xl">Final Score: {score}</p>
                    <p className="text-sm mt-4">Press Space or Click to restart</p>
                </div>
            )}

            <div
                className="bg-white rounded-full absolute"
                style={{
                    height: CONFIG.birdSize,
                    width: CONFIG.birdSize,
                    top: birdY,
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            />

            {pipes.map((pipe) => (
                <motion.div
                    key={pipe.id}
                    initial={{ x: window.innerWidth }}
                    animate={{ x: -CONFIG.pipeWidth }}
                    transition={{ duration: (window.innerWidth + CONFIG.pipeWidth) / CONFIG.pipeSpeed, ease: "linear" }}
                    onAnimationComplete={() => {
                        setPipes(prev => prev.filter(p => p.id !== pipe.id));
                        if (!pipe.scored) {
                            setScore(s => s + 1);
                        }
                    }}
                    className="absolute top-0 h-full flex flex-col justify-between"
                    style={{ width: CONFIG.pipeWidth }}
                >
                    <div className="bg-white" style={{ height: pipe.gapPosition }} />
                    <div style={{ height: CONFIG.pipeGap }} />
                    <div className="bg-white" style={{ height: window.innerHeight - pipe.gapPosition - CONFIG.pipeGap }} />
                </motion.div>
            ))}
        </div>
    );
};

export default Game;
