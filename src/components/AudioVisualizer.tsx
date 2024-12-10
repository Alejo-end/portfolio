/* // disable-eslint
import { createDevice, Device, Parameter } from '@rnbo/js';
import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { createRoot, Root } from 'react-dom/client';
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from 'lucide-react'
import { Slider } from './ui/slider';

type AudioVisualizerProps = {
    children?: React.ReactNode;
};

const AudioVisualizer = ({ children }: AudioVisualizerProps) => {
    const sketchRef = useRef<HTMLDivElement>(null);
    const childrenContainerRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const deviceRef = useRef<Device>(null);
    const xParamRef = useRef<Parameter>(null);
    const yParamRef = useRef<Parameter>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const reactRootRef = useRef<Root | null>(null);

    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0);

    const loadRNBO = async (audioContext: AudioContext) => {
        await audioContext.resume();

        const rawPatcher = await fetch('/patches/patch.export.json');
        const patcher = await rawPatcher.json();

        const device = await createDevice({ context: audioContext, patcher });

        const gainNode = audioContext.createGain();
        device.node.connect(gainNode);
        gainNode.connect(audioContext.destination);

        xParamRef.current = device.parametersById.get('x');
        yParamRef.current = device.parametersById.get('y');
        gainNodeRef.current = gainNode;
    };

    const startAudioContext = () => {
        const audioContext = audioContextRef.current;
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.setValueAtTime(isMuted ? volume : 0, audioContextRef.current?.currentTime || 0);
        }
    };

    const handleVolumeChange = (newVolume: number[]) => {
        const volumeValue = newVolume[0];
        setVolume(volumeValue);
        if (gainNodeRef.current && !isMuted) {
            gainNodeRef.current.gain.setValueAtTime(volumeValue, audioContextRef.current?.currentTime || 0);
        }
    };

    const sketch = (p: p5) => {
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
            childrenContainer = p.createDiv();
            childrenContainer.parent(sketchRef.current!);
            childrenContainer.position(0, 0);
            childrenContainer.style('position', 'absolute');
            childrenContainer.style('top', '0');
            childrenContainer.style('left', '0');
            childrenContainer.style('width', '50%');
            childrenContainer.style('height', '50%');
            childrenContainer.style('pointer-events', 'none');

            // Render React children
            if (childrenContainerRef.current && children) {
                if (!reactRootRef.current) {
                    reactRootRef.current = createRoot(childrenContainer.elt);
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
            p.rect(460, 460, p.mouseX + 1, p.mouseX + 1);

            // Position the children container to follow rectangle
            if (childrenContainer) {
                childrenContainer.position(
                    200 - (p.mouseX + 1) / 2,
                    200 - (p.mouseX + 1) / 2
                );
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
    };

    useEffect(() => {
        // Initialize p5.js instance
        const p5Instance = new p5(sketch, sketchRef.current!);

        // Cleanup on unmount
        return () => {
            // Safely unmount React root
            if (reactRootRef.current) {
                reactRootRef.current.unmount();
                reactRootRef.current = null;
            }

            // Remove p5 instance
            p5Instance.remove();

            // Close audio context
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }

            // Destroy RNBO device
            if (deviceRef.current) {
                deviceRef.current.destroy();
            }
        };
    }, [sketch]);

    // Add children dependency to re-render when children change
    useEffect(() => {
        if (reactRootRef.current && children) {
            reactRootRef.current.render(children);
        }
    }, [children]);

    return (
        <div className="relative w-[920px] h-[920px]">
            <div ref={sketchRef} className="absolute top-0 left-0" />
            <div
                ref={childrenContainerRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 bg-black/50 p-2 rounded-md w-52">
                <Button onClick={toggleMute} variant="ghost" size="icon" aria-label={isMuted ? "Unmute" : "Mute"}>
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </Button>
                <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    max={1}
                    step={0.01}
                    className="w-32"
                    aria-label="Volume"
                />
            </div>
        </div>
    );
};

export default AudioVisualizer; */