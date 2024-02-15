import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Create a context to hold the state of whether to render messages or not

export const RenderMessagesContext = createContext();

export const RenderMessagesProvider = ({ children }) => {
    const [shouldRenderMessages, setShouldRenderMessages] = useState(false);

    return (
        <RenderMessagesContext.Provider value={{ shouldRenderMessages, setShouldRenderMessages }}>
            {children}
        </RenderMessagesContext.Provider>
    );
};

RenderMessagesProvider.propTypes = {
    children: PropTypes.node,
};


