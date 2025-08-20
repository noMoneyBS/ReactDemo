import React from 'react';

const PreviewImage = ({ preview }) => {
    return preview && <img src={preview} alt="preview" style={styles.previewImage} />;
};

const styles = {
    previewImage: {
        maxWidth: '400px',
        maxHeight: '400px',
        objectFit: 'contain',
        marginTop: '20px',
    },
};

export default PreviewImage;