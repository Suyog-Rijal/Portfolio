// Final version with glow effect
// "use client";
// import { useEffect, useState, useRef } from "react";
//
// const NUM_PARTICLES = 150;
// const TWINKLE_CHANCE = 0.0002;
// const TWINKLE_DURATION = 2000;
// const MIN_SPEED = 0.01;
// const MAX_SPEED = 0.05;
//
// // Particle size range constants.
// const MIN_SIZE = 1;
// const MAX_SIZE = 4;
//
// // Constants for the click impulse.
// const IMPULSE_RADIUS = 10; // in percentage (0-100 coordinate space)
// const IMPULSE_STRENGTH = 0.4;
//
// // Constants for gravity (applied only to larger particles).
// const GRAVITY_RADIUS = 5; // in percentage: area of influence around the mouse
// const GRAVITY_FORCE = 0.0005; // base gravitational force (tweak to adjust slingshot intensity)
//
// // NEW: Constants for mouse proximity glow effect.
// const GLOW_DISTANCE = 15; // percentage distance from mouse to trigger extra glow
// const SIZE_INCREASE_FACTOR = 5; // up to 50% bigger when right on top of the mouse
// const EXTRA_GLOW_MAX = 1; // maximum additional glow opacity
//
// type Particle = {
//     id: number;
//     x: number;
//     y: number;
//     size: number;
//     baseOpacity: number;
//     glowOpacity: number;
//     isTwinkling: boolean;
//     twinkleStartTime: number | null;
//     vx: number;
//     vy: number;
// };
//
// const generateParticles = (): Particle[] =>
//     Array.from({ length: NUM_PARTICLES }, (_, i) => {
//         const angle = Math.random() * Math.PI * 2;
//         const speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
//
//         return {
//             id: i,
//             x: Math.random() * 100,
//             y: Math.random() * 100,
//             size: Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE,
//             baseOpacity: Math.random() * 0.3 + 0.1,
//             glowOpacity: 0,
//             isTwinkling: false,
//             twinkleStartTime: null,
//             vx: Math.cos(angle) * speed,
//             vy: Math.sin(angle) * speed,
//         };
//     });
//
// const DustBackground = () => {
//     const [particles, setParticles] = useState<Particle[]>([]);
//     const animationFrameRef = useRef<number>(0);
//     const lastTimeRef = useRef<number | null>(null);
//     // Mouse position stored in percentage coordinates.
//     const mousePositionRef = useRef<{ x: number; y: number } | null>(null);
//
//     useEffect(() => {
//         setParticles(generateParticles());
//
//         const handleMouseMove = (e: MouseEvent) => {
//             mousePositionRef.current = {
//                 x: (e.clientX / window.innerWidth) * 100,
//                 y: (e.clientY / window.innerHeight) * 100,
//             };
//         };
//         window.addEventListener("mousemove", handleMouseMove);
//
//         const updateParticles = (timestamp: number) => {
//             if (lastTimeRef.current === null) {
//                 lastTimeRef.current = timestamp;
//             }
//             const dt = timestamp - lastTimeRef.current;
//             lastTimeRef.current = timestamp;
//             const dtFactor = dt / 50;
//
//             setParticles((prevParticles) =>
//                 prevParticles.map((particle) => {
//                     let newVx = particle.vx;
//                     let newVy = particle.vy;
//
//                     // Only apply gravity to larger particles.
//                     if (mousePositionRef.current && particle.size > (MIN_SIZE + MAX_SIZE) / 2) {
//                         const { x: mouseX, y: mouseY } = mousePositionRef.current;
//                         const dx = mouseX - particle.x;
//                         const dy = mouseY - particle.y;
//                         const distance = Math.sqrt(dx * dx + dy * dy);
//                         if (distance < GRAVITY_RADIUS && distance > 0) {
//                             // Clamp the distance to avoid extreme forces.
//                             const clampedDistance = Math.max(distance, 0.5);
//                             // Factor increases nonlinearly as the particle gets closer.
//                             const factor = GRAVITY_FORCE * (GRAVITY_RADIUS / clampedDistance - 1);
//                             newVx += (dx / distance) * factor * dtFactor;
//                             newVy += (dy / distance) * factor * dtFactor;
//                         }
//                     }
//
//                     let newX = particle.x + newVx * dtFactor;
//                     let newY = particle.y + newVy * dtFactor;
//
//                     // Wrap around the edges.
//                     if (newX > 100) newX -= 100;
//                     if (newX < 0) newX += 100;
//                     if (newY > 100) newY -= 100;
//                     if (newY < 0) newY += 100;
//
//                     // Handle twinkling.
//                     let { isTwinkling, twinkleStartTime, glowOpacity } = particle;
//                     if (!isTwinkling && Math.random() < TWINKLE_CHANCE) {
//                         isTwinkling = true;
//                         twinkleStartTime = timestamp;
//                     }
//                     if (isTwinkling && twinkleStartTime) {
//                         const timeSinceStart = timestamp - twinkleStartTime;
//                         if (timeSinceStart >= TWINKLE_DURATION) {
//                             isTwinkling = false;
//                             twinkleStartTime = null;
//                             glowOpacity = 0;
//                         } else {
//                             const phase = Math.sin((timeSinceStart / TWINKLE_DURATION) * Math.PI);
//                             glowOpacity = phase * 0.5;
//                         }
//                     }
//
//                     return {
//                         ...particle,
//                         x: newX,
//                         y: newY,
//                         vx: newVx,
//                         vy: newVy,
//                         isTwinkling,
//                         twinkleStartTime,
//                         glowOpacity,
//                     };
//                 })
//             );
//
//             animationFrameRef.current = requestAnimationFrame(updateParticles);
//         };
//
//         animationFrameRef.current = requestAnimationFrame(updateParticles);
//
//         return () => {
//             cancelAnimationFrame(animationFrameRef.current);
//             window.removeEventListener("mousemove", handleMouseMove);
//         };
//     }, []);
//
//     useEffect(() => {
//         const handleClick = (e: MouseEvent) => {
//             const clickX = (e.clientX / window.innerWidth) * 100;
//             const clickY = (e.clientY / window.innerHeight) * 100;
//             setParticles((prevParticles) =>
//                 prevParticles.map((particle) => {
//                     const dx = particle.x - clickX;
//                     const dy = particle.y - clickY;
//                     const distance = Math.sqrt(dx * dx + dy * dy);
//                     if (distance < IMPULSE_RADIUS && distance > 0) {
//                         const factor = 1 - distance / IMPULSE_RADIUS;
//                         const nx = dx / distance;
//                         const ny = dy / distance;
//                         return {
//                             ...particle,
//                             vx: particle.vx + nx * IMPULSE_STRENGTH * factor,
//                             vy: particle.vy + ny * IMPULSE_STRENGTH * factor,
//                         };
//                     }
//                     return particle;
//                 })
//             );
//         };
//
//         window.addEventListener("click", handleClick);
//         return () => window.removeEventListener("click", handleClick);
//     }, []);
//
//     return (
//         <div className="fixed bg-zinc-900 inset-0">
//             {particles.map(({ id, x, y, size, baseOpacity, glowOpacity }) => {
//                 // Use the mouse position to determine if the particle is near enough.
//                 let computedSize = size;
//                 let computedGlow = glowOpacity;
//                 const mousePos = mousePositionRef.current;
//                 if (mousePos) {
//                     const dx = mousePos.x - x;
//                     const dy = mousePos.y - y;
//                     const distance = Math.sqrt(dx * dx + dy * dy);
//                     if (distance < GLOW_DISTANCE) {
//                         // Compute a factor (0 when at the threshold, up to 1 when right at the mouse).
//                         const proximityFactor = 1 - distance / GLOW_DISTANCE;
//                         // Increase the size by up to SIZE_INCREASE_FACTOR.
//                         computedSize = size * (1 + proximityFactor * SIZE_INCREASE_FACTOR);
//                         // Increase the glow opacity as well, clamped to 1.
//                         computedGlow = Math.min(glowOpacity + proximityFactor * EXTRA_GLOW_MAX, 1);
//                     }
//                 }
//
//                 return (
//                     <span
//                         key={id}
//                         className="absolute bg-white rounded-full"
//                         style={{
//                             left: `${x}%`,
//                             top: `${y}%`,
//                             width: `${computedSize}px`,
//                             height: `${computedSize}px`,
//                             opacity: baseOpacity + computedGlow,
//                             boxShadow:
//                                 computedGlow > 0
//                                     ? `0 0 ${computedSize + 3}px ${computedGlow * 2}px rgba(255, 255, 255, ${computedGlow})`
//                                     : "none",
//                             transition: "opacity 0.05s ease-out, box-shadow 0.05s ease-out",
//                         }}
//                     />
//                 );
//             })}
//         </div>
//     );
// };
//
// export default DustBackground;




