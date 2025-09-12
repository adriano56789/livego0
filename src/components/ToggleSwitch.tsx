
import React, { useState } from 'react';

interface ToggleSwitchProps {
    initialChecked?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ initialChecked = false }) => {
    const [isChecked, setIsChecked] = useState(initialChecked);

    return (
        <button
            onClick={() => setIsChecked(!isChecked)}
            className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-200 ease-in-out flex-shrink-0 ${
                isChecked ? 'bg-blue-500' : 'bg-gray-500'
            }`}
            aria-pressed={isChecked}
        >
            <span
                className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    isChecked ? 'translate-x-5' : 'translate-x-0.5'
                }`}
            />
        </button>
    );
};

export default ToggleSwitch;