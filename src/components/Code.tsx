// import React, {useState, useCallback, useRef, useEffect} from 'react';

import {FC} from "react";

const Code: FC = () => {
    // const RADIUS = 100;
    // const containerRef = useRef<HTMLDivElement>(null);
    // const spotLightRef = useRef<HTMLDivElement>(null);
    //
    // const [mousePos, setMousePos] = useState({x: 0, y: 0});
    // const [maskPos, setMaskPos] = useState({x: 0, y: 0});

    // const handleMouseMove = useCallback((event: MouseEvent) => {
        // const newMousePos = {
        //     x: event.clientX - RADIUS,
        //     y: event.clientY - RADIUS,
        // };
        //
        // if (containerRef.current) {
        //     const containerReact = containerRef.current.getBoundingClientRect();
        //     const newMaskPos = {
        //         x: event.clientX - containerReact.left,
        //         y: event.clientY - containerReact.top,
        //     };
        //
        //     setMousePos(newMousePos);
        //     setMaskPos(newMaskPos);
        // }
    // }, [RADIUS]);
    //
    // useEffect(() => {
    //     window.addEventListener('mousemove', handleMouseMove);
    //     return () => {
    //         window.removeEventListener('mousemove', handleMouseMove);
    //     };
    // }, [handleMouseMove]);
    //
    // const getMaskStyle = React.useMemo(() => {
    //     const {x, y} = maskPos;
    //     return {
    //         maskImage: `radial-gradient(circle ${RADIUS}px at ${x}px ${y}px, black, transparent)`,
    //         WebkitMaskImage: `radial-gradient(circle ${RADIUS}px at ${x}px ${y}px, black, transparent)`,
    //     };
    // }, [maskPos, RADIUS]);

    return (
        <div className="fixed text-white -z-50 bg-[#0f0f0f] w-full h-full flex justify-center items-center">

            <div // ref={containerRef} style={getMaskStyle}
                className="flex w-full h-full justify-end max-w-7xl items-center transition-opacity duration-300">
                {/*elements goes here*/}
            </div>


            {/*<div ref={spotLightRef} className="absolute z-50 rounded-full pointer-events-none" style={{*/}
            {/*    left: mousePos.x,*/}
            {/*    top: mousePos.y,*/}
            {/*    width: RADIUS * 2,*/}
            {/*    height: RADIUS * 2,*/}
            {/*        transition: 'transform 0.05s linear',*/}
            {/*    }}/>*/}
        </div>
    );
};

export default Code;
