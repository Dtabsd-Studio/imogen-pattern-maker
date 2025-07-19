import React, { useState, useRef, useCallback, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import { PatternCanvas } from './components/PatternCanvas';
import { CrestModal } from './components/CrestModal';
import { TextDesignModal } from './components/TextDesignModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import PatternWorkspace from './components/PatternWorkspace/PatternWorkspace';
import { generateImage as generateImageFromApi, removeBackgroundFromImage } from './services/geminiService';
import { imageService } from './services/imageGenerationService';
import html2canvas from 'html2canvas';
import { 
    ProjectMode, 
    WorkflowStep, 
    Filters, 
    ImageLayer, 
    ProceduralLayer, 
    Layer,
    Background,
    TextDesignConfig
} from './src/types';

const defaultFilters: Filters = {
    brightness: 100,
    contrast: 100,
    sepia: 0,
    hueRotate: 0,
    invert: 0,
    finish: 0,
};

const createNewImageLayer = (name: string): ImageLayer => ({
    id: `layer-${Date.now()}`,
    type: 'image',
    name,
    image: null,
    scale: 50, // More sensible default
    rotation: 0,
    opacity: 1,
    gridCountX: 5,
    gridCountY: 5,
    patternType: 'grid',
    filters: { ...defaultFilters },
    mode: 'single',
    spacing: 0,
    offset: 0,
    alternatePattern: false,
});

const createNewProceduralLayer = (name: string): ProceduralLayer => ({
    id: `layer-${Date.now()}`,
    type: 'procedural',
    name,
    opacity: 1,
    proceduralType: 'dots',
    config: {
        dotColor: '#3b82f6',
        dotSize: 10,
        dotSpacing: 40,
        stripeColor: '#3b82f6',
        stripeWidth: 10,
        stripeSpacing: 40,
        stripeAngle: 45,
        plaidColor1: '#3b82f6',
        plaidColor2: '#ef4444',
        plaidColor3: '#10b981',
        plaidWidth: 20,
        plaidSpacing: 40,
    }
});

const App: React.FC = () => {
    // --- App Mode Selection ---
    const [appMode, setAppMode] = useState<'choose' | 'simple' | 'advanced'>('choose');
    
    // --- App Flow State ---
    const [projectMode, setProjectMode] = useState<ProjectMode>('hub');
    const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('generate');

    // --- Core State ---
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
    const [isCrestModalOpen, setIsCrestModalOpen] = useState<boolean>(false);
    const [isTextModalOpen, setIsTextModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('a simple styled icon of a bicycle');
    
    // --- Layer State ---
    const [layers, setLayers] = useState<Layer[]>([]);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
    
    // --- Background & Global State ---
    const [background, setBackground] = useState<Background>({ type: 'solid', color: '#FFFFFF' });
    const [globalRotation, setGlobalRotation] = useState<number>(0);
    const [zoom, setZoom] = useState<number>(1);
    
    const canvasRef = useRef<HTMLDivElement>(null);
    const selectedLayer = layers.find(l => l.id === selectedLayerId);

    useEffect(() => {
        if (!selectedLayerId && layers.length > 0) {
            setSelectedLayerId(layers[0].id);
        }
    }, [layers, selectedLayerId]);

    const handleStartProject = (mode: ProjectMode) => {
        if (mode === 'text') {
            // For text mode, start with empty layers and open text modal
            setLayers([]);
            setSelectedLayerId(null);
            setBackground({ type: 'solid', color: '#FFFFFF' });
            setGlobalRotation(0);
            setZoom(1);
            setError(null);
            setProjectMode(mode);
            setWorkflowStep('design');
            setIsTextModalOpen(true);
        } else {
            // For other modes, create initial layer
            const firstLayer = createNewImageLayer('Layer 1');
            setLayers([firstLayer]);
            setSelectedLayerId(firstLayer.id);
            setPrompt('a simple styled icon of a bicycle');
            setBackground({ type: 'solid', color: '#FFFFFF' });
            setGlobalRotation(0);
            setZoom(1);
            setError(null);
            setProjectMode(mode);
            setWorkflowStep('generate');
        }
    };

    const handleNewProject = () => {
        setProjectMode('hub');
        setError(null);
        setLayers([]);
        setSelectedLayerId(null);
    };

    const updateLayer = (id: string, newProps: Partial<Layer>) => {
        setLayers(currentLayers =>
            currentLayers.map(l => {
                if (l.id !== id) {
                    return l;
                }

                if (l.type === 'image') {
                    return { ...l, ...(newProps as Partial<ImageLayer>) };
                } else {
                    return { ...l, ...(newProps as Partial<ProceduralLayer>) };
                }
            })
        );
    };

    const addImageLayer = () => {
        const newLayer = createNewImageLayer(`Image Layer ${layers.filter(l => l.type === 'image').length + 1}`);
        setLayers(current => [...current, newLayer]);
        setSelectedLayerId(newLayer.id);
    };
    
    const addProceduralLayer = () => {
        const newLayer = createNewProceduralLayer(`Pattern Layer ${layers.filter(l => l.type === 'procedural').length + 1}`);
        setLayers(current => [...current, newLayer]);
        setSelectedLayerId(newLayer.id);
    };

    const deleteLayer = (id: string) => {
        setLayers(current => {
            const newLayers = current.filter(l => l.id !== id);
            if (selectedLayerId === id) {
                setSelectedLayerId(newLayers[0]?.id ?? null);
            }
            return newLayers;
        });
    };

    const handleGenerateImage = useCallback(async () => {
        if (!prompt) {
            setError("Please enter a prompt.");
            return;
        }
        if (!selectedLayerId || selectedLayer?.type !== 'image') {
            setError("Please add or select an Image Layer first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            console.log(`🎨 Generating real image for: "${prompt}"`);
            // Use the new real image generation service with your API keys
            const imageUrl = await imageService.generateImage(prompt);
            console.log(`✅ Image generated successfully!`);
            
            const newMode = projectMode === 'pattern' ? 'pattern' : 'single';
            updateLayer(selectedLayerId, { image: imageUrl, mode: newMode });
            setWorkflowStep('design');
        } catch (e) {
            console.error('❌ Image generation failed:', e);
            setError(e instanceof Error ? e.message : "Image generation failed. Please try again or check your API configuration.");
        } finally {
            setIsLoading(false);
        }
    }, [prompt, selectedLayerId, selectedLayer, projectMode]);

    const handleRemoveBackground = useCallback(async () => {
        if (!selectedLayer || selectedLayer.type !== 'image' || !selectedLayer.image) {
            setError("Please select an Image Layer with an image.");
            return;
        }
        setIsProcessingImage(true);
        setError(null);
        
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Image processing timed out after 30 seconds. Please try again.")), 30000)
        );

        try {
            const newImageUrl = await Promise.race([
                removeBackgroundFromImage(selectedLayer.image),
                timeoutPromise
            ]);
            updateLayer(selectedLayer.id, { image: newImageUrl });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to remove background.");
            console.error(e);
        } finally {
            setIsProcessingImage(false);
        }
    }, [selectedLayer]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedLayerId || selectedLayer?.type !== 'image') {
            setError("Please add or select an Image Layer first.");
            return;
        }
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newMode = projectMode === 'pattern' ? 'pattern' : 'single';
                updateLayer(selectedLayerId, { image: reader.result as string, mode: newMode });
                setWorkflowStep('design');
                setError(null);
            };
            reader.onerror = () => { setError("Failed to read the uploaded file."); }
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateCrest = ({ topText, bottomText, fontFamily }: { topText: string; bottomText: string; fontFamily: string; }) => {
        if (!selectedLayer || selectedLayer.type !== 'image' || !selectedLayer.image) {
            setError("Please select an image layer with a valid image before creating a crest.");
            return;
        }
    
        const size = 512;
        const center = size / 2;
        const radius = size * 0.4;
        const imageSize = size * 0.6;
        
        const svgString = `
          <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
              <filter id="monochrome-filter-crest">
                <feColorMatrix type="saturate" values="0" result="grayscale" />
                <feComponentTransfer in="grayscale" result="hard-alpha">
                  <feFuncA type="linear" slope="10" intercept="-5" />
                </feComponentTransfer>
                <feColorMatrix in="hard-alpha" type="matrix"
                  values="0 0 0 0 0
                          0 0 0 0 0
                          0 0 0 0 0
                          0 0 0 1 0" />
              </filter>
              <path id="topCircle" d="M ${center - radius},${center} A ${radius},${radius} 0 0 1 ${center + radius},${center}" fill="none" />
              <path id="bottomCircle" d="M ${center + radius},${center} A ${radius},${radius} 0 0 0 ${center - radius},${center}" fill="none" />
            </defs>
            <g>
               <image 
                 xlink:href="${selectedLayer.image}" 
                 x="${(size - imageSize) / 2}" 
                 y="${(size - imageSize) / 2}" 
                 width="${imageSize}" 
                 height="${imageSize}" 
                 filter="url(#monochrome-filter-crest)"
               />
               <text font-family="${fontFamily}" font-size="40" fill="#000000" letter-spacing="2">
                 <textPath xlink:href="#topCircle" startOffset="50%" text-anchor="middle">${topText.toUpperCase()}</textPath>
               </text>
               <text font-family="${fontFamily}" font-size="40" fill="#000000" letter-spacing="2">
                 <textPath xlink:href="#bottomCircle" startOffset="50%" text-anchor="middle">${bottomText.toUpperCase()}</textPath>
               </text>
            </g>
          </svg>`;
          
        const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
        const newLayer = createNewImageLayer(`Crest - ${selectedLayer.name}`);
        newLayer.image = svgDataUrl;
        
        setLayers(current => [...current, newLayer]);
        setSelectedLayerId(newLayer.id);
        setIsCrestModalOpen(false);
    };

    const handleCreateTextDesign = (config: TextDesignConfig) => {
        const size = 400;
        const center = size / 2;
        
        // Create SVG text design
        let textStyles = '';
        let shapeElement = '';
        
        // Apply text styles
        switch (config.style) {
            case 'outlined':
                textStyles = `stroke="#333" stroke-width="2" fill="${config.color}"`;
                break;
            case 'shadow':
                textStyles = `fill="${config.color}" filter="drop-shadow(3px 3px 6px rgba(0,0,0,0.4))"`;
                break;
            case 'vintage':
                textStyles = `fill="${config.color}" opacity="0.8" style="filter: sepia(0.5) contrast(1.2)"`;
                break;
            case 'modern':
                textStyles = `fill="${config.color}" style="font-weight: 300; letter-spacing: 2px"`;
                break;
            default:
                textStyles = `fill="${config.color}"`;
        }
        
        // Add background shape if specified
        if (config.shape !== 'none' && config.backgroundColor !== 'transparent') {
            const padding = 20;
            switch (config.shape) {
                case 'circle':
                    shapeElement = `<circle cx="${center}" cy="${center}" r="${size/2 - padding}" fill="${config.backgroundColor}" opacity="0.9"/>`;
                    break;
                case 'rectangle':
                    shapeElement = `<rect x="${padding}" y="${padding*2}" width="${size - padding*2}" height="${size - padding*4}" fill="${config.backgroundColor}" rx="8" opacity="0.9"/>`;
                    break;
                case 'banner':
                    shapeElement = `<rect x="${padding}" y="${center - 30}" width="${size - padding*2}" height="60" fill="${config.backgroundColor}" stroke="#333" stroke-width="2" opacity="0.9"/>`;
                    break;
            }
        }
        
        // Generate circular text path if needed
        let textElement = '';
        if (config.isCircular) {
            const radius = config.circularRadius;
            const startAngle = config.circularStartAngle;
            const direction = config.circularDirection;
            
            // Create circular path
            const pathId = `circularPath-${Date.now()}`;
            let pathD = '';
            
            if (direction === 'clockwise') {
                pathD = `M ${center - radius},${center} A ${radius},${radius} 0 1 1 ${center + radius},${center}`;
            } else {
                pathD = `M ${center + radius},${center} A ${radius},${radius} 0 1 0 ${center - radius},${center}`;
            }
            
            const pathElement = `<path id="${pathId}" d="${pathD}" fill="none" />`;
            
            textElement = `
                <defs>
                    ${pathElement}
                </defs>
                <text 
                    font-family="${config.fontFamily}" 
                    font-size="${config.fontSize}px" 
                    ${textStyles}
                    text-anchor="middle"
                >
                    <textPath href="#${pathId}" startOffset="50%">
                        ${config.text}
                    </textPath>
                </text>
            `;
        } else {
            textElement = `
                <text 
                    x="${center}" 
                    y="${center + config.fontSize/3}" 
                    text-anchor="middle" 
                    font-family="${config.fontFamily}" 
                    font-size="${config.fontSize}px" 
                    ${textStyles}
                >
                    ${config.text}
                </text>
            `;
        }
        
        const svgString = `
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="transparent"/>
                ${shapeElement}
                ${textElement}
            </svg>`;
            
        const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
        
        // Create new layer with the text design
        const newLayer = createNewImageLayer(`Text - ${config.text.substring(0, 15)}${config.text.length > 15 ? '...' : ''}`);
        newLayer.image = svgDataUrl;
        newLayer.mode = 'single';
        
        setLayers(current => [...current, newLayer]);
        setSelectedLayerId(newLayer.id);
        setIsTextModalOpen(false);
        setWorkflowStep('design');
    };

    const handleDownload = () => {
        if (canvasRef.current) {
            let bgColor: string | undefined;
            switch(background.type){
                case 'solid': bgColor = background.color; break;
                case 'transparent': bgColor = undefined; break; 
                case 'gradient': bgColor = undefined; break;
            }

            html2canvas(canvasRef.current, { 
                useCORS: true, 
                background: bgColor,
                logging: false,
                allowTaint: true,
            }).then((canvas: HTMLCanvasElement) => {
                const link = document.createElement('a');
                link.download = 'imogen-pattern.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch((err: any) => {
                setError("Failed to capture pattern. Please try again.");
                console.error("html2canvas error:", err);
            });
        } else {
             setError("No canvas found to capture. Please ensure the pattern is loaded.");
        }
    };

    // Mode selection screen
    if (appMode === 'choose') {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-gray-800 mb-6">IMOGEN Pattern Maker</h1>
                    <p className="text-xl text-gray-600 mb-12">Choose your experience</p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Simple Pattern Maker */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl">
                            <h2 className="text-2xl font-bold text-green-700 mb-4">Simple Pattern Maker</h2>
                            <p className="text-gray-600 mb-6">Clean, focused pattern creation for print-on-demand. Just upload and design patterns - no AI generation or background removal to interfere.</p>
                            <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
                                <li>✓ Upload your own images</li>
                                <li>✓ Grid, diamond, checkerboard layouts</li>
                                <li>✓ Separate image and background controls</li>
                                <li>✓ Clean background layering</li>
                                <li>✓ Perfect for POD items</li>
                            </ul>
                            <button 
                                onClick={() => setAppMode('simple')}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            >
                                Use Simple Pattern Maker
                            </button>
                        </div>

                        {/* Advanced App */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl">
                            <h2 className="text-2xl font-bold text-blue-700 mb-4">Advanced Creator</h2>
                            <p className="text-gray-600 mb-6">Full-featured app with AI image generation, background removal, crest creation, and text design tools.</p>
                            <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
                                <li>✓ AI image generation</li>
                                <li>✓ Background removal</li>
                                <li>✓ Crest creator</li>
                                <li>✓ Text design tools</li>
                                <li>✓ Advanced effects</li>
                            </ul>
                            <button 
                                onClick={() => setAppMode('advanced')}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            >
                                Use Advanced Creator
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-sm text-gray-500">
                        You can switch between modes anytime
                    </div>
                </div>
            </div>
        );
    }

    // Simple Pattern Maker
    if (appMode === 'simple') {
        return (
            <div className="relative">
                <button 
                    onClick={() => setAppMode('choose')}
                    className="absolute top-4 left-4 z-10 bg-white/80 hover:bg-white text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    ← Back to Mode Selection
                </button>
                <PatternWorkspace />
            </div>
        );
    }

    // Advanced Creator (original app)
    return (
        <div className="relative min-h-screen w-full font-sans text-gray-800 bg-gradient-to-br from-sky-100 via-rose-100 to-amber-100">
            <button 
                onClick={() => setAppMode('choose')}
                className="absolute top-4 left-4 z-10 bg-white/80 hover:bg-white text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
                ← Back to Mode Selection
            </button>
            {projectMode === 'hub' ? (
                <WelcomeScreen onStartProject={handleStartProject} />
            ) : (
                <div className="relative flex flex-col md:flex-row min-h-screen p-4 md:p-6 gap-6">
                    <ControlPanel
                        projectMode={projectMode}
                        workflowStep={workflowStep}
                        prompt={prompt}
                        setPrompt={setPrompt}
                        isLoading={isLoading}
                        isProcessingImage={isProcessingImage}
                        handleGenerateImage={handleGenerateImage}
                        handleRemoveBackground={handleRemoveBackground}
                        handleImageUpload={handleImageUpload}
                        handleDownload={handleDownload}
                        handleNewProject={handleNewProject}
                        onOpenCrestModal={() => setIsCrestModalOpen(true)}
                        onOpenTextModal={() => setIsTextModalOpen(true)}
                        
                        layers={layers}
                        selectedLayer={selectedLayer}
                        addImageLayer={addImageLayer}
                        addProceduralLayer={addProceduralLayer}
                        deleteLayer={deleteLayer}
                        selectLayer={setSelectedLayerId}
                        updateLayer={updateLayer}

                        globalRotation={globalRotation}
                        setGlobalRotation={setGlobalRotation}
                        zoom={zoom}
                        setZoom={setZoom}
                        
                        background={background}
                        setBackground={setBackground}
                        
                        error={error}
                    />
                    <main className="flex-1 flex items-center justify-center">
                        <PatternCanvas
                            ref={canvasRef}
                            layers={layers}
                            background={background}
                            globalRotation={globalRotation}
                            zoom={zoom}
                        />
                    </main>
                </div>
            )}
            {isCrestModalOpen && selectedLayer?.type === 'image' && (
                <CrestModal
                    isOpen={isCrestModalOpen}
                    onClose={() => setIsCrestModalOpen(false)}
                    onGenerate={handleGenerateCrest}
                />
            )}
            {isTextModalOpen && (
                <TextDesignModal
                    isOpen={isTextModalOpen}
                    onClose={() => setIsTextModalOpen(false)}
                    onGenerate={handleCreateTextDesign}
                />
            )}
        </div>
    );
};

export default App;