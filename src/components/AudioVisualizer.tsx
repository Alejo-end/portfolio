import { createDevice, Device, Parameter } from '@rnbo/js';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import p5 from 'p5';
import { createRoot, Root } from 'react-dom/client';
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from 'lucide-react';

type AudioVisualizerProps = {
    children?: React.ReactNode;
};

const AudioVisualizer = ({ children }: AudioVisualizerProps) => {
    const sketchRef = useRef<HTMLDivElement>(null);
    const childrenContainerRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const deviceRef = useRef<Device | null>(null);
    const xParamRef = useRef<Parameter | null>(null);
    const yParamRef = useRef<Parameter | null>(null);
    const gainParamRef = useRef<Parameter | null>(null);
    const reactRootRef = useRef<Root | null>(null);
    const p5InstanceRef = useRef<p5 | null>(null);

    const [isMuted, setIsMuted] = useState(true);
    const [gainValue, setGainValue] = useState();

    const createSketch = useCallback((p: p5) => {
        // Use useCallback to memoize loadRNBO and wrap it inside the sketch creation
        const loadRNBO = async (audioContext: AudioContext) => {
            await audioContext.resume();

            const rawPatcher = await fetch('/patches/patch.export.json');
            const patcher = await rawPatcher.json();

            const device = await createDevice({ context: audioContext, patcher });
            deviceRef.current = device;

            // Connect device directly to audio context destination
            device.node.connect(audioContext.destination);

            // Get references to RNBO parameters
            xParamRef.current = device.parametersById.get('x');
            yParamRef.current = device.parametersById.get('y');

            // Get reference to gain parameter from the Max patcher
            const gainParam = device.parametersById.get('gain');
            gainParamRef.current = gainParam;

            // Set initial gain value if parameter exists
            if (gainParam) {
                // Set initial value from the RNBO parameter or use default
                setGainValue(gainParam.normalizedValue);
            }
        };

        let xValue = 0;
        let yValue = 0;
        let childrenContainer: HTMLDivElement;

        p.setup = () => {
            const canvas = p.createCanvas(920, 920);
            canvas.parent(sketchRef.current!);

            p.noCursor();
            p.colorMode(p.HSB, 360, 100, 100);
            p.rectMode(p.CENTER);
            p.noStroke();
            // Create container for React children
            childrenContainer = document.createElement('div');
            childrenContainer.style.position = 'absolute';
            childrenContainer.style.top = '0';
            childrenContainer.style.left = '0';
            childrenContainer.style.width = '50%';
            childrenContainer.style.height = '50%';
            sketchRef.current?.appendChild(childrenContainer);
            childrenContainer.style.left = '0';
            childrenContainer.style.width = '50%';
            childrenContainer.style.height = '50%';
            childrenContainer.style.pointerEvents = 'none';

            if (childrenContainerRef.current && children) {
                if (!reactRootRef.current) {
                    reactRootRef.current = createRoot(childrenContainer);
                }
                reactRootRef.current.render(children);
            }
            // Initialize Audio Context
            audioContextRef.current = new (window.AudioContext || (window as Window).webkitAudioContext)();
            loadRNBO(audioContextRef.current);

            // Resume the AudioContext on mouse click
            p.mousePressed = startAudioContext;
        };

        p.draw = () => {
            p.background(p.mouseY / 2, 100, 100);
            p.fill(360 - p.mouseY / 2, 100, 100);
            p.circle(460, 460, p.mouseX + 1);

            

            // Position the children container to follow rectangle
            if (childrenContainer) {
                childrenContainer.style.transform = `translate(${200 - (p.mouseX + 1) / 2}px, ${200 - (p.mouseX + 1) / 2}px)`;
            }

            yValue = p.map(p.mouseY, 0, p.height, 0, 1);
            xValue = p.map(p.mouseX, 0, p.width, 0, 1);

            // Send normalized values to the RNBO patch parameters
            if (yParamRef.current) {
                yParamRef.current.normalizedValue = yValue;
            }
            if (xParamRef.current) {
                xParamRef.current.normalizedValue = xValue;
            }
        };

        return p;
    }, [children]);

    const startAudioContext = () => {
        const audioContext = audioContextRef.current;
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    };

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        if (gainParamRef.current) {
            // Set gain to 0 when muted, otherwise restore previous value
            gainParamRef.current.normalizedValue = newMutedState ? 0 : gainValue;
        }
    };

    useEffect(() => {
        // Initialize p5.js instance
        p5InstanceRef.current = new p5(createSketch, sketchRef.current!);

        // Cleanup on unmount
        return () => {
            // Safely unmount React root
            if (reactRootRef.current) {
                reactRootRef.current.unmount();
                reactRootRef.current = null;
            }

            // Remove p5 instance
            if (p5InstanceRef.current) {
                p5InstanceRef.current.remove();
                p5InstanceRef.current = null;
            }

            // Close audio context
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [createSketch]);

    // Add children dependency to re-render when children change
    useEffect(() => {
        if (reactRootRef.current && children) {
            reactRootRef.current.render(children);
        }
    }, [children]);

    return (
        <div className="relative md:w-[920px] md:h-[920px]">
            <div ref={sketchRef} className="absolute top-0 left-0" />
            <div
                ref={childrenContainerRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 bg-black/50 p-2 rounded-md w-12">
                <Button onClick={toggleMute} variant="ghost" size="icon" aria-label={isMuted ? "Unmute" : "Mute"}>
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </Button>
            </div>
        </div>
    );
};

export default AudioVisualizer;