import React, { useState } from 'react';

interface CrestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (details: { topText: string; bottomText: string; fontFamily: string }) => void;
}

const fonts = [
    { name: 'Impact', value: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' },
    { name: 'Arial Black', value: '"Arial Black", Gadget, sans-serif' },
    { name: 'Helvetica Bold', value: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Courier New', value: '"Courier New", Courier, monospace' },
    { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
];

export const CrestModal: React.FC<CrestModalProps> = ({ isOpen, onClose, onGenerate }) => {
    const [topText, setTopText] = useState('IMOGEN PATRN MAKR');
    const [bottomText, setBottomText] = useState('EST. 2024');
    const [fontFamily, setFontFamily] = useState(fonts[0].value);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate({ topText, bottomText, fontFamily });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl shadow-black/20 w-full max-w-md p-6 m-4" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tighter">Create Crest Logo</h2>
                    <p className="text-sm text-gray-600">Enter text to wrap around your selected image. The result will be a new monochrome layer.</p>
                    
                    <div>
                        <label htmlFor="topText" className="block text-sm font-medium text-gray-700 mb-1">Top Text</label>
                        <input
                            type="text"
                            id="topText"
                            value={topText}
                            onChange={e => setTopText(e.target.value)}
                            className="w-full bg-white/50 border border-gray-900/10 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="bottomText" className="block text-sm font-medium text-gray-700 mb-1">Bottom Text</label>
                        <input
                            type="text"
                            id="bottomText"
                            value={bottomText}
                            onChange={e => setBottomText(e.target.value)}
                            className="w-full bg-white/50 border border-gray-900/10 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-1">Font Style</label>
                        <select
                            id="fontFamily"
                            value={fontFamily}
                            onChange={e => setFontFamily(e.target.value)}
                            className="w-full bg-white/50 border border-gray-900/10 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        >
                            {fonts.map(font => (
                                <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                                    {font.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                            Generate Crest
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
