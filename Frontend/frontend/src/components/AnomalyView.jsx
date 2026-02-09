import React from 'react';

function AnomalyView({ data }) {
  if (!data) {
    return (
      <div className="card">
        <div className="loading">No anomaly data available</div>
      </div>
    );
  }

  const getSeverityClass = (rate) => {
    if (rate > 0.1) return 'tag-high';
    if (rate > 0.05) return 'tag-medium';
    return 'tag-low';
  };

  const getMethodDescription = (method) => {
    switch(method?.toLowerCase()) {
      case 'iqr': return 'Interquartile Range (Q3 + 1.5*IQR or Q1 - 1.5*IQR)';
      case 'z-score': return 'Z-Score (values beyond ±3 standard deviations)';
      default: return method;
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Anomaly Detection Results</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{data.rows_count?.toLocaleString() || 'N/A'}</div>
          <div className="metric-label">Total Rows</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{data.column_count?.toLocaleString() || 'N/A'}</div>
          <div className="metric-label">Total Columns</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{data.anamolies_column?.toLocaleString() || 'N/A'}</div>
          <div className="metric-label">Columns with Anomalies</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{data.dataset_name || 'Unnamed Dataset'}</div>
          <div className="metric-label">Dataset Name</div>
        </div>
      </div>

      <div className="card-section">
        <h3 className="card-title">Column-Level Anomalies</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Column Name</th>
                <th>Detection Method</th>
                <th>Anomaly Count</th>
                <th>Anomaly Rate</th>
                <th>Threshold</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {data.column_anamolies?.map((col, index) => (
                <tr key={index}>
                  <td><strong>{col.column_name}</strong></td>
                  <td>
                    <code>{col.method}</code>
                  </td>
                  <td>{col.anamoly_count?.toLocaleString() || 'N/A'}</td>
                  <td>
                    <span className={`status-tag ${getSeverityClass(col.anamoly_rate)}`}>
                      {col.anamoly_rate ? `${(col.anamoly_rate * 100).toFixed(2)}%` : 'N/A'}
                    </span>
                  </td>
                  <td>{col.threshold?.toFixed(2) || 'N/A'}</td>
                  <td>
                    <span className={`status-tag ${getSeverityClass(col.anamoly_rate)}`}>
                      {col.anamoly_rate > 0.1 ? 'High' : 
                       col.anamoly_rate > 0.05 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="card-title">Detection Methodology</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <h4>IQR Method</h4>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>
              Identifies outliers as values below Q1 - 1.5*IQR or above Q3 + 1.5*IQR.
              Robust to non-normal distributions.
            </p>
          </div>
          <div className="metric-card">
            <h4>Z-Score Method</h4>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>
              Identifies outliers as values beyond ±3 standard deviations from the mean.
              Best for normal distributions.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="card-title">Severity Classification</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Anomaly Rate</th>
              <th>Severity</th>
              <th>Action Required</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&lt; 5%</td>
              <td><span className="status-tag tag-low">Low</span></td>
              <td>No immediate action. Routine monitoring.</td>
            </tr>
            <tr>
              <td>5% - 10%</td>
              <td><span className="status-tag tag-medium">Medium</span></td>
              <td>Investigate cause. Monitor closely.</td>
            </tr>
            <tr>
              <td>&gt; 10%</td>
              <td><span className="status-tag tag-high">High</span></td>
              <td>Immediate investigation required. Consider data pipeline issues.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnomalyView;