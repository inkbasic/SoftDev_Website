// src/hooks/useGeolocation.js
import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getCurrentPosition = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                });
                setLoading(false);
            },
            (error) => {
                setError(error.message);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000, // 10 minutes
                ...options
            }
        );
    };

    useEffect(() => {
        getCurrentPosition();
    }, []);

    return {
        location,
        error,
        loading,
        getCurrentPosition
    };
};