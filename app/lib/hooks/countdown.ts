import { useEffect, useRef, useState } from "react"

export function useCountdown(
    targetEpoch: number,
    onComplete?: () => void,
) {
    const interval = useRef<NodeJS.Timeout>(undefined)

    // Store ref to avoid stale closures
    const onCompleteRef = useRef(onComplete)

    useEffect(() => {
        onCompleteRef.current = onComplete
    }, [onComplete])

    const [countDown, setCountDown] = useState(() => {
        if (!targetEpoch)
            return 0
        return targetEpoch - new Date().getTime()
    })

    useEffect(() => {
        clearInterval(interval.current)

        interval.current = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetEpoch - now

            if (distance > 0) {
                setCountDown(distance)
            }
            else {
                setCountDown(0)
                onCompleteRef.current?.()
                clearInterval(interval.current)
            }
        }, 1000)

        return () => clearInterval(interval.current)
    }, [targetEpoch])

    // Calculate time units
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24))
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
}
