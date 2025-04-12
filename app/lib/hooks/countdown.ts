import { useEffect, useRef, useState } from "react"

// Helper function for padding numbers with leading zeros
const padZero = (num: number): string => num.toString().padStart(2, "0")

export function useCountdown(
    targetEpoch?: number,
    onComplete?: () => void,
) {
    // Store onComplete in a ref to avoid stale closures
    const onCompleteRef = useRef(onComplete)
    const hasCompletedRef = useRef(false)
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

    // Update the ref when onComplete changes
    useEffect(() => {
        onCompleteRef.current = onComplete
    }, [onComplete])

    // Initialize countdown state with a function to calculate initial value
    const [time, setTime] = useState(() => {
        if (!targetEpoch)
            return 0
        const initialTime = targetEpoch - Date.now()
        return initialTime > 0 ? initialTime : 0
    })

    // Setup the interval effect
    useEffect(() => {
        // Reset completion status when targetEpoch changes
        hasCompletedRef.current = false

        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = undefined
        }

        // Don't start an interval if there's no target time or it's in the past
        if (!targetEpoch || targetEpoch <= Date.now()) {
            // Set initial time to 0 (using useState initializer, not setting directly here)
            // Call onComplete if needed
            if (targetEpoch && !hasCompletedRef.current) {
                onCompleteRef.current?.()
                hasCompletedRef.current = true
            }
            return
        }

        // Start the interval to update the countdown
        intervalRef.current = setInterval(() => {
            // Get current time remaining
            const remaining = targetEpoch - Date.now()

            if (remaining <= 0) {
                // Time's up
                setTime(0)

                // Call onComplete if it hasn't been called yet
                if (!hasCompletedRef.current) {
                    onCompleteRef.current?.()
                    hasCompletedRef.current = true
                }

                // Clear the interval
                if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = undefined
                }
            }
            else {
                // Update the countdown time
                setTime(remaining)
            }
        }, 1000)

        // Cleanup on unmount or when targetEpoch changes
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = undefined
            }
        }
    }, [targetEpoch]) // Only depend on targetEpoch

    // Calculate time units
    const days = Math.floor(time / (1000 * 60 * 60 * 24))
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((time % (1000 * 60)) / 1000)

    // Return values with appropriate padding
    return {
        days,
        hours: padZero(hours),
        minutes: padZero(minutes),
        seconds: padZero(seconds),
    }
}
