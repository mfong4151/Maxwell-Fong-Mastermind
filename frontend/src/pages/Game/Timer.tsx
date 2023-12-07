import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
interface Props {
    endsAt: string | null;
}

interface TimeLeft {
    hours: number;
    minutes: number;
    seconds: number;
}

const Timer: React.FC<Props> = ({ endsAt }) => {

    const navigate = useNavigate()
    const calculateTimeLeft = (endsAt: string | null): TimeLeft => {
        if (!endsAt) {
            return {
                hours: -1,
                minutes: -1,
                seconds: -1
            }
        }
        const diff = new Date(endsAt).getTime() - new Date().getTime();
        return {
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60),

        };
    }

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(endsAt));

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(endsAt));
        }, 1000);

        if(Object.values(timeLeft).every((val: number) => val === 0)){
            navigate('/games')            
        }


        return () => clearTimeout(timer);
    }, [timeLeft]);




    return (
        <div>
            <h3>Countdown Timer</h3>
            {
                timeLeft.hours < 0 ?
                    <>
                        <p>Untimed game</p>
                    </>

                    :
                    <>
                        <p>
                            {timeLeft.hours.toString().padStart(2, '0')}:
                            {timeLeft.minutes.toString().padStart(2, '0')}:
                            {timeLeft.seconds.toString().padStart(2, '0')}
                        </p>
                    </>
            }
        </div>
    );
}

export default Timer;
