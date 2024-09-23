import React from 'react';

const UploadOptions = ({
    uploadType,
    setUploadType,
    onFileChange,
    onFileUpload,
    textEntries,
    handleTextChange,
    addTextEntry,
    removeTextEntry,
}) => {
    return (
        <div>
            <h2>Upload Options</h2>
            <div style={styles.radioContainer}>
                <label>
                    <input
                        type="radio"
                        value="image"
                        checked={uploadType === 'image'}
                        onChange={() => setUploadType('image')}
                    />
                    Upload Image
                </label>
                <label>
                    <input
                        type="radio"
                        value="text"
                        checked={uploadType === 'text'}
                        onChange={() => setUploadType('text')}
                    />
                    Upload Text
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
        </div>
    );
};

const styles = {
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
        transition: 'background-color 0.3s ease, transform 0.2s ease',
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
};

export default UploadOptions;