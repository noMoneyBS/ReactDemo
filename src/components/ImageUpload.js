import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState('');
    const [textEntries, setTextEntries] = useState(['']);
    const [uploadType, setUploadType] = useState('image');
    const [recipes, setRecipes] = useState('');

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
            });
            console.log('Upload successful:', res.data);
            setRecipes(res.data.recipes);
            setStatus('Upload successful');
            setFile(null);
            setTextEntries(['']);
            setPreview(null);
        } catch (error) {
            console.error('Upload failed:', error.response ? error.response.data : error.message);
            setStatus('Upload failed');
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
            {recipes && (
                <div style={styles.recipesContainer}>
                    <h2>Recommended Recipes:</h2>
                    <div style={styles.markdownContainer}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{recipes}</ReactMarkdown>
                    </div>
                </div>
            )}
            <h1 style={styles.heading}>Upload</h1>
            <div style={styles.radioContainer}>
                <label>
                    <input
                        type="radio"
                        value="image"
                        checked={uploadType === 'image'}
                        onChange={() => setUploadType('image')}
                    />
                    Image
                </label>
                <label>
                    <input
                        type="radio"
                        value="text"
                        checked={uploadType === 'text'}
                        onChange={() => setUploadType('text')}
                    />
                    Text
                </label>
            </div>
            {uploadType === 'image' && (
                <div style={styles.inputContainer}>
                    <input type="file" onChange={onFileChange} style={styles.input} />
                    <button onClick={onFileUpload} style={styles.button}>Upload Image</button>
                </div>
            )}
            {uploadType === 'text' && (
                <div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Text Entry</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {textEntries.map((text, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={text}
                                            onChange={(e) => handleTextChange(index, e.target.value)}
                                            style={styles.textInput}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => removeTextEntry(index)} style={styles.removeButton}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={addTextEntry} style={styles.addButton}>Add Text Entry</button>
                    <button onClick={onFileUpload} style={styles.button}>Upload Text</button>
                </div>
            )}
            {preview && <img src={preview} alt="preview" style={styles.previewImage} />}
            {status && <p style={styles.status}>{status}</p>}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: 'black', // 设置黑色背景
        color: 'white', // 设置白色字体
        padding: '20px',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    radioContainer: {
        marginBottom: '20px',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    input: {
        marginRight: '10px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    table: {
        marginBottom: '20px',
        borderCollapse: 'collapse',
    },
    textInput: {
        width: '200px',
        padding: '5px',
    },
    removeButton: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        padding: '5px 10px',
    },
    addButton: {
        marginBottom: '10px',
        padding: '10px 20px',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    previewImage: {
        maxWidth: '400px',
        maxHeight: '400px',
        objectFit: 'contain',
        marginTop: '20px',
    },
    status: {
        marginTop: '20px',
        fontSize: '18px',
    },
    recipesContainer: {
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#333', // 黑色背景
        color: 'white', // 白色字体
        width: '80%', // 根据页面大小变化
        maxHeight: '60vh', // 设置最大高度
        overflowY: 'auto', // 启用垂直滚动
    },
    markdownContainer: {
        padding: '10px',
        whiteSpace: 'pre-wrap', // 处理换行
    },
};

export default ImageUpload;