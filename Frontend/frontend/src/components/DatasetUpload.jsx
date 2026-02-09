import React, { useState } from 'react';

const API_BASE_URL ='http://127.0.0.1:8000';

function DatasetUpload({ 
  datasetName, 
  setDatasetName, 
  selectedAnalysis, 
  setSelectedAnalysis,
  onAnalysisComplete,
  onError,
  onLoading
}) {
  const [currentFile, setCurrentFile] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        onError('Please upload a CSV file');
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        onError('File size exceeds 100MB limit');
        return;
      }
      if (type === 'current') {
        setCurrentFile(file);
      } else {
        setReferenceFile(file);
      }
      onError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!datasetName.trim()) {
      onError('Dataset name is required');
      return;
    }

    if (!currentFile) {
      onError('Current dataset file is required');
      return;
    }

    if ((selectedAnalysis === 'drift' || selectedAnalysis === 'health') && !referenceFile) {
      onError('Reference dataset is required for drift detection and health check');
      return;
    }

    onLoading(true);
    setUploadProgress(0);
    onError(null);

    try {
      let endpoint = '';
      let formData = new FormData();
      
      formData.append('dataset_name', datasetName);
      
      switch(selectedAnalysis) {
        case 'profile':
          endpoint = '/profiling/profile';
          formData.append('file', currentFile);
          break;
        case 'anomaly':
          endpoint = '/profiling/detect_anomaly';
          formData.append('file', currentFile);
          break;
        case 'drift':
          endpoint = '/drift/detect_drift';
          formData.append('reference', referenceFile);
          formData.append('current', currentFile);
          break;
        case 'health':
          endpoint = '/health/health_report';
          formData.append('reference', referenceFile);
          formData.append('current', currentFile);
          break;
        default:
          throw new Error('Invalid analysis type');
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store files for future use (especially for health/decision)
      const files = {
        currentFile,
        referenceFile: (selectedAnalysis === 'drift' || selectedAnalysis === 'health') ? referenceFile : null
      };
      
      onAnalysisComplete(data, selectedAnalysis, files);
      
    } catch (err) {
      onError(`Analysis failed: ${err.message}`);
    } finally {
      onLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Dataset Upload & Analysis Selection</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Dataset Name *</label>
          <input
            type="text"
            className="form-input"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            placeholder="e.g., transactions_daily"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            {selectedAnalysis === 'drift' || selectedAnalysis === 'health' 
              ? 'Current Dataset (CSV) *' 
              : 'Dataset File (CSV) *'}
          </label>
          <input
            type="file"
            className="file-input"
            onChange={(e) => handleFileChange(e, 'current')}
            accept=".csv"
            required
          />
          {currentFile && (
            <div className="file-name">
              Selected: {currentFile.name} ({(currentFile.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>

        {(selectedAnalysis === 'drift' || selectedAnalysis === 'health') && (
          <div className="form-group">
            <label className="form-label">Reference Dataset (CSV) *</label>
            <input
              type="file"
              className="file-input"
              onChange={(e) => handleFileChange(e, 'reference')}
              accept=".csv"
              required
            />
            {referenceFile && (
              <div className="file-name">
                Selected: {referenceFile.name} ({(referenceFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Analysis Type</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="analysisType"
                value="profile"
                checked={selectedAnalysis === 'profile'}
                onChange={(e) => setSelectedAnalysis(e.target.value)}
              />
              <span className="radio-label">
                <strong>Dataset Profiling</strong>
                <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>
                  Basic statistics, data types, null rates
                </div>
              </span>
            </label>
            
            <label className="radio-option">
              <input
                type="radio"
                name="analysisType"
                value="anomaly"
                checked={selectedAnalysis === 'anomaly'}
                onChange={(e) => setSelectedAnalysis(e.target.value)}
              />
              <span className="radio-label">
                <strong>Anomaly Detection</strong>
                <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>
                  Outliers detection using IQR/Z-Score
                </div>
              </span>
            </label>
            
            <label className="radio-option">
              <input
                type="radio"
                name="analysisType"
                value="drift"
                checked={selectedAnalysis === 'drift'}
                onChange={(e) => setSelectedAnalysis(e.target.value)}
              />
              <span className="radio-label">
                <strong>Drift Detection</strong>
                <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>
                  Distribution shifts using PSI/KS Test
                </div>
              </span>
            </label>
            
            <label className="radio-option">
              <input
                type="radio"
                name="analysisType"
                value="health"
                checked={selectedAnalysis === 'health'}
                onChange={(e) => setSelectedAnalysis(e.target.value)}
              />
              <span className="radio-label">
                <strong>Full Health Check</strong>
                <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>
                  Comprehensive assessment with health score
                </div>
              </span>
            </label>
          </div>
        </div>

        <div className="btn-group">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!currentFile || (!referenceFile && (selectedAnalysis === 'drift' || selectedAnalysis === 'health'))}
          >
            {selectedAnalysis === 'profile' ? 'Run Profiling' : 
             selectedAnalysis === 'anomaly' ? 'Detect Anomalies' :
             selectedAnalysis === 'drift' ? 'Detect Drift' : 'Run Health Check'}
          </button>
        </div>
      </form>

      <div className="mt-16">
        <h3 className="card-title">API Endpoints & Requirements</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Analysis Type</th>
              <th>API Endpoint</th>
              <th>Required Files</th>
              <th>Backend Schema</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Profiling</strong></td>
              <td><code>POST /api/profile</code></td>
              <td>1 CSV file</td>
              <td>DatasetProfile</td>
            </tr>
            <tr>
              <td><strong>Anomaly Detection</strong></td>
              <td><code>POST /api/anomaly</code></td>
              <td>1 CSV file</td>
              <td>DatasetAnamolyReport</td>
            </tr>
            <tr>
              <td><strong>Drift Detection</strong></td>
              <td><code>POST /api/drift</code></td>
              <td>2 CSV files</td>
              <td>DatasetDriftReport</td>
            </tr>
            <tr>
              <td><strong>Health Check</strong></td>
              <td><code>POST /api/health</code></td>
              <td>2 CSV files</td>
              <td>HealthReport</td>
            </tr>
            <tr>
              <td><strong>Operational Decision</strong></td>
              <td><code>POST /api/operational-decision</code></td>
              <td>2 CSV files</td>
              <td>OperationalHealthReport</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DatasetUpload;