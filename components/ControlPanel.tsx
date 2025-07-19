import React, {useState, useRef} from 'react';
import { 
    ProjectMode, 
    WorkflowStep, 
    Background, 
    Layer, 
    ImageLayer
} from '../src/types';
import { UploadIcon, DownloadIcon, SparklesIcon, LoaderIcon, DiamondIcon, GridIcon, CheckerboardIcon, MagicWandIcon, RefreshIcon, CrestIcon, LinkIcon, UnlinkIcon, StripeIcon, PolkaDotsIcon, PlaidIcon, FloralIcon, FractalIcon, MondrianIcon } from './icons';

// --- Prop Types ---
interface ControlPanelProps {
    projectMode: ProjectMode;
    workflowStep: WorkflowStep;
    prompt: string;
    setPrompt: (value: string) => void;
    isLoading: boolean;
    isProcessingImage: boolean;
    handleGenerateImage: () => void;
    handleRemoveBackground: () => void;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDownload: () => void;
    handleNewProject: () => void;
    onOpenCrestModal: () => void;
    onOpenTextModal?: () => void;

    layers: Layer[];
    selectedLayer: Layer | undefined;
    addImageLayer: () => void;
    addProceduralLayer: () => void;
    deleteLayer: (id: string) => void;
    selectLayer: (id: string) => void;
    updateLayer: (id: string, props: Partial<Layer>) => void;
    
    globalRotation: number;
    setGlobalRotation: (value: number) => void;
    zoom: number;
    setZoom: (value: number) => void;
    
    background: Background;
    setBackground: (bg: Background) => void;

    error: string | null;
}

const Slider: React.FC<{
    label: string; value: number; min: number; max: number; step?: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; unit?: string; disabled?: boolean;
}> = ({ label, value, min, max, step = 1, onChange, unit = '', disabled = false }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center text-sm font-medium text-gray-700">
            <label htmlFor={label} className={disabled ? 'text-gray-400' : ''}>{label}</label>
            <span className={disabled ? 'text-gray-400' : 'text-gray-800'}>{value}{unit}</span>
        </div>
        <input id={label} type="range" min={min} max={max} step={step} value={value} onChange={onChange} disabled={disabled}
            className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full"
        />
    </div>
);

const ColorInput: React.FC<{ label: string; value: string; onChange: (value: string) => void; disabled?: boolean; }> = ({ label, value, onChange, disabled }) => (
     <div className="flex items-center gap-2 bg-white/50 border border-gray-900/10 rounded-md p-1.5">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 p-0 border-none bg-transparent appearance-none cursor-pointer rounded-md" disabled={disabled} />
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="bg-transparent w-full focus:outline-none text-gray-800 placeholder:text-gray-500" placeholder={label} disabled={disabled} />
    </div>
);

