"use client"
import { useEffect, useRef } from 'react';
import p5 from 'p5';

const PianoSketch = () => {
    const sketchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sketch = (p: p5) => {
            const keyWidth = 40;
            const keyHeight = 120;
            const blackKeyOffset = 25;
            const whiteKeys = [true, true, true, true, true, true];  // For simplicity, assume 5 white keys
            const blackKeys = [true, true, true]; // Only some keys are black
            const pressedKeys = [false, false, false, false, false, false]; // Track which keys are pressed

            // Function to trigger additional actions on key press
            const onKeyPress = (keyIndex: number) => {
                console.log(`Key ${keyIndex} pressed`);
                // You can call other functions here when a key is pressed
            };

            p.setup = () => {
                p.createCanvas(4 * keyWidth, keyHeight);
            };

            p.draw = () => {
                p.background(200);

                // Draw white keys
                for (let i = 0; i < whiteKeys.length; i++) {
                    if (pressedKeys[i]) {
                        p.fill(255, 255, 150); // Bright color for pressed key
                    } else {
                        p.fill(255);
                    }
                    p.rect(i * keyWidth, 0, keyWidth, keyHeight);
                }

                // Draw black keys
                for (let i = 0; i < blackKeys.length; i++) {
                    if (blackKeys[i]) {
                        p.fill(0);
                        p.rect(i * keyWidth + blackKeyOffset, 0, keyWidth * 0.6, keyHeight * 0.6);
                    }
                }
            };

            p.mousePressed = () => {
                // Detect if a white key was pressed
                for (let i = 0; i < whiteKeys.length; i++) {
                    if (p.mouseX > i * keyWidth && p.mouseX < (i + 1) * keyWidth) {
                        pressedKeys[i] = true;
                        onKeyPress(i); // Call action when a key is pressed
                    }
                }
            };

            p.mouseReleased = () => {
                // Reset all keys to unpressed when mouse is released
                pressedKeys.fill(false);
            };
        };

        const p5Instance = new p5(sketch, sketchRef.current!); // Initialize p5 instance

        return () => {
            p5Instance.remove(); // Clean up p5 instance on component unmount
        };
    }, []);

    return <div ref={sketchRef} />;
}

export default PianoSketch;
