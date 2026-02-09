import React, { useState } from 'react';

function DriftView({ data }) {
  const [expandedColumn, setExpandedColumn] = useState(null);

  if (!data) {
    return (
      <div className="card">
        <div className="loading">No drift data available</div>
      </div>
    );
  }

  const toggleColumn = (columnName) => {
    setExpandedColumn(expandedColumn === columnName ? null : columnName);
  };

  const getDriftSeverityClass = (driftLevel) => {
    switch(driftLevel?.toLowerCase()) {
      case 'severe': return 'tag-high';
      case 'moderate': return 'tag-medium';
      case 'none': return 'tag-low';
      default: return 'tag-none';
    }
  };

  const getPSIClass = (psi) => {
    if (psi > 0.25) return 'tag-high';
    if (psi > 0.1) return 'tag-medium';
    return 'tag-low';
  };

  const getMethodDescription = (method) => {
    switch(method?.toLowerCase()) {
      case 'psi': return 'Population Stability Index - Measures distribution change';
      case 'ks': return 'Kolmogorov-Smirnov Test - Compares cumulative distributions';
      default: return method;
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Drift Detection Results</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{data.baseline_rows?.toLocaleString() || 'N/A'}</div>
          <div className="metric-label">Reference Rows</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{data.current_rows?.toLocaleString() || 'N/A'}</div>
          <div className="metric-label">Current Rows</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{data.total_columns?.toLocaleString() || 'N/A'}</div>
          <div className="metric-label">Total Columns</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{data.drifted_columns?.toLocaleString() || 'N/A'}</div>
          <div className="metric-label">Drifted Columns</div>
        </div>
      </div>

      <div className="card-section">
        <h3 className="card-title">Drifted Columns</h3>
        {data.drifted_columns === 0 ? (
          <div className="success-message">
            <strong>No Drift Detected:</strong> All columns show stable distributions between reference and current datasets.
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Column Name</th>
                  <th>Detection Method</th>
                  <th>Statistic</th>
                  <th>p-value</th>
                  <th>Drift Detected</th>
                  <th>Drift Level</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {data.column_drifts?.map((col, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td><strong>{col.column_name}</strong></td>
                      <td>
                        <code>{col.method}</code>
                      </td>
                      <td>
                        <span className={`status-tag ${getPSIClass(col.statistic)}`}>
                          {col.statistic?.toFixed(4) || 'N/A'}
                        </span>
                      </td>
                      <td>
                        {col.p_value !== null && col.p_value !== undefined 
                          ? col.p_value.toFixed(4) 
                          : 'N/A'}
                      </td>
                      <td>
                        {col.drift_detected ? (
                          <span className="status-tag tag-high">Yes</span>
                        ) : (
                          <span className="status-tag tag-low">No</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-tag ${getDriftSeverityClass(col.drift_level)}`}>
                          {col.drift_level || 'None'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={() => toggleColumn(col.column_name)}
                        >
                          {expandedColumn === col.column_name ? 'Hide' : 'Show'}
                        </button>
                      </td>
                    </tr>
                    
                    {expandedColumn === col.column_name && (
                      <tr>
                        <td colSpan="7">
                          <div className="expandable-content">
                            <h4>Detailed Analysis: {col.column_name}</h4>
                            <div className="metrics-grid">
                              <div className="metric-card">
                                <div className="metric-value">{col.method}</div>
                                <div className="metric-label">Method</div>
                              </div>
                              <div className="metric-card">
                                <div className="metric-value">{col.statistic?.toFixed(4)}</div>
                                <div className="metric-label">
                                  {col.method === 'psi' ? 'PSI Score' : 'KS Statistic'}
                                </div>
                              </div>
                              {col.p_value !== null && (
                                <div className="metric-card">
                                  <div className="metric-value">{col.p_value.toFixed(4)}</div>
                                  <div className="metric-label">p-value</div>
                                </div>
                              )}
                              <div className="metric-card">
                                <div className="metric-value">
                                  <span className={`status-tag ${getDriftSeverityClass(col.drift_level)}`}>
                                    {col.drift_level}
                                  </span>
                                </div>
                                <div className="metric-label">Drift Level</div>
                              </div>
                            </div>
                            
                            <div className="mt-16">
                              <h5>Interpretation</h5>
                              <table className="data-table">
                                <tbody>
                                  <tr>
                                    <td>Detection Method</td>
                                    <td>{getMethodDescription(col.method)}</td>
                                  </tr>
                                  <tr>
                                    <td>Statistical Significance</td>
                                    <td>
                                      {col.p_value !== null && col.p_value < 0.05 
                                        ? 'Statistically significant (p < 0.05)' 
                                        : 'Not statistically significant'}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Operational Impact</td>
                                    <td>
                                      {col.drift_level === 'severe' 
                                        ? 'High impact - Requires immediate attention' :
                                       col.drift_level === 'moderate' 
                                        ? 'Medium impact - Monitor closely' :
                                       'Low impact - Within acceptable limits'}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-16">
        <h3 className="card-title">Drift Interpretation Guidelines</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>PSI Range</th>
              <th>KS p-value</th>
              <th>Drift Level</th>
              <th>Action Required</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PSI ≤ 0.1</td>
              <td>p ≥ 0.05</td>
              <td><span className="status-tag tag-low">None</span></td>
              <td>No action required. Normal variation.</td>
            </tr>
            <tr>
              <td>0.1 &lt; PSI &le; 0.25</td>
              <td>p &lt; 0.05</td>
              <td><span className="status-tag tag-medium">Moderate</span></td>
              <td>Investigate cause. Monitor future distributions.</td>
            </tr>
            <tr>
              <td>PSI &gt; 0.25</td>
              <td>p &lt; 0.01</td>
              <td><span className="status-tag tag-high">Severe</span></td>
              <td>Immediate investigation. Consider data pipeline issues.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DriftView;