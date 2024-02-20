import { useRef, useCallback } from 'react'

const useInfiniteScroll = (
    callback: (startId: number) => void,
    startId: number,
) => {
    const observer = useRef<IntersectionObserver | null>(null)

    const lastElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    callback(startId)
                }
            })
            if (node) observer.current.observe(node)
        },
        [callback, startId],
    )

    return lastElementRef
}

export default useInfiniteScroll