"use client";
import { useEffect, useState, useRef } from "react";

const NUM_PARTICLES = 150;
const TWINKLE_CHANCE = 0.0009;
const TWINKLE_DURATION = 2000;
const TWINKLE_STRENGTH = 1;
const MIN_SPEED = 0.01;
const MAX_SPEED = 0.05;
const MIN_SIZE = 1;
const MAX_SIZE = 5;
const IMPULSE_RADIUS = 15;
const IMPULSE_STRENGTH = 1;
const GRAVITY_RADIUS = 5;
const GRAVITY_FORCE = 0.005;
const GLOW_DISTANCE = 15;
const SIZE_INCREASE_FACTOR = 4;
const EXTRA_GLOW_MAX = 0.3;
const FRICTION = 0.01;

type Particle = {
    id: number;
    x: number;
    y: number;
    size: number;
    baseOpacity: number;
    glowOpacity: number;
    isTwinkling: boolean;
    twinkleStartTime: number | null;
    vx: number;
    vy: number;
    baseSpeed: number;
};

const generateParticles = (): Particle[] =>
    Array.from({ length: NUM_PARTICLES }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;

        return {
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE,
            baseOpacity: Math.random() * 0.3 + 0.1,
            glowOpacity: 0,
            isTwinkling: false,
            twinkleStartTime: null,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            baseSpeed: speed,
        };
    });

