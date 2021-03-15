import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import { RefObject, useEffect, useState } from 'react';
import { Room } from '../types';

export const useTimeElapsed = (roomRef: RefObject<Room>) => {
    const [timeElapsed, setTimeElapsed] = useState("");
    const [rocketIcon, setRocketIcon] = useState("");
    const [rocketStatus, setRocketStatus] = useState("");

    const updateTime = (roomRef: RefObject<Room>) => {
        if (!roomRef.current) {
            return;
        }
        const roomDate = new Date(roomRef.current.inserted_at);
        const timeDiff = differenceInMinutes(new Date(), roomDate);

        setTimeElapsed(formatDistanceToNowStrict(roomDate, 
            { unit: timeDiff > 120 ? undefined : "minute" }
        ));

        if (timeDiff < 30) {
            setRocketIcon("⛽️");
            setRocketStatus("Fueling rocket");
        } else if (timeDiff < 60) {
            setRocketIcon("🚀");
            setRocketStatus("Taking off");
        } else if (timeDiff < 120) {
            setRocketIcon("🚀✨");
            setRocketStatus("In space");
        } else if (timeDiff < 240) {
            setRocketIcon("🚀🌕");
            setRocketStatus("Approaching moon");
        } else if (timeDiff < 480) {
            setRocketIcon("🌕🐕");
            setRocketStatus("Lunar doge");
        } else if (timeDiff < 1440) {
            setRocketIcon("🚀☀️");
            setRocketStatus("Approaching sun");
        } else {
            setRocketIcon("☀️🐕");
            setRocketStatus("Solar doge");
        }
    }

    useEffect(() => {
        updateTime(roomRef);
        const intervalId = setInterval(() => updateTime(roomRef), 10000);
        return () => clearInterval(intervalId);
    }, [roomRef]);

    return { timeElapsed, rocketIcon, rocketStatus };
};
