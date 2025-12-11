// /frontend/src/context/ShowContext.tsx - Finalized Context
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Show, ShowContextType } from '../types/Show';

const API_BASE_URL = 'http://localhost:3000/api'; 

const ShowContext = createContext<ShowContextType | undefined>(undefined);

export const ShowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [shows, setShows] = useState<Show[]>([]);

    const fetchShows = async () => {
        try {
            const response = await axios.get<Show[]>(`${API_BASE_URL}/shows`);
            setShows(response.data);
        } catch (error) {
            console.error("Error fetching shows:", error);
        }
    };
    
    const createShow = async (data: any): Promise<boolean> => {
        try {
            await axios.post(`${API_BASE_URL}/admin/shows`, data);
            fetchShows(); 
            return true;
        } catch (error) {
            console.error("Admin Create Error:", error);
            return false;
        }
    };
    
    const bookSeats = async (showId: number, userName: string, userPhone: string, seatCount: number): Promise<string> => {
        try {
            const response = await axios.post(`${API_BASE_URL}/book`, { showId, userName, userPhone, seatCount });
            fetchShows(); 
            return response.data.message;
        } catch (error: any) {
            return error.response?.data?.message || 'An unknown error occurred.';
        }
    };

    useEffect(() => {
        fetchShows();
    }, []);

    const contextValue: ShowContextType = {
        shows, 
        fetchShows, 
        createShow, 
        bookSeats
    };

    return (
        <ShowContext.Provider value={contextValue}>
            {children}
        </ShowContext.Provider>
    );
};

export const useShows = () => {
    const context = useContext(ShowContext);
    if (context === undefined) {
        throw new Error('useShows must be used within a ShowProvider');
    }
    return context;
};

export {};