import React from 'react';

const ProgressBar = ({ uploadProgress }) => {
    return (
        uploadProgress > 0 && (
            <div style={styles.progressBarContainer}>
                <div style={{ ...styles.progressBar, width: `${uploadProgress}%` }}></div>
            </div>
        )
    );
};

const styles = {
    progressBarContainer: {
        width: '80%',
        backgroundColor: '#ccc',
        borderRadius: '5px',
        marginTop: '20px',
    },
    progressBar: {
        height: '10px',
        borderRadius: '5px',
        backgroundColor: '#4CAF50',
    },
};

export default ProgressBar;