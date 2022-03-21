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
        const container = containerRef.current;
        if (!container) {
            return () => {};
        }

        // Update the container size when window resized
        const resizeObserver = new ResizeObserver(() => {
            const { width, height } = container.getBoundingClientRect();
            setContainerSize({ width, height });
        });
        resizeObserver.observe(container);
        return () => {
            resizeObserver.unobserve(container);
        };
    }, [containerRef]);

    return containerSize;
}