const DustBackground = () => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const animationFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number | null>(null);
    const mousePositionRef = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        setParticles(generateParticles());

        const handleMouseMove = (e: MouseEvent) => {
            mousePositionRef.current = {
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            };
        };
        window.addEventListener("mousemove", handleMouseMove);

        const updateParticles = (timestamp: number) => {
            if (lastTimeRef.current === null) {
                lastTimeRef.current = timestamp;
            }
            const dt = timestamp - lastTimeRef.current;
            lastTimeRef.current = timestamp;
            const dtFactor = dt / 50;

            setParticles((prevParticles) =>
                prevParticles.map((particle) => {
                    let newVx = particle.vx;
                    let newVy = particle.vy;

                    // Apply a gravity-like effect if the mouse is close
                    if (mousePositionRef.current && particle.size > (MIN_SIZE + MAX_SIZE) / 2) {
                        const { x: mouseX, y: mouseY } = mousePositionRef.current;
                        const dx = mouseX - particle.x;
                        const dy = mouseY - particle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < GRAVITY_RADIUS && distance > 0) {
                            const clampedDistance = Math.max(distance, 0.5);
                            const factor = GRAVITY_FORCE * (GRAVITY_RADIUS / clampedDistance - 1);
                            newVx += (dx / distance) * factor * dtFactor;
                            newVy += (dy / distance) * factor * dtFactor;
                        }
                    }

                    // Update the position
                    let newX = particle.x + newVx * dtFactor;
                    let newY = particle.y + newVy * dtFactor;

                    // Wrap around the viewport (using percentages)
                    if (newX > 100) newX -= 100;
                    if (newX < 0) newX += 100;
                    if (newY > 100) newY -= 100;
                    if (newY < 0) newY += 100;

                    // Update twinkling state and glow opacity
                    let { isTwinkling, twinkleStartTime, glowOpacity } = particle;
                    if (!isTwinkling && Math.random() < TWINKLE_CHANCE) {
                        isTwinkling = true;
                        twinkleStartTime = timestamp;
                    }
                    if (isTwinkling && twinkleStartTime) {
                        const timeSinceStart = timestamp - twinkleStartTime;
                        if (timeSinceStart >= TWINKLE_DURATION) {
                            isTwinkling = false;
                            twinkleStartTime = null;
                            glowOpacity = 0;
                        } else {
                            const phase = Math.sin((timeSinceStart / TWINKLE_DURATION) * Math.PI);
                            glowOpacity = phase * TWINKLE_STRENGTH;
                        }
                    }

                    // --- NEW: Gradually return the particle's speed to its baseSpeed ---
                    const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
                    if (currentSpeed > 0) {
                        // Adjust this damping factor to control how quickly the impulse decays.
                        const dampingFactor = FRICTION;
                        const targetSpeed = particle.baseSpeed;
                        // Linearly interpolate current speed toward target speed.
                        const newSpeed = currentSpeed + (targetSpeed - currentSpeed) * dampingFactor;
                        const scale = newSpeed / currentSpeed;
                        newVx *= scale;
                        newVy *= scale;
                    }
                    // ---------------------------------------------------------------------

                    return {
                        ...particle,
                        x: newX,
                        y: newY,
                        vx: newVx,
                        vy: newVy,
                        isTwinkling,
                        twinkleStartTime,
                        glowOpacity,
                    };
                })
            );

            animationFrameRef.current = requestAnimationFrame(updateParticles);
        };

        animationFrameRef.current = requestAnimationFrame(updateParticles);

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const clickX = (e.clientX / window.innerWidth) * 100;
            const clickY = (e.clientY / window.innerHeight) * 100;
            setParticles((prevParticles) =>
                prevParticles.map((particle) => {
                    const dx = particle.x - clickX;
                    const dy = particle.y - clickY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < IMPULSE_RADIUS && distance > 0) {
                        const factor = 1 - distance / IMPULSE_RADIUS;
                        const nx = dx / distance;
                        const ny = dy / distance;
                        return {
                            ...particle,
                            vx: particle.vx + nx * IMPULSE_STRENGTH * factor,
                            vy: particle.vy + ny * IMPULSE_STRENGTH * factor,
                        };
                    }
                    return particle;
                })
            );
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return (
        <div className="fixed -z-40 inset-0 overflow-hidden">
            {particles.map(({ id, x, y, size, baseOpacity, glowOpacity }) => {
                let computedSize = size;
                let computedGlow = glowOpacity;
                const mousePos = mousePositionRef.current;
                if (mousePos) {
                    const dx = mousePos.x - x;
                    const dy = mousePos.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < GLOW_DISTANCE) {
                        const proximityFactor = 1 - distance / GLOW_DISTANCE;
                        computedSize = size * (1 + proximityFactor * SIZE_INCREASE_FACTOR);
                        computedGlow = Math.min(glowOpacity + proximityFactor * EXTRA_GLOW_MAX, 1);
                    }
                }

                const translateX = `${x}vw`;
                const translateY = `${y}vh`;

                return (
                    <span
                        key={id}
                        className="absolute  bg-white rounded-full"
                        style={{
                            left: 0,
                            top: 0,
                            transform: `translate3d(${translateX}, ${translateY}, 0)`,
                            width: `${computedSize}px`,
                            height: `${computedSize}px`,
                            opacity: baseOpacity + computedGlow,
                            boxShadow:
                                computedGlow > 0
                                    ? `0 0 ${computedSize + 10}px ${TWINKLE_STRENGTH}px rgba(255, 255, 255, ${computedGlow})`
                                    : "none",
                            willChange: "transform, box-shadow, opacity",
                            transition: "box-shadow 0.05s ease-out, opacity 0.05s ease-out",
                        }}
                    />
                );
            })}
        </div>
    );
};

export default DustBackground;
