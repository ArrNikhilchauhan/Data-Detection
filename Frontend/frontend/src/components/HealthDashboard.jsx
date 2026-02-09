import React, { useState } from 'react';

function HealthDashboard({ data, onRunDecision, isLoading }) {
  const [isDecisionLoading, setIsDecisionLoading] = useState(false);

  if (!data) {
    return (
      <div className="card">
        <div className="loading">
          <p>Health check not yet performed.</p>
          <p>Run a full health check (requires reference and current datasets) to see comprehensive metrics.</p>
        </div>
      </div>
    );
  }

  const getHealthScoreClass = (score) => {
    if (score >= 90) return 'health-score-healthy';
    if (score >= 70) return 'health-score-warning';
    if (score >= 50) return 'health-score-unhealthy';
    return 'health-score-critical';
  };

  const getHealthStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'healthy': return 'tag-healthy';
      case 'warning': return 'tag-warning';
      case 'unhealthy': return 'tag-unhealthy';
      case 'critical': return 'tag-critical';
      default: return 'tag-none';
    }
  };

  const handleRunDecision = async () => {
    if (onRunDecision) {
      setIsDecisionLoading(true);
      try {
        await onRunDecision();
      } finally {
        setIsDecisionLoading(false);
      }
    }
  };

  const renderScoreTrend = () => {
    if (!data.previous_health_score) return null;
    
    const diff = data.health_score - data.previous_health_score;
    const trend = diff > 0 ? 'improving' : diff < 0 ? 'declining' : 'stable';
    const trendColor = diff > 0 ? '#137333' : diff < 0 ? '#c5221f' : '#5f6368';
    
    return (
      <div className="mt-16">
        <h4 className="card-title">Health Trend Analysis</h4>
        <div className="flex items-center gap-8" style={{ flexWrap: 'wrap' }}>
          <div className="metric-card" style={{ minWidth: '150px' }}>
            <div className="metric-value">{data.previous_health_score}</div>
            <div className="metric-label">Previous Score</div>
          </div>
          <div className="metric-card" style={{ minWidth: '150px' }}>
            <div className="metric-value">{data.health_score}</div>
            <div className="metric-label">Current Score</div>
          </div>
          <div className="metric-card" style={{ minWidth: '150px' }}>
            <div className="metric-value" style={{ color: trendColor }}>
              {diff > 0 ? '+' : ''}{diff}
            </div>
            <div className="metric-label">Change</div>
          </div>
          <div className="metric-card" style={{ minWidth: '150px' }}>
            <div className="metric-value">
              <span style={{ color: trendColor }}>
                {trend.charAt(0).toUpperCase() + trend.slice(1)}
              </span>
            </div>
            <div className="metric-label">Trend</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <h2 className="card-title">Dataset Health Dashboard</h2>
      
      <div className="health-score-container">
        <div className={`health-score ${getHealthScoreClass(data.health_score)}`}>
          {data.health_score}/100
        </div>
        <div className="health-status">
          Status: <span className={`status-tag ${getHealthStatusClass(data.health_status)}`}>
            {data.health_status}
          </span>
        </div>
        <div style={{ color: '#5f6368', marginTop: '8px' }}>
          Dataset: <strong>{data.dataset_name}</strong>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{data.severity_drift_count || 0}</div>
          <div className="metric-label">Severe Drifts</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{data.critical_issues_count || 0}</div>
          <div className="metric-label">Critical Issues</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            {data.previous_health_score !== null && data.previous_health_score !== undefined 
              ? data.previous_health_score 
              : 'N/A'}
          </div>
          <div className="metric-label">Previous Score</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            {new Date().toLocaleDateString()}
          </div>
          <div className="metric-label">Assessment Date</div>
        </div>
      </div>

      {renderScoreTrend()}

      {data.breakdown && data.breakdown.length > 0 && (
        <div className="mt-16">
          <h3 className="card-title">Health Score Breakdown</h3>
          <ul className="score-breakdown">
            {data.breakdown.map((item, index) => {
              // Handle different breakdown formats from API
              const component = item.component || item.metric || `Component ${index + 1}`;
              const score = item.score || item.value || 0;
              const deduction = item.deduction || item.points_lost || 0;
              const details = item.details || item.description || '';
              
              return (
                <li key={index}>
                  <div>
                    <strong>{component}</strong>
                    {details && (
                      <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>
                        {details}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>
                      {score}
                    </div>
                    {deduction > 0 && (
                      <div style={{ fontSize: '12px', color: '#c5221f' }}>
                        -{deduction} points
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Issues Summary */}
      {(data.severity_drift_count > 0 || data.critical_issues_count > 0) && (
        <div className="mt-16">
          <h3 className="card-title">Issues Summary</h3>
          <div className="info-message">
            <div className="flex justify-between" style={{ marginBottom: '8px' }}>
              <span>Severe Drift Columns:</span>
              <strong>{data.severity_drift_count || 0}</strong>
            </div>
            <div className="flex justify-between">
              <span>Critical Issues:</span>
              <strong>{data.critical_issues_count || 0}</strong>
            </div>
          </div>
        </div>
      )}

      <div className="mt-16">
        <h3 className="card-title">Health Assessment Summary</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Health Score Range</th>
              <th>Status</th>
              <th>Data Quality</th>
              <th>Operational Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>90 - 100</td>
              <td><span className="status-tag tag-healthy">Healthy</span></td>
              <td>Excellent quality, minimal issues</td>
              <td>Safe for production use</td>
            </tr>
            <tr>
              <td>70 - 89</td>
              <td><span className="status-tag tag-warning">Warning</span></td>
              <td>Acceptable with minor issues</td>
              <td>Monitor closely, investigate issues</td>
            </tr>
            <tr>
              <td>50 - 69</td>
              <td><span className="status-tag tag-unhealthy">Unhealthy</span></td>
              <td>Significant quality issues</td>
              <td>Requires investigation before production</td>
            </tr>
            <tr>
              <td>0 - 49</td>
              <td><span className="status-tag tag-critical">Critical</span></td>
              <td>Critical quality failures</td>
              <td>Do not use in production pipelines</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="btn-group" style={{ marginTop: '20px' }}>
        <button 
          className="btn btn-primary"
          onClick={handleRunDecision}
          disabled={isLoading || isDecisionLoading}
        >
          {isDecisionLoading ? (
            <>
              <span style={{ marginRight: '8px' }}>⏳</span>
              Generating Decision...
            </>
          ) : (
            'Generate Operational Decision'
          )}
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => window.print()}
        >
          Export Report
        </button>
      </div>

      <div className="mt-16" style={{ fontSize: '12px', color: '#5f6368' }}>
        <p><strong>Note:</strong> Operational decision will analyze current health score, drift patterns, and anomaly rates to recommend pipeline actions.</p>
      </div>
    </div>
  );
}

export default HealthDashboard;