import React from 'react';
import ReactMarkdown from 'react-markdown';

const RecipeDisplay = ({ recipes }) => {
    return (
        <div style={styles.recipesContainer}>
            <h2>Recommended Recipes:</h2>
            <ReactMarkdown>{recipes}</ReactMarkdown>
        </div>
    );
};

const styles = {
    recipesContainer: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        color: '#333',
        maxHeight: '80vh',
        overflowY: 'auto',
    },
};

export default RecipeDisplay;