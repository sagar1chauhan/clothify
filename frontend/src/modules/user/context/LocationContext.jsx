import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [addresses, setAddresses] = useState(() => {
        const saved = localStorage.getItem('userAddresses');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeAddress, setActiveAddress] = useState(() => {
        const saved = localStorage.getItem('activeAddress');
        return saved ? JSON.parse(saved) : null;
    });

    // Function to sync from localStorage without triggering loops
    const syncFromStorage = useCallback(() => {
        const savedAddresses = localStorage.getItem('userAddresses');
        if (savedAddresses) {
            const parsed = JSON.parse(savedAddresses);
            setAddresses(curr => JSON.stringify(curr) !== savedAddresses ? parsed : curr);
        }

        const savedActive = localStorage.getItem('activeAddress');
        if (savedActive) {
            const parsed = JSON.parse(savedActive);
            setActiveAddress(curr => JSON.stringify(curr) !== savedActive ? parsed : curr);
        }
    }, []);

    // Sync with localStorage on mount and storage events
    useEffect(() => {
        window.addEventListener('storage', syncFromStorage);
        syncFromStorage();
        return () => window.removeEventListener('storage', syncFromStorage);
    }, [syncFromStorage]);

    const updateActiveAddress = useCallback((address) => {
        setActiveAddress(address);
        localStorage.setItem('activeAddress', JSON.stringify(address));
    }, []);

    const refreshAddresses = useCallback(() => {
        const saved = localStorage.getItem('userAddresses');
        if (saved) {
            const parsed = JSON.parse(saved);
            setAddresses(curr => JSON.stringify(curr) !== saved ? parsed : curr);
        }
    }, []);

    const value = useMemo(() => ({
        addresses,
        activeAddress,
        updateActiveAddress,
        refreshAddresses
    }), [addresses, activeAddress, updateActiveAddress, refreshAddresses]);

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};
