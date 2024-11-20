import { useEffect, useRef } from 'react';
import p5 from 'p5';

export interface RepeatingTextSketchProps {
    sentence: string;
    xPos: number;
    yPos: number;
    angle: number;
    bgColor: string;
}

const RepeatingTextSketch = ({ sentence, xPos, yPos, angle, bgColor }: RepeatingTextSketchProps) => {
    const sketchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sketch = (p: p5) => {
            let bgColorBrightness: number;
            let textWidth: number;
            let textHeight: number = 30; // Set a constant height for the text

            // Calculate brightness of the background color to adjust text color for contrast
            const getBrightness = (color: p5.Color) => {
                const r = p.red(color);
                const g = p.green(color);
                const b = p.blue(color);
                return (r * 299 + g * 587 + b * 114) / 1000;
            };

            p.setup = () => {
                p.textFont('Arial');
                p.textSize(20);
                bgColorBrightness = getBrightness(p.color(bgColor));

                // Calculate the width of the repeated text
                const repeatedText = sentence.repeat(10);
                textWidth = p.textWidth(repeatedText);

                // Set canvas size based on the text dimensions
                p.createCanvas(textWidth, textHeight).position(xPos, yPos);
            };

            p.draw = () => {
                p.background(bgColor);
                p.push();
                p.translate(textWidth / 2, textHeight / 2); // Centering the text

                const textColor = bgColorBrightness > 125 ? 0 : 255; // If background is bright, use black text, else white
                p.fill(textColor);

                // Draw repeating text
                const repeatedText = sentence.repeat(10);
                p.text(repeatedText, -textWidth / 2, textHeight / 4); // Adjust for the new centered coordinates

                p.pop();
            };
        };

        const p5Instance = new p5(sketch, sketchRef.current!); // Use the non-null assertion operator to handle the type mismatch

        return () => {
            p5Instance.remove();
        };
    }, [sentence, xPos, yPos, angle, bgColor]);

    return <div ref={sketchRef} />;
};

export default RepeatingTextSketch;
