import React, {useEffect, useState, useRef} from "react";
import {motion} from "framer-motion";

// --- Configuration ---
const PARTICLE_LIFETIME = 1000; // How long each particle lasts (ms)
const FALL_SPEED = 0.1; // Speed of falling particles
const HORIZONTAL_DRIFT = 0.05; // Slight left/right movement variation
const MIN_SIZE = 3; // Smallest particle size
const MAX_SIZE = 8; // Largest particle size
const SPAWN_INTERVAL = 150; // Time between new particles (ms)
const EXTRA_PARTICLES_ON_CLICK = 12; // Burst effect on click

type ButtonParticle = {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    creationTime: number;
};

const CustomButton: React.FC<{ label: string; onClick?: () => void }> = ({
                                                                             label,
                                                                             onClick,
                                                                         }) => {
    const [particles, setParticles] = useState<ButtonParticle[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const animationFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(performance.now());

    // Function to create a new dust particle
    const addParticle = () => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();

        const newParticle: ButtonParticle = {
            id: Date.now() + Math.random(),
            x: rect.width / 2 + (Math.random() - 0.5) * rect.width * 0.6, // Horizontal randomness
            y: 0, // Start just below the button
            vx: (Math.random() - 0.5) * HORIZONTAL_DRIFT, // Small left-right drift
            vy: FALL_SPEED + Math.random() * 0.05, // Slightly random vertical speed
            size: Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE,
            opacity: 1, // Fully visible at creation
            creationTime: performance.now(),
        };

        setParticles((prev) => [...prev, newParticle]);
    };

    // Particle update loop
    useEffect(() => {
        const updateParticles = () => {
            const now = performance.now();
            const dt = now - lastTimeRef.current;
            lastTimeRef.current = now;

            setParticles((prev) =>
                prev
                    .map((particle) => ({
                        ...particle,
                        x: particle.x + particle.vx * dt, // Horizontal movement
                        y: particle.y + particle.vy * dt, // Vertical movement
                        opacity: Math.max(0, 1 - (now - particle.creationTime) / PARTICLE_LIFETIME), // Fade out effect
                    }))
                    .filter((particle) => now - particle.creationTime < PARTICLE_LIFETIME) // Remove expired particles
            );

            animationFrameRef.current = requestAnimationFrame(updateParticles);
        };

        animationFrameRef.current = requestAnimationFrame(updateParticles);
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, []);

    // Spawn particles at intervals
    useEffect(() => {
        const interval = setInterval(() => {
            addParticle();
        }, SPAWN_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    // Handle click effect (extra particles)
    const handleClick = () => {
        for (let i = 0; i < EXTRA_PARTICLES_ON_CLICK; i++) {
            addParticle();
        }
        if (onClick) onClick();
    };

    return (
        <motion.div className="relative inline-block">
            {/* The Button */}
            <motion.button
                ref={buttonRef}
                className="px-16 py-3 text-black rounded-4xl relative z-50 overflow-hidden
               shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300
               hover:shadow-[0_0_25px_rgba(255,255,255,0.9)]"
                onClick={handleClick}
            >
                {label}
            </motion.button>

            <div className={'bg-white rounded-3xl absolute top-0 w-full h-full overflow-hidden'}>
                <div className={'h-full relative flex justify-end flex-col items-center'}>
                    <div className={'absolute h-full justify-between items-center w-full px-4 flex z-20'}>
                        <img
                            src="/drill.png"
                            alt="Image"
                            className={'w-10 h-10'}
                            style={{transform: 'scaleX(-1)'}}
                        />
                        <img
                            style={{
                                display: "block",
                                WebkitUserSelect: "none",
                            }}
                            src="/drill.png"
                            alt="Image"
                            className={'w-10 h-10'}
                        />
                    </div>


                    <div className={'z-10'}>
                        <img src={'/ground.png'} alt={'x'} className={'w-full mt-2'}/>
                    </div>

                </div>
            </div>

            {/* Dust particles */}
            <div className="absolute left-1/2 top-full -translate-x-[50%] w-full h-16 pointer-events-none">
                {particles.map((particle) => {
                    const elapsed = performance.now() - particle.creationTime;
                    const opacity = 1 - elapsed / PARTICLE_LIFETIME;

                    return (
                        <span
                            key={particle.id}
                            style={{
                                position: "absolute",
                                left: `calc(${particle.x}px)`,
                                top: `${particle.y}px`,
                                width: particle.size,
                                height: particle.size,
                                backgroundColor: "rgba(169, 169, 169, 0.7)",
                                borderRadius: "50%",
                                pointerEvents: "none",
                                opacity,
                                transform: `scale(${Math.random() * 0.3 + 0.7})`,
                            }}
                        />
                    );
                })}
            </div>
        </motion.div>
    );
};

export default CustomButton;
