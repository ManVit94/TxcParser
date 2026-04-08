import React, { useState, useRef } from 'react';
import { parseTcx } from './utils/tcxParser';
import './App.css';

function App() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });
  const [resultData, setResultData] = useState<string | null>(null);
  const [activityPreview, setActivityPreview] = useState<any>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.tcx')) {
        setFile(droppedFile);
        setStatus({ message: `Ready to convert: ${droppedFile.name}`, type: 'success' });
        setResultData(null);
        setActivityPreview(null);
      } else {
        setStatus({ message: 'Please upload a .tcx file', type: 'error' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.tcx')) {
        setFile(selectedFile);
        setStatus({ message: `Ready to convert: ${selectedFile.name}`, type: 'success' });
        setResultData(null);
        setActivityPreview(null);
      } else {
        setStatus({ message: 'Please upload a .tcx file', type: 'error' });
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsLoading(true);
    setStatus({ message: 'Converting...', type: '' });
    
    try {
      // Use FileReader to read the file locally
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const xmlText = e.target?.result as string;
          
          // Parse directly in the browser!
          const parsedActivity = parseTcx(xmlText);
          
          const jsonString = JSON.stringify(parsedActivity, null, 2);
          
          setResultData(jsonString);
          setActivityPreview(parsedActivity);
          setStatus({ message: 'Converted securely on device!', type: 'success' });
        } catch (err: any) {
             console.error("Local parsing failed", err);
             setStatus({ message: err.message || 'Failed to parse TCX file.', type: 'error' });
        } finally {
             setIsLoading(false);
        }
      };

      reader.onerror = () => {
         setStatus({ message: 'Failed to read file from disk.', type: 'error' });
         setIsLoading(false);
      };

      reader.readAsText(file);
      
    } catch (error: any) {
      console.error(error);
      setStatus({ message: error.message || 'Conversion failed.', type: 'error' });
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultData) return;
    
    const blob = new Blob([resultData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file?.name.replace('.tcx', '.json') || 'activity.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      <div className="background-glow"></div>
      
      <header className="header">
        <img src={`${import.meta.env.BASE_URL}icon.png`} alt="App Logo" className="app-logo" />
        <h1>TCX to JSON</h1>
        <p>Convert your Garmin TCX activities into beautiful JSON payloads</p>
      </header>

      <main className="upload-card glass-panel">
        <div 
          className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <span className="drop-icon">🚀</span>
          <h3 className="drop-text">Drag & Drop your .tcx file here</h3>
          <p className="drop-subtext">or click to browse from your computer</p>
          <input 
            ref={inputRef}
            type="file" 
            className="file-input" 
            accept=".tcx"
            onChange={handleChange}
          />
        </div>

        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        {activityPreview && (
          <div className="preview-grid">
            <div className="preview-card">
              <h4>Activity</h4>
              <div className="stat">{activityPreview.sport || 'Unknown'}</div>
            </div>
            <div className="preview-card">
              <h4>Distance</h4>
              <div className="stat">{((activityPreview.distanceMeters || 0) / 1000).toFixed(2)} km</div>
            </div>
            <div className="preview-card">
              <h4>Time</h4>
              <div className="stat">{Math.floor((activityPreview.totalTimeSeconds || 0) / 60)} min</div>
            </div>
            <div className="preview-card">
              <h4>Calories</h4>
              <div className="stat">{activityPreview.calories || 0}</div>
            </div>
            <div className="preview-card">
              <h4>Avg HR</h4>
              <div className="stat">{activityPreview.averageHeartRate ? `${activityPreview.averageHeartRate} bpm` : '-'}</div>
            </div>
          </div>
        )}

        <div className="result-container">
          {!resultData ? (
            <button 
              className="button-primary" 
              onClick={handleConvert} 
              disabled={!file || isLoading}
            >
              {isLoading ? 'Processing...' : 'Convert to JSON'}
            </button>
          ) : (
             <button 
                className="button-primary" 
                onClick={handleDownload}
              >
                💾 Download JSON
              </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
