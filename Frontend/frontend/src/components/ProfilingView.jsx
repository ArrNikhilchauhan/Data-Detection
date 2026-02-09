import React, { useState } from 'react';

function ProfilingView({ data }) {
  const [expandedColumn, setExpandedColumn] = useState(null);

  if (!data) {
    return (
      <div className="card">
        <div className="loading">No profiling data available</div>
      </div>
    );
  }

  const toggleColumn = (columnName) => {
    setExpandedColumn(expandedColumn === columnName ? null : columnName);
  };

  const getNullRateClass = (rate) => {
    if (!rate) return 'tag-none';
    if (rate > 0.2) return 'tag-high';
    if (rate > 0.05) return 'tag-medium';
    return 'tag-low';
  };

  const getUniquenessClass = (uniqueCount, totalRows) => {
    if (!uniqueCount) return 'tag-none';
    const uniqueness = uniqueCount / totalRows;
    if (uniqueness < 0.01) return 'tag-high';
    if (uniqueness < 0.1) return 'tag-medium';
    return 'tag-low';
  };

  return (
    <div className="card">
      <h2 className="card-title">Dataset Profiling Results</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{data.row_count?.toLocaleString() || 'N/A'}</div>
          <div className="metric-label">Total Rows</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{data.column_count?.toLocaleString() || 'N/A'}</div>
          <div className="metric-label">Total Columns</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            {data.dataset_name || 'Unnamed Dataset'}
          </div>
          <div className="metric-label">Dataset Name</div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Column Name</th>
              <th>Data Type</th>
              <th>Null Rate</th>
              <th>Unique Values</th>
              <th>Mean</th>
              <th>Std Dev</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.columns?.map((col) => (
              <React.Fragment key={col.column_name}>
                <tr>
                  <td><strong>{col.column_name}</strong></td>
                  <td>
                    <span className="status-tag tag-none">{col.dtype}</span>
                  </td>
                  <td>
                    <span className={`status-tag ${getNullRateClass(col.null_rate)}`}>
                      {col.null_rate ? `${(col.null_rate * 100).toFixed(1)}%` : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-tag ${getUniquenessClass(col.unique_count, data.row_count)}`}>
                      {col.unique_count?.toLocaleString() || 'N/A'}
                    </span>
                  </td>
                  <td>{col.mean?.toFixed(2) || 'N/A'}</td>
                  <td>{col.std?.toFixed(2) || 'N/A'}</td>
                  <td>
                    <button 
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      onClick={() => toggleColumn(col.column_name)}
                    >
                      {expandedColumn === col.column_name ? 'Hide Details' : 'Show Details'}
                    </button>
                  </td>
                </tr>
                
                {expandedColumn === col.column_name && (
                  <tr>
                    <td colSpan="7">
                      <div className="expandable-content">
                        <h4>Detailed Statistics: {col.column_name}</h4>
                        <div className="metrics-grid">
                          <div className="metric-card">
                            <div className="metric-value">{col.min?.toFixed(2) || 'N/A'}</div>
                            <div className="metric-label">Minimum</div>
                          </div>
                          <div className="metric-card">
                            <div className="metric-value">{col.max?.toFixed(2) || 'N/A'}</div>
                            <div className="metric-label">Maximum</div>
                          </div>
                          <div className="metric-card">
                            <div className="metric-value">{col.mean?.toFixed(2) || 'N/A'}</div>
                            <div className="metric-label">Mean</div>
                          </div>
                          <div className="metric-card">
                            <div className="metric-value">{col.std?.toFixed(2) || 'N/A'}</div>
                            <div className="metric-label">Std Deviation</div>
                          </div>
                        </div>
                        
                        {col.null_rate !== undefined && (
                          <div className="mt-16">
                            <h5>Data Quality Indicators</h5>
                            <table className="data-table">
                              <tbody>
                                <tr>
                                  <td>Null Rate</td>
                                  <td>{(col.null_rate * 100).toFixed(2)}%</td>
                                  <td>
                                    {col.null_rate > 0.2 ? 'Critical - Requires attention' :
                                     col.null_rate > 0.05 ? 'Warning - Monitor closely' :
                                     'Good - Within acceptable limits'}
                                  </td>
                                </tr>
                                {col.unique_count !== undefined && (
                                  <tr>
                                    <td>Uniqueness</td>
                                    <td>{((col.unique_count / data.row_count) * 100).toFixed(2)}%</td>
                                    <td>
                                      {col.unique_count / data.row_count < 0.01 ? 'Low diversity' :
                                       col.unique_count / data.row_count < 0.1 ? 'Moderate diversity' :
                                       'High diversity'}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-16">
        <h3 className="card-title">Data Quality Guidelines</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Good</th>
              <th>Warning</th>
              <th>Critical</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Null Rate</strong></td>
              <td>&lt; 5%</td>
              <td>5% - 20%</td>
              <td>&gt; 20%</td>
            </tr>
            <tr>
              <td><strong>Uniqueness</strong></td>
              <td>&gt; 10%</td>
              <td>1% - 10%</td>
              <td>&lt; 1%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfilingView;