import React from 'react';

function OperationalDecision({ data }) {
  if (!data) {
    return (
      <div className="card">
        <div className="loading">
          <p>Operational decision not yet generated.</p>
          <p>Run a health check first to generate operational recommendations.</p>
        </div>
      </div>
    );
  }

  const getActionClass = (action) => {
    switch(action?.toUpperCase()) {
      case 'NO_ACTION': return 'action-no-action';
      case 'MONITOR': return 'action-monitor';
      case 'WARN': return 'action-warn';
      case 'BLOCK_PIPELINE': return 'action-block';
      default: return '';
    }
  };

  const getActionDescription = (action) => {
    switch(action?.toUpperCase()) {
      case 'NO_ACTION':
        return 'The dataset meets all quality standards. Proceed with normal operations.';
      case 'MONITOR':
        return 'Minor issues detected. Proceed but monitor closely for degradation.';
      case 'WARN':
        return 'Significant issues detected. Proceed with caution and investigate root causes.';
      case 'BLOCK_PIPELINE':
        return 'Critical issues detected. Block pipeline execution and investigate immediately.';
      default:
        return action;
    }
  };

  const getSeverityClass = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'high': return 'tag-high';
      case 'medium': return 'tag-medium';
      case 'low': return 'tag-low';
      default: return 'tag-none';
    }
  };

  const getTrendClass = (trend) => {
    switch(trend?.toLowerCase()) {
      case 'improving': return 'tag-low';
      case 'stable': return 'tag-none';
      case 'declining': return 'tag-high';
      default: return 'tag-none';
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Operational Decision Engine</h2>
      
      <div className={`action-card ${getActionClass(data.recommended_action)}`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 style={{ marginBottom: '8px' }}>
              Recommended Action: <strong>{data.recommended_action}</strong>
            </h3>
            <p>{getActionDescription(data.recommended_action)}</p>
          </div>
          <div>
            <span className={`status-tag ${getSeverityClass(data.severity || 'medium')}`}>
              {data.severity || 'Medium'} Severity
            </span>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{data.health_score}</div>
          <div className="metric-label">Health Score</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            <span className={`status-tag ${getHealthStatusClass(data.health_status)}`}>
              {data.health_status}
            </span>
          </div>
          <div className="metric-label">Health Status</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            <span className={`status-tag ${getTrendClass(data.trend)}`}>
              {data.trend || 'Unknown'}
            </span>
          </div>
          <div className="metric-label">Trend</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{data.critical_issues || 0}</div>
          <div className="metric-label">Critical Issues</div>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="card-title">Decision Rationale</h3>
        <div className="info-message">
          <p><strong>Dataset:</strong> {data.dataset_name}</p>
          <p><strong>Health Score:</strong> {data.health_score}/100</p>
          <p><strong>Health Status:</strong> {data.health_status}</p>
          <p><strong>Critical Issues:</strong> {data.critical_issues || 0}</p>
          {data.trend && (
            <p><strong>Trend:</strong> {data.trend}</p>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="card-title">Operational Guidelines</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Recommended Action</th>
              <th>Health Score Range</th>
              <th>Critical Issues</th>
              <th>Required Response</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="status-tag tag-low">NO_ACTION</span></td>
              <td>90 - 100</td>
              <td>0</td>
              <td>Proceed with normal operations</td>
            </tr>
            <tr>
              <td><span className="status-tag tag-medium">MONITOR</span></td>
              <td>70 - 89</td>
              <td>0 - 2</td>
              <td>Continue with increased monitoring</td>
            </tr>
            <tr>
              <td><span className="status-tag tag-high">WARN</span></td>
              <td>50 - 69</td>
              <td>3 - 5</td>
              <td>Investigate and fix issues before next run</td>
            </tr>
            <tr>
              <td><span className="status-tag tag-critical">BLOCK_PIPELINE</span></td>
              <td>0 - 49</td>
              <td>&gt; 5</td>
              <td>Immediate halt and investigation required</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-16">
        <h3 className="card-title">Next Steps</h3>
        <div className="success-message">
          <p><strong>Decision Recorded:</strong> This operational decision has been logged for audit purposes.</p>
          <p style={{ marginTop: '8px', fontSize: '12px' }}>
            Timestamp: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function from HealthDashboard
function getHealthStatusClass(status) {
  switch(status?.toLowerCase()) {
    case 'healthy': return 'tag-healthy';
    case 'warning': return 'tag-warning';
    case 'unhealthy': return 'tag-unhealthy';
    case 'critical': return 'tag-critical';
    default: return 'tag-none';
  }
}

export default OperationalDecision;