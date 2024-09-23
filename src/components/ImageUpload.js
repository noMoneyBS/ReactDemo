import React, { useState } from 'react';
import axios from 'axios';
import UploadOptions from './UploadOptions';
import ProgressBar from './ProgressBar';
import RecipeDisplay from './RecipeDisplay';
import PreviewImage from './PreviewImage';

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState('');
    const [textEntries, setTextEntries] = useState(['']);
    const [uploadType, setUploadType] = useState('image');
    const [recipes, setRecipes] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif', 'image/tiff'];

        if (!validImageTypes.includes(file.type)) {
            alert('Only image files are allowed (jpeg, png, gif, webp, heic, heif, tiff)');
            return;
        }

        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const onFileUpload = async () => {
        const formData = new FormData();

        if (uploadType === 'image') {
            if (!file) {
                alert('Please select an image file');
                return;
            }
            formData.append('image', file);
        } else {
            const texts = textEntries.filter(text => text.trim() !== '');
            if (texts.length === 0) {
                alert('Please enter some text');
                return;
            }
            texts.forEach((text, index) => {
                formData.append(`text${index}`, text);
            });
        }

        try {
            const res = await axios.post('http://localhost:5001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });
            console.log('Upload successful:', res.data);
            setRecipes(res.data.recipes);
            setStatus('Upload successful');
            setFile(null);
            setTextEntries(['']);
            setPreview(null);
            setUploadProgress(0); // 重置进度条
        } catch (error) {
            if (error.response) {
                const errorCode = error.response.status;
                if (errorCode === 400) {
                    setStatus('Bad Request: Please check your input.');
                } else if (errorCode === 500) {
                    setStatus('Server Error: Please try again later.');
                } else {
                    setStatus(`Error: ${error.response.data.message}`);
                }
            } else {
                setStatus('Network Error: Please check your connection.');
            }
            setUploadProgress(0); // 重置进度条
        }
    };

    const handleTextChange = (index, value) => {
        const newTextEntries = [...textEntries];
        newTextEntries[index] = value;
        setTextEntries(newTextEntries);
    };

    const addTextEntry = () => {
        setTextEntries([...textEntries, '']);
    };

    const removeTextEntry = (index) => {
        const newTextEntries = textEntries.filter((_, i) => i !== index);
        setTextEntries(newTextEntries);
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftPanel}>
                <UploadOptions
                    uploadType={uploadType}
                    setUploadType={setUploadType}
                    onFileChange={onFileChange}
                    onFileUpload={onFileUpload}
                    textEntries={textEntries}
                    handleTextChange={handleTextChange}
                    addTextEntry={addTextEntry}
                    removeTextEntry={removeTextEntry}
                />
                <PreviewImage preview={preview} />
                <ProgressBar uploadProgress={uploadProgress} />
                {status && <p style={styles.status}>{status}</p>}
            </div>
            <div style={styles.rightPanel}>
                <RecipeDisplay recipes={recipes} />
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        background: 'linear-gradient(to bottom, #f5f7fa, #c3cfe2)',
        color: '#333',
        padding: '20px',
    },
    leftPanel: {
        flex: 1,
        padding: '20px',
    },
    rightPanel: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
    },
    status: {
        marginTop: '20px',
        fontSize: '18px',
    },
};

export default ImageUpload;