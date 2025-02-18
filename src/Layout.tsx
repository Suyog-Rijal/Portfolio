import { FC, ReactNode } from "react";
import Code from "./components/Code.tsx";
import DustBackground from "./components/Particles.tsx";
import Navbar from "./components/Navbar.tsx";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex-col flex items-center">
            <Code />
            <DustBackground />
            <Navbar />
            {children}
        </div>
    );
};

export default Layout;
