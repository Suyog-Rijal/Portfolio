import { motion } from "framer-motion";

interface navbarProps {
    label: string;
    href: string;
}

const navbarItems: navbarProps[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '/contact' },
];

const Navbar = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-white flex px-24 w-full py-4 justify-between items-center backdrop-blur sticky top-0 z-50"
        >
            <div className="flex justify-center gap-2 items-center">
                <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
                <span className="text-2xl font-bold">Suyog</span>
            </div>

            <div className="w-1/3 flex justify-evenly items-center">
                {navbarItems.map((each, index) => (
                    <motion.a
                        href={each.href}
                        key={index}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="text-white hover:text-gray-300 duration-500"
                    >
                        {each.label}
                    </motion.a>
                ))}
            </div>

            <div className="flex justify-center items-center gap-4">
                <motion.a
                    href="https://github.com/Suyog-Rijal"
                    target="_blank"
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex justify-center items-center gap-1 py-1 px-3 rounded-xl border border-zinc-700"
                >
                    {/*@ts-expect-error: Ion-icon is not recognized by typescript*/}
                    <ion-icon name="logo-github"></ion-icon>
                    <p>Github</p>
                </motion.a>

                <motion.a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=rijalsuyog75@gmail.com"
                    target="_blank"
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex justify-center items-center gap-1 py-1 px-3 rounded-xl border border-zinc-700"
                >
                    {/*@ts-expect-error: Ion-icon is not recognized by typescript*/}
                    <ion-icon name="mail"></ion-icon>
                    <p>Gmail</p>
                </motion.a>
            </div>
        </motion.div>
    );
};

export default Navbar;

// const Navbar = () => {
//     return (
//         <div className={'text-white w-full mx-auto flex px-24 justify-between items-center absolute my-4'}>
//
//             <div>
//                 <img src="x" alt="x"/>
//             </div>
//
//             <div className={'relative'}>
//                 <div className={'bg-pink-500 w-8 h-8 rounded-full absolute'}></div>
//
//                 <ul className={'flex gap-12 justify-evenly py-2 px-4 bg-white text-black rounded'}>
//                     <li>
//                         {/*@ts-expect-error: not recognized by typescript*/}
//                         <ion-icon name="home-outline"></ion-icon>
//                     </li>
//
//                     <li>
//                         {/*@ts-expect-error: not recognized by typescript*/}
//                         <ion-icon name="folder-open-outline"></ion-icon>
//                     </li>
//
//                     <li>
//                         {/*@ts-expect-error: not recognized by typescript*/}
//                         <ion-icon name="person-outline"></ion-icon>
//                     </li>
//                 </ul>
//             </div>
//
//
//             <div className={'flex'}>
//                 <p>gg</p>
//                 <p>gg</p>
//             </div>
//
//         </div>
//     )
// };
//
// export default Navbar;
