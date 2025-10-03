import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMenu, FiX } from 'react-icons/fi';
import { FaBehance } from 'react-icons/fa';
import { useState } from 'react';

const Header = ({ contactFormOpen, openContactForm, closeContactForm }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const navItems = ['Home', 'About', 'Projects', 'Experience', 'Contact'];

    return (
        <header className="absolute top-0 left-0 w-full z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
                {/* Logo/Brand */}
                <div className="flex items-center">
                    <div className="h-10 w-10 flex items-center justify-center mr-3">
                        <img src="./images/Logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xl font-bold text-white">
                        ANVAYA ARSHA
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className='lg:flex hidden space-x-8'>
                    {navItems.map((item, index) => (
                        <a
                            href={`#${item.toLowerCase()}`}
                            key={index}
                            className="text-white hover:text-cyan-400 transition-colors duration-300"
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                {/* Social Links & CTA */}
                <div className='md:flex hidden items-center space-x-4'>
                    <a
                        className='text-gray-300 hover:text-cyan-400 transition-colors duration-300'
                        href='https://github.com/po0mpomm'
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FiGithub className='w-5 h-5' />
                    </a>

                    <a
                        className='text-gray-300 hover:text-cyan-400 transition-colors duration-300'
                        href='https://www.linkedin.com/in/anvaya-arsha-761037252/'
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FiLinkedin className='w-5 h-5' />
                    </a>

                    <a
                        className='text-gray-300 hover:text-cyan-400 transition-colors duration-300'
                        href='https://www.behance.net/anvayaarsha1'
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaBehance className='w-5 h-5' />
                    </a>

                    <button
                        onClick={openContactForm}
                        className='ml-4 px-6 py-2 rounded-xl bg-cyan-500 text-white font-bold hover:bg-cyan-400 transition-colors duration-300'
                    >
                        Hire Me
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className='md:hidden flex items-center'>
                    <button 
                        onClick={toggleMenu} 
                        className='text-white hover:text-cyan-400 transition-colors duration-300'
                    >
                        {isOpen ? <FiX className='h-6 w-6' /> : <FiMenu className='h-6 w-6' />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className='md:hidden bg-black/95 backdrop-blur-md border-t border-cyan-500/20'
                    >
                        <div className='px-4 py-6 space-y-4'>
                            {navItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-white font-semibold py-2 hover:text-cyan-300 transition-colors duration-300"
                                >
                                    {item}
                                </a>
                            ))}
                            <div className='flex space-x-4 pt-4 border-t border-gray-700'>
                                <a
                                    className='text-gray-300 hover:text-cyan-400 transition-colors duration-300'
                                    href='https://github.com/po0mpomm'
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FiGithub className='w-5 h-5' />
                                </a>
                                <a
                                    className='text-gray-300 hover:text-cyan-400 transition-colors duration-300'
                                    href='https://www.linkedin.com/in/anvaya-arsha-761037252/'
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FiLinkedin className='w-5 h-5' />
                                </a>
                                <a
                                    className='text-gray-300 hover:text-cyan-400 transition-colors duration-300'
                                    href='https://www.behance.net/anvayaarsha1'
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaBehance className='w-5 h-5' />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header