const Section: React.FC<{ title: string, children: React.ReactNode, disabled?: boolean, step?: number, stepTitle?: string }> = ({ title, children, disabled=false, step, stepTitle }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className={`border border-black/10 rounded-lg transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left font-semibold text-gray-700 p-3 flex justify-between items-center bg-black/5 hover:bg-black/10 rounded-t-lg">
                <div className="flex items-center gap-2">
                    {step && <div className="bg-sky-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">{step}</div>}
                    <span>{title}</span>
                </div>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && <div className="p-3 space-y-4">{children}</div>}
        </div>
    );
};

// --- Sub-components for different workflows ---

const GenerationControls: React.FC<Pick<ControlPanelProps, 'prompt' | 'setPrompt' | 'isLoading' | 'handleGenerateImage' | 'handleImageUpload'>> = 
({ prompt, setPrompt, isLoading, handleGenerateImage, handleImageUpload }) => {
    const uploadInputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="space-y-3">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., watercolor lemon slice" className="w-full bg-white/50 border border-gray-900/10 rounded-md p-2 h-20 resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors text-gray-800 placeholder:text-gray-500" />
            <div className="grid grid-cols-2 gap-2">
                 <button onClick={handleGenerateImage} disabled={isLoading} className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/30 disabled:text-white disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2">
                    {isLoading ? <LoaderIcon className="animate-spin" /> : <SparklesIcon />}
                    <span>{isLoading ? '...' : 'Generate'}</span>
                </button>
                 <button onClick={() => uploadInputRef.current?.click()} disabled={isLoading} className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center gap-2">
                    <UploadIcon /><span>Upload</span>
                </button>
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={uploadInputRef} />
        </div>
    );
};

const PatternDesignControls: React.FC<{layer: ImageLayer, updateLayer: (props: Partial<ImageLayer>) => void}> = ({ layer, updateLayer }) => {
    const [isDensityLinked, setIsDensityLinked] = useState(true);

    const handleDensityChange = (axis: 'x' | 'y', value: number) => {
        if (isDensityLinked) {
            updateLayer({ gridCountX: value, gridCountY: value });
        } else {
            if (axis === 'x') updateLayer({ gridCountX: value });
            else updateLayer({ gridCountY: value });
        }
    };

    const patternTypes = [
        { type: 'grid', icon: <GridIcon/>, label: 'Grid' },
        { type: 'checkerboard', icon: <CheckerboardIcon/>, label: 'Checkerboard' },
        { type: 'diamond', icon: <DiamondIcon/>, label: 'Diamond' },
        { type: 'floral', icon: <FloralIcon/>, label: 'Floral' },
        { type: 'stripes', icon: <StripeIcon/>, label: 'Stripes' },
        { type: 'polka-dots', icon: <PolkaDotsIcon/>, label: 'Polka Dots' },
        { type: 'plaid', icon: <PlaidIcon/>, label: 'Plaid' },
        { type: 'fractal', icon: <FractalIcon/>, label: 'Fractal' },
        { type: 'mondrian', icon: <MondrianIcon/>, label: 'Mondrian' }
    ];

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Display Mode</label>
                <div className="flex gap-2">
                    <button 
                        onClick={() => updateLayer({ mode: 'single' })}
                        className={`flex-1 p-2 rounded-md text-sm transition-colors ${layer.mode === 'single' ? 'bg-sky-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        Single Image
                    </button>
                    <button 
                        onClick={() => updateLayer({ mode: 'pattern' })}
                        className={`flex-1 p-2 rounded-md text-sm transition-colors ${layer.mode === 'pattern' ? 'bg-sky-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        Pattern Tiles
                    </button>
                </div>
            </div>
            
            {layer.mode === 'pattern' && (
                <>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Pattern Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {patternTypes.map(({ type, icon, label }) => (
                                <button key={type} onClick={() => updateLayer({ patternType: type as any })}
                                    className={`p-2 rounded-md text-xs transition-colors flex flex-col items-center gap-1 ${layer.patternType === type ? 'bg-sky-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                                    <span className="w-4 h-4">{icon}</span>
                                    <span className="leading-tight">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                        <Slider label="Horiz. Density" value={layer.gridCountX} onChange={(e) => handleDensityChange('x', Number(e.target.value))} min={1} max={20} />
                        <button onClick={() => setIsDensityLinked(!isDensityLinked)} className="p-2 mt-5 rounded-full hover:bg-black/10">
                            {isDensityLinked ? <LinkIcon className="w-4 h-4 text-sky-500" /> : <UnlinkIcon className="w-4 h-4 text-gray-500" />}
                        </button>
                        <Slider label="Vert. Density" value={layer.gridCountY} onChange={(e) => handleDensityChange('y', Number(e.target.value))} min={1} max={20} />
                    </div>
                </>
            )}
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Element Controls</label>
                <Slider label="Element Scale" value={layer.scale} onChange={(e) => updateLayer({ scale: Number(e.target.value)})} min={5} max={300} unit="%" />
                <Slider label="Element Rotation" value={layer.rotation} onChange={(e) => updateLayer({ rotation: Number(e.target.value)})} min={0} max={360} unit="°" />
            </div>
            
            {layer.mode === 'pattern' && (
                <>
                    {/* Advanced Pattern Controls */}
                    <div className="space-y-3 pt-2 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700">Advanced Pattern Controls</h4>
                        <Slider label="Pattern Spacing" value={layer.spacing} onChange={(e) => updateLayer({ spacing: Number(e.target.value)})} min={0} max={100} unit="px" />
                        <Slider label="Pattern Offset" value={layer.offset} onChange={(e) => updateLayer({ offset: Number(e.target.value)})} min={0} max={100} unit="px" />
                        <Slider label="Pattern Opacity" value={Math.round(layer.opacity * 100)} onChange={(e) => updateLayer({ opacity: Number(e.target.value) / 100})} min={10} max={100} unit="%" />
                        
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="alternatePattern"
                                checked={layer.alternatePattern}
                                onChange={(e) => updateLayer({ alternatePattern: e.target.checked })}
                                className="w-4 h-4 text-sky-500 rounded focus:ring-sky-500"
                            />
                            <label htmlFor="alternatePattern" className="text-sm font-medium text-gray-700">
                                Alternate Pattern
                            </label>
                        </div>
                        
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h5 className="text-xs font-medium text-blue-800 mb-2">🔧 Pro Tip for Background-Removed Images</h5>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                When using background-removed images, try switching to <strong>Pattern Mode</strong> first, then adjust density/scale for seamless tiling. 
                                Global rotation works best with <strong>Single Mode</strong> for clean effects.
                            </p>
                        </div>
                        
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <h5 className="text-xs font-medium text-green-800 mb-2">✨ Auto Background Removal</h5>
                            <p className="text-xs text-green-700 leading-relaxed mb-2">
                                White/light backgrounds are automatically removed from images to make them blend with your chosen background.
                            </p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="autoBgRemoval"
                                    defaultChecked={true}
                                    className="w-3 h-3 text-green-500 rounded"
                                />
                                <label htmlFor="autoBgRemoval" className="text-xs text-green-700">
                                    Enable auto background removal
                                </label>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
};


// --- The Main Control Panel ---

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const {
        projectMode,
        workflowStep,
        prompt,
        setPrompt,
        isLoading,
        isProcessingImage,
        handleGenerateImage,
        handleRemoveBackground,
        handleImageUpload,
        handleDownload,
        handleNewProject,
        onOpenCrestModal,
        layers,
        selectedLayer,
        updateLayer,
        globalRotation,
        setGlobalRotation,
        zoom,
        setZoom,
        background,
        setBackground,
        error,
        addImageLayer
    } = props;
    const hasSelection = !!selectedLayer;
    const isImageLayerSelected = hasSelection && selectedLayer.type === 'image';
    const isSelectedImageSvg = isImageLayerSelected && selectedLayer.image?.startsWith('data:image/svg+xml');

    
    const handleLayerUpdate = (propsToUpdate: Partial<Layer>) => {
        if (selectedLayer) {
            updateLayer(selectedLayer.id, propsToUpdate);
        }
    }

    const renderProjectControls = () => {
        if (projectMode === 'pattern') {
            return (
                <>
                    <Section title="Generate Element" step={1} disabled={workflowStep === 'design'}>
                        <GenerationControls {...props} />
                        {!isImageLayerSelected && (
                            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-sm text-amber-800">
                                    💡 <strong>Add an Image Layer</strong> to start generating images with text prompts
                                </p>
                                <button 
                                    onClick={() => { addImageLayer(); }}
                                    className="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                                >
                                    Add Image Layer
                                </button>
                            </div>
                        )}
                        {isImageLayerSelected && selectedLayer.image && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <button 
                                    onClick={handleRemoveBackground} 
                                    disabled={isProcessingImage || isSelectedImageSvg} 
                                    title={isSelectedImageSvg ? "This action is not available for SVG images (e.g., Crests)." : undefined}
                                    className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/30 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2">
                                    {isProcessingImage ? <LoaderIcon className="animate-spin" /> : <MagicWandIcon />}
                                    <span>{isProcessingImage ? 'Processing...' : 'Remove Background'}</span>
                                </button>
                            </div>
                        )}
                    </Section>
                    <Section title="Design Pattern" step={2} disabled={workflowStep === 'generate'}>
                        {isImageLayerSelected ? (
                            <PatternDesignControls layer={selectedLayer} updateLayer={handleLayerUpdate as any}/>
                        ) : (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-sm text-gray-600">Select an image layer to design patterns</p>
                            </div>
                        )}
                    </Section>
                </>
            );
        }
        if (projectMode === 'crest') {
            const crestActionDisabledTooltip = isSelectedImageSvg ? "This action is not available for SVG images (e.g., Crests)." : undefined;
            return (
                <>
                    <Section title="Generate Icon" step={1} disabled={workflowStep === 'design'}>
                        <GenerationControls {...props} />
                        {!isImageLayerSelected && (
                            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-sm text-amber-800">
                                    💡 <strong>Add an Image Layer</strong> to start generating images with text prompts
                                </p>
                                <button 
                                    onClick={() => { addImageLayer(); }}
                                    className="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                                >
                                    Add Image Layer
                                </button>
                            </div>
                        )}
                    </Section>
                    <Section title="Create Crest" step={2} disabled={workflowStep === 'generate'}>
                        {isImageLayerSelected ? (
                            <div className="space-y-2">
                                <button 
                                    onClick={onOpenCrestModal} 
                                    disabled={!selectedLayer.image || isSelectedImageSvg} 
                                    title={crestActionDisabledTooltip}
                                    className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/30 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2">
                                    <CrestIcon />
                                    <span>Create Crest from Image</span>
                                </button>
                                <button 
                                    onClick={handleRemoveBackground} 
                                    disabled={isProcessingImage || !selectedLayer.image || isSelectedImageSvg} 
                                    title={crestActionDisabledTooltip}
                                    className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/30 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2">
                                    {isProcessingImage ? <LoaderIcon className="animate-spin" /> : <MagicWandIcon />}
                                    <span>{isProcessingImage ? '...' : 'Refine BG'}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-sm text-gray-600">Generate an image first to create a crest</p>
                            </div>
                        )}
                    </Section>
                </>
            )
        }
        if (projectMode === 'image') {
            const imageActionDisabledTooltip = isSelectedImageSvg ? "This action is not available for SVG images (e.g., Crests)." : undefined;
            return (
                <>
                    <Section title="Generate or Upload Image" step={1}>
                        <GenerationControls {...props} />
                        {!isImageLayerSelected && (
                            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-sm text-amber-800">
                                    💡 <strong>Add an Image Layer</strong> to start generating images with text prompts
                                </p>
                                <button 
                                    onClick={() => { addImageLayer(); }}
                                    className="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                                >
                                    Add Image Layer
                                </button>
                            </div>
                        )}
                    </Section>
                    <Section title="Transform &amp; Actions" step={2} disabled={!isImageLayerSelected || !selectedLayer.image}>
                        {isImageLayerSelected ? (
                            <>
                                <Slider label="Image Scale" value={selectedLayer.scale} onChange={(e) => handleLayerUpdate({ scale: Number(e.target.value)})} min={5} max={300} unit="%" />
                                <Slider label="Image Rotation" value={selectedLayer.rotation} onChange={(e) => handleLayerUpdate({ rotation: Number(e.target.value)})} min={0} max={360} unit="°" />
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    <button 
                                        onClick={handleRemoveBackground} 
                                        disabled={isProcessingImage || !selectedLayer.image || isSelectedImageSvg}
                                        title={imageActionDisabledTooltip}
                                        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/30 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2">
                                        {isProcessingImage ? <LoaderIcon className="animate-spin" /> : <MagicWandIcon />}
                                        <span>{isProcessingImage ? '...' : 'Remove BG'}</span>
                                    </button>
                                    <button 
                                        onClick={onOpenCrestModal} 
                                        disabled={!selectedLayer.image || isSelectedImageSvg}
                                        title={imageActionDisabledTooltip}
                                        className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/30 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2">
                                        <CrestIcon />
                                        <span>Create Crest</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-sm text-gray-600">Select an image layer to transform and edit</p>
                            </div>
                        )}
                    </Section>
                </>
            )
        }
        if (projectMode === 'text') {
            return (
                <>
                    <Section title="Create Text Design" step={1}>
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                                <h3 className="font-semibold text-green-800 mb-2">✨ Text Creator</h3>
                                <p className="text-sm text-green-700 mb-3">
                                    Design custom text graphics with fonts, effects, and circular text options.
                                </p>
                                <button 
                                    onClick={props.onOpenTextModal}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                                >
                                    <SparklesIcon />
                                    <span>Open Text Designer</span>
                                </button>
                            </div>
                            
                            {layers.length > 0 && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        ✅ <strong>Text Design Created!</strong> Use the canvas controls below to adjust size, rotation, and export options.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Section>
                    
                    {layers.length > 0 && (
                        <Section title="Canvas Adjustments" step={2}>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600">Fine-tune your text design for export:</p>
                                
                                {isImageLayerSelected && (
                                    <>
                                        <Slider label="Text Scale" value={selectedLayer.scale} onChange={(e) => handleLayerUpdate({ scale: Number(e.target.value)})} min={5} max={300} unit="%" />
                                        <Slider label="Text Rotation" value={selectedLayer.rotation} onChange={(e) => handleLayerUpdate({ rotation: Number(e.target.value)})} min={0} max={360} unit="°" />
                                        <Slider label="Text Opacity" value={Math.round(selectedLayer.opacity * 100)} onChange={(e) => handleLayerUpdate({ opacity: Number(e.target.value) / 100})} min={10} max={100} unit="%" />
                                    </>
                                )}
                                
                                <div className="pt-2 border-t border-gray-200">
                                    <button 
                                        onClick={props.onOpenTextModal}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                                    >
                                        <SparklesIcon />
                                        <span>Create New Text Design</span>
                                    </button>
                                </div>
                            </div>
                        </Section>
                    )}
                </>
            )
        }
        return null;
    }


    return (
        <aside className="w-full md:w-[380px] p-4 bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl flex flex-col space-y-4 overflow-y-auto h-[calc(100vh-2rem)] shadow-2xl shadow-black/20">
            <div className="flex-grow space-y-4 overflow-y-auto pr-1">
                <header className="flex items-center justify-between gap-3">
                     <div className="flex items-center gap-3">
                        <SparklesIcon className="w-8 h-8 text-sky-500" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 tracking-tighter">IMOGEN patrn makr</h1>
                            <p className="text-sm text-gray-600 capitalize">{projectMode} Mode</p>
                        </div>
                    </div>
                    <button onClick={handleNewProject} title="New Project" className="flex-shrink-0 p-2 rounded-full hover:bg-black/10 transition-colors">
                        <RefreshIcon className="w-5 h-5 text-gray-600"/>
                    </button>
                </header>

                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-700 text-sm rounded-lg p-3">{error}</div>}

                {/* Show quick start section if no layers exist */}
                {projectMode !== 'hub' && layers.length === 0 && (
                    <Section title="🚀 Quick Start - Generate Your First Image">
                        <div className="space-y-3">
                            <div className="p-4 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-lg">
                                <h3 className="font-semibold text-sky-800 mb-2">Ready to create with AI!</h3>
                                <p className="text-sm text-sky-700 mb-3">
                                    Type what you want to generate and we'll create it using your real API keys.
                                </p>
                                <textarea 
                                    value={prompt} 
                                    onChange={(e) => setPrompt(e.target.value)} 
                                    placeholder="e.g., watercolor lemon slice, vintage bicycle, beautiful flower..." 
                                    className="w-full bg-white/80 border border-sky-300 rounded-md p-3 h-20 resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors text-gray-800 placeholder:text-gray-500 mb-3" 
                                />
                                <button 
                                    onClick={() => { 
                                        addImageLayer(); 
                                        // Small delay to ensure layer is created before generating
                                        setTimeout(() => handleGenerateImage(), 100);
                                    }}
                                    disabled={isLoading || !prompt.trim()}
                                    className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/30 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <LoaderIcon className="animate-spin" /> : <SparklesIcon />}
                                    <span>{isLoading ? 'Generating...' : 'Generate Image with AI'}</span>
                                </button>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-2">Or</p>
                                <button 
                                    onClick={() => { addImageLayer(); }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 mx-auto"
                                >
                                    <UploadIcon />
                                    <span>Upload Your Own Image</span>
                                </button>
                            </div>
                        </div>
                    </Section>
                )}

                {renderProjectControls()}

                {isImageLayerSelected && (
                    <Section title="Effects" disabled={!selectedLayer.image}>
                        <Slider label="Brightness" value={selectedLayer.filters.brightness} onChange={(e) => handleLayerUpdate({ filters: { ...selectedLayer.filters, brightness: Number(e.target.value) } })} min={0} max={200} unit="%" />
                        <Slider label="Contrast" value={selectedLayer.filters.contrast} onChange={(e) => handleLayerUpdate({ filters: { ...selectedLayer.filters, contrast: Number(e.target.value) } })} min={0} max={200} unit="%" />
                        <Slider label="Sepia" value={selectedLayer.filters.sepia} onChange={(e) => handleLayerUpdate({ filters: { ...selectedLayer.filters, sepia: Number(e.target.value) } })} min={0} max={100} unit="%" />
                        <Slider label="Hue" value={selectedLayer.filters.hueRotate} onChange={(e) => handleLayerUpdate({ filters: { ...selectedLayer.filters, hueRotate: Number(e.target.value) } })} min={0} max={360} unit="°" />
                        <Slider label="Invert" value={selectedLayer.filters.invert} onChange={(e) => handleLayerUpdate({ filters: { ...selectedLayer.filters, invert: Number(e.target.value) } })} min={0} max={100} unit="%" />
                        <Slider label="Finish" value={selectedLayer.filters.finish} onChange={(e) => handleLayerUpdate({ filters: { ...selectedLayer.filters, finish: Number(e.target.value) } })} min={-100} max={100} unit=" (Matte/Glossy)" />
                    </Section>
                )}
                
                <Section title="Canvas &amp; Export">
                    <Slider label="Global Zoom" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} min={0.2} max={5} step={0.05} unit="x" />
                    <Slider label="Global Rotation" value={globalRotation} onChange={(e) => setGlobalRotation(Number(e.target.value))} min={0} max={360} unit="°" />
                     <div className="space-y-2 pt-2">
                         <label className="text-sm font-medium text-gray-700">Background Type</label>
                         <div className="flex gap-2">
                            <button onClick={() => setBackground({type: 'solid', color: '#FFFFFF'})} className={`flex-1 p-2 rounded-md text-sm transition-colors ${background.type === 'solid' ? 'bg-sky-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Solid</button>
                            <button onClick={() => setBackground({type: 'gradient', angle: 90, startColor: '#7dd3fc', endColor: '#f9a8d4'})} className={`flex-1 p-2 rounded-md text-sm transition-colors ${background.type === 'gradient' ? 'bg-sky-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Gradient</button>
                            <button onClick={() => setBackground({type: 'transparent'})} className={`flex-1 p-2 rounded-md text-sm transition-colors ${background.type === 'transparent' ? 'bg-sky-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Transparent</button>
                         </div>
                         {background.type === 'solid' && (
                            <ColorInput label="Background Color" value={background.color} onChange={v => setBackground({type: 'solid', color: v})} />
                         )}
                         {background.type === 'gradient' && (
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <ColorInput label="Start Color" value={background.startColor} onChange={v => setBackground({...background, startColor: v})} />
                                    <ColorInput label="End Color" value={background.endColor} onChange={v => setBackground({...background, endColor: v})} />
                                </div>
                                <Slider label="Gradient Angle" value={background.angle} onChange={e => setBackground({...background, angle: Number(e.target.value)})} min={0} max={360} unit="°" />
                            </div>
                         )}
                    </div>
                </Section>
            </div>

            <footer className="flex-shrink-0 pt-2">
                <button onClick={handleDownload} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 text-lg">
                    <DownloadIcon /><span>Download</span>
                </button>
            </footer>
        </aside>
    );
};

export default ControlPanel;
