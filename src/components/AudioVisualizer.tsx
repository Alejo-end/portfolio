import { createDevice } from '@rnbo/js';
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

type AudioVisualizerProps = {
    children: React.ReactNode;
};

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ children }) => {
    const sketchRef = useRef<HTMLDivElement>(null);
    const threeCanvasRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const deviceRef = useRef<any>(null); // Replace 'any' with correct type if available
    const xParamRef = useRef<any>(null);
    const yParamRef = useRef<any>(null);

    const loadRNBO = async (audioContext: AudioContext) => {
        await audioContext.resume();

        const rawPatcher = await fetch('/patches/patch.export.json');
        const patcher = await rawPatcher.json();

        const device = await createDevice({ context: audioContext, patcher });
        device.node.connect(audioContext.destination);

        // Save the device and parameters for further use
        deviceRef.current = device;
        xParamRef.current = device.parametersById.get('x');
        yParamRef.current = device.parametersById.get('y');
    };

    const startAudioContext = () => {
        const audioContext = audioContextRef.current;
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    };

    const sketch = (p: any) => {
        let xValue = 0;
        let yValue = 0;

        p.setup = () => {
            p.createCanvas(720, 720);
            p.noCursor();
            p.colorMode(p.HSB, 360, 100, 100);
            p.rectMode(p.CENTER);
            p.noStroke();

            // Initialize Audio Context
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            loadRNBO(audioContextRef.current);

            // Resume the AudioContext on mouse click
            p.mousePressed = startAudioContext;
        };

        p.draw = () => {
            p.background(p.mouseY / 2, 100, 100);
            p.fill(360 - p.mouseY / 2, 100, 100);
            p.rect(360, 360, p.mouseX + 1, p.mouseX + 1);

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
            p5Instance.remove();
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '720px', height: '720px' }}>
            <div ref={sketchRef} style={{ position: 'absolute', top: 0, left: 0 }} />
            {/* Render children in the center */}
            <div
                ref={threeCanvasRef}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default AudioVisualizer;
