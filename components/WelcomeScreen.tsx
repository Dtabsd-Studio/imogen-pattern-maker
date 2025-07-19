import React from 'react';
import { ProjectMode } from '../src/types';
import { SparklesIcon, DiamondIcon, CrestIcon, TextIcon, UploadIcon } from './icons';

interface WelcomeScreenProps {
    onStartProject: (mode: ProjectMode) => void;
}

const WelcomeCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="group flex flex-col items-center text-center p-6 bg-white/50 hover:bg-white/80 transition-all duration-300 rounded-2xl border border-white/30 shadow-lg hover:shadow-2xl shadow-black/10 hover:shadow-black/20"
    >
        <div className="flex-shrink-0 bg-white p-4 rounded-full shadow-md text-sky-500 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-800 tracking-tight">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
    </button>
);


export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartProject }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <header className="text-center mb-8 md:mb-12">
                    <div className="flex items-center justify-center gap-4">
                        <SparklesIcon className="w-12 h-12 md:w-16 md:h-16 text-sky-500" />
                        <div>
                             <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tighter">IMOGEN patrn makr</h1>
                             <p className="text-lg md:text-xl text-gray-600 mt-1">AI Pattern Studio</p>
                        </div>
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <WelcomeCard
                        icon={<DiamondIcon className="w-8 h-8"/>}
                        title="Create Pattern"
                        description="Generate a tileable element and design a seamless repeating pattern."
                        onClick={() => onStartProject('pattern')}
                    />
                    <WelcomeCard
                        icon={<TextIcon className="w-8 h-8"/>}
                        title="Create Text Design"
                        description="Type your text and create print-ready designs for POD clothing."
                        onClick={() => onStartProject('text')}
                    />
                    <WelcomeCard
                        icon={<CrestIcon className="w-8 h-8"/>}
                        title="Create Crest"
                        description="Design a classic circular crest or logo with custom text."
                        onClick={() => onStartProject('crest')}
                    />
                    <WelcomeCard
                        icon={<UploadIcon className="w-8 h-8"/>}
                        title="Work with an Image"
                        description="Upload your own image to use as a starting point for any project."
                        onClick={() => onStartProject('image')}
                    />
                </div>
            </div>
        </div>
    );
};
