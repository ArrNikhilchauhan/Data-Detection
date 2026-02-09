from app.runner.anamoly_runner import anamoly_report
from app.runner.drift_runner import drift_runner
from app.runner.profile_runner import profile_dataframe
from app.schema.health import HealthReport
import pandas as pd


def health_runner(profile,anamoly,drift,dataset_name,previous_score):
    health_score=100
    severity_drift_count=0
    critical_issue_count=0


    issue_summary=[]
    anamoly_effect=0
    for col in anamoly.column_anamolies:
        if col.anamoly_rate>0.01:
            anamoly_effect+=5

        elif col.anamoly_rate>0.05:
            anamoly_effect+=10

        else:
            critical_issue_count+=1
            anamoly_effect+=30

    anamoly_effect=min(anamoly_effect,30)
    issue_summary.append({
        'source':"Anamoly",
        'reason':"Anamoly rate is too high",
        'score_deducted':anamoly_effect,
    })
    health_score-=anamoly_effect

    drift_effect=0

    for col in drift.column_drifts:
        if col.method=="psi" and col.drift_level=="moderate":
            drift_effect+=10

        elif col.method=="psi" and col.drift_level=="severe":
            severity_drift_count+=1
            critical_issue_count+=1
            drift_effect+=20

    drift_effect=min(drift_effect,30)
    issue_summary.append({
        'source':"Drift",
        'reason':"features are drifted",
        'score_deducted':drift_effect,
    })
    health_score-=drift_effect

    profile_effect=0
    for col in profile.columns:
        if col.null_rate>0.3:
            profile_effect+=5
        elif col.null_rate>0.5:
            profile_effect+=10
        else:
            critical_issue_count+=1
            profile_effect+=30

    profile_effect=min(profile_effect,30)
    issue_summary.append({
        'source':"Profile",
        'reason':"Null rate is too high",
        'score_deducted':profile_effect,
    })

    health_score-=profile_effect

    if health_score>=80:
        status="Healthy"
    elif health_score>=60:
        status="Warning"
    elif health_score>=40:
        status="Unhealthy"
    else:
        status="Critical"

    


    return HealthReport(
        dataset_name=dataset_name,
        health_score=health_score,
        health_status=status,
        breakdown=issue_summary,
        severity_drift_count=severity_drift_count,
        critical_issues_count=critical_issue_count,
        previous_health_score=previous_score
    )
