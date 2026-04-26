export const generateTexture = (type) => {
    const canvas = document.createElement('canvas');
    const size = 16;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(size, size);
    
    // Helper to add noise to a base color
    const addNoise = (r, g, b, noiseLevel) => {
        const noise = (Math.random() - 0.5) * noiseLevel;
        return [
            Math.max(0, Math.min(255, r + noise)),
            Math.max(0, Math.min(255, g + noise)),
            Math.max(0, Math.min(255, b + noise)),
            255
        ];
    };

    for (let i = 0; i < size * size * 4; i += 4) {
        let color = [255, 0, 255, 255]; // Default error color

        if (type === 'dirt') {
            color = addNoise(134, 96, 67, 30);
        } else if (type === 'grass_top') {
            color = addNoise(93, 140, 62, 30);
        } else if (type === 'grass_side') {
            const y = Math.floor((i / 4) / size);
            // Top 4 pixels are grass, rest is dirt
            if (y < 4 || (y === 4 && Math.random() > 0.5)) {
                color = addNoise(93, 140, 62, 30);
            } else {
                color = addNoise(134, 96, 67, 30);
            }
        } else if (type === 'netherrack') {
            color = addNoise(110, 38, 38, 40);
        } else if (type === 'magma') {
            const isBright = Math.random() > 0.8;
            color = isBright ? addNoise(255, 165, 0, 20) : addNoise(139, 0, 0, 40);
        } else if (type === 'end_stone') {
            color = addNoise(221, 223, 165, 25);
        } else if (type === 'obsidian') {
            color = addNoise(20, 15, 30, 20);
        } else if (type === 'prismarine') {
            color = addNoise(112, 178, 178, 20);
            // Add a slightly darker border for tile effect
            const x = (i / 4) % size;
            const y = Math.floor((i / 4) / size);
            if (x === 0 || y === 0 || x === size - 1 || y === size - 1) {
                color = addNoise(70, 130, 130, 10);
            }
        } else if (type === 'sea_lantern') {
            color = addNoise(200, 240, 240, 15);
            const x = (i / 4) % size;
            const y = Math.floor((i / 4) / size);
            if (x < 2 || y < 2 || x > size - 3 || y > size - 3) {
                color = addNoise(100, 180, 180, 10); // Cyan border
            }
        }

        imgData.data[i] = color[0];
        imgData.data[i + 1] = color[1];
        imgData.data[i + 2] = color[2];
        imgData.data[i + 3] = color[3];
    }
    
    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL();
};
