import React, { useEffect, useState } from 'react';

type Size = { width: number; height: number };

export default function useContainerSize(
    containerRef: React.RefObject<HTMLDivElement>
): Size {
    const [containerSize, setContainerSize] = useState<Size>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const updateParentSize = () => {
            if (containerRef.current) {
                const {
                    width,
                    height,
                } = containerRef.current.getBoundingClientRect();
                setContainerSize({ width, height });
            }
        };

        updateParentSize();

        // Update the container size when window resized
        window.addEventListener('resize', updateParentSize);
        return () => {
            window.removeEventListener('resize', updateParentSize);
        };
    }, [containerRef]);

    return containerSize;
}
