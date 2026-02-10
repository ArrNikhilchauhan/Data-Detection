import React, { useState } from 'react';
import './styles.css';
import DatasetUpload from './components/DatasetUpload';
import ProfilingView from './components/ProfilingView';
import AnomalyView from './components/AnomalyView';
import DriftView from './components/DriftView';
import HealthDashboard from './components/HealthDashboard';
import OperationalDecision from './components/OperationalDecision';

// Update this to match your FastAPI server URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [currentStep, setCurrentStep] = useState('upload');
  const [datasetName, setDatasetName] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for API results
  const [profilingData, setProfilingData] = useState(null);
  const [anomalyData, setAnomalyData] = useState(null);
  const [driftData, setDriftData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [operationalData, setOperationalData] = useState(null);

  // Store files for health check
  const [storedFiles, setStoredFiles] = useState({
    referenceFile: null,
    currentFile: null
  });

  const resetResults = () => {
    setProfilingData(null);
    setAnomalyData(null);
    setDriftData(null);
    setHealthData(null);
    setOperationalData(null);
    setStoredFiles({ referenceFile: null, currentFile: null });
    setError(null);
  };

  const handleAnalysisComplete = (data, analysisType, files = null) => {
    if (files) {
      setStoredFiles(files);
    }

    switch(analysisType) {
      case 'profile':
        setProfilingData(data);
        setCurrentStep('profiling');
        break;
      case 'anomaly':
        setAnomalyData(data);
        setCurrentStep('anomaly');
        break;
      case 'drift':
        setDriftData(data);
        setCurrentStep('drift');
        break;
      case 'health':
        setHealthData(data);
        setCurrentStep('health');
        break;
      default:
        setCurrentStep('upload');
    }
  };

  const runHealthCheck = async () => {
    if (!storedFiles.referenceFile || !storedFiles.currentFile) {
      setError('Both reference and current datasets are required for health check');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('reference', storedFiles.referenceFile);
      formData.append('current', storedFiles.currentFile);
      formData.append('dataset_name', datasetName);

      const response = await fetch(`${API_BASE_URL}/health/health_report`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHealthData(data);
      handleAnalysisComplete(data, 'health');
    } catch (err) {
      setError(`Health check failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runOperationalDecision = async () => {
    if (!healthData) {
      setError('Please run a health check first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, make sure we have all required files
      if (!storedFiles.referenceFile || !storedFiles.currentFile) {
        throw new Error('Missing dataset files for operational decision');
      }

      // Upload both files again for operational decision
      const formData = new FormData();
      formData.append('reference', storedFiles.referenceFile);
      formData.append('current', storedFiles.currentFile);
      formData.append('dataset_name', datasetName);

      const response = await fetch(`${API_BASE_URL}/operation/operational`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOperationalData(data);
      setCurrentStep('decision');
    } catch (err) {
      setError(`Operational decision failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setDatasetName('');
    setSelectedAnalysis('profile');
    resetResults();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Data Quality & Reliability Platform</h1>
        <p className="app-subtitle">
          Deterministic data quality assessment for production pipelines
        </p>
      </header>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button 
            onClick={() => setError(null)}
            style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '12px' }}
            className="btn btn-secondary"
          >
            Dismiss
          </button>
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <div style={{ marginBottom: '10px' }}>Processing your request...</div>
          <div style={{ 
            width: '100%', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '4px',
            height: '4px'
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              backgroundColor: '#1a73e8',
              borderRadius: '4px',
              animation: 'loading 1.5s ease-in-out infinite'
            }}></div>
          </div>
        </div>
      )}

      <div className="main-layout">
        <div>
          {currentStep === 'upload' && (
            <DatasetUpload
              datasetName={datasetName}
              setDatasetName={setDatasetName}
              selectedAnalysis={selectedAnalysis}
              setSelectedAnalysis={setSelectedAnalysis}
              onAnalysisComplete={handleAnalysisComplete}
              onError={setError}
              onLoading={setIsLoading}
            />
          )}

          {currentStep === 'profiling' && profilingData && (
            <ProfilingView data={profilingData} />
          )}

          {currentStep === 'anomaly' && anomalyData && (
            <AnomalyView data={anomalyData} />
          )}

          {currentStep === 'drift' && driftData && (
            <DriftView data={driftData} />
          )}
        </div>

        <div>
          {currentStep === 'health' && healthData && (
            <HealthDashboard 
              data={healthData}
              onRunDecision={runOperationalDecision}
              isLoading={isLoading}
            />
          )}

          {currentStep === 'decision' && operationalData && (
            <OperationalDecision data={operationalData} />
          )}

          {/* Show health check prompt for single-file analyses */}
          {(currentStep === 'profiling' || currentStep === 'anomaly') && (
            <div className="card">
              <h2 className="card-title">Comprehensive Health Check</h2>
              <p className="mb-16">
                To get a complete health assessment including drift detection and operational recommendations,
                you need to compare with a reference dataset.
              </p>
              <button 
                className="btn btn-primary w-full"
                onClick={() => {
                  setCurrentStep('upload');
                  setSelectedAnalysis('health');
                }}
              >
                Run Full Health Check (Requires 2 Datasets)
              </button>
            </div>
          )}

          {currentStep === 'drift' && (
            <div className="card">
              <h2 className="card-title">Generate Health Score</h2>
              <p className="mb-16">
                You've already uploaded both reference and current datasets. 
                Generate a comprehensive health score and operational decision.
              </p>
              <button 
                className="btn btn-primary w-full"
                onClick={runHealthCheck}
              >
                Generate Health Score & Decision
              </button>
            </div>
          )}
        </div>
      </div>

      {currentStep !== 'upload' && (
        <div className="card mt-16">
          <div className="flex justify-between">
            <div>
              <div style={{ fontSize: '12px', color: '#5f6368' }}>
                Current Analysis: {selectedAnalysis.toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', color: '#5f6368' }}>
                Dataset: {datasetName || 'Unnamed'}
              </div>
            </div>
            <div className="btn-group">
              <button className="btn btn-secondary" onClick={handleReset}>
                Start New Analysis
              </button>
              {(currentStep === 'profiling' || currentStep === 'anomaly') && (
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    setCurrentStep('upload');
                    setSelectedAnalysis('health');
                  }}
                >
                  Add Reference for Health Check
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

export default App;