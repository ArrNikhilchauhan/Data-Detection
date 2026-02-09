from sqlalchemy import text
import uuid

def healthreport(db,health_report,prev_score):
    query=text("""insert into health_report (id,dataset_name,health_score,status,drift_count,issue_count,previous_score) values(:id,:name,:score,:status,:d_count,:i_count,:prev_score)""")

    db.execute(query,{'id':uuid.uuid4(),'name':health_report.dataset_name,'score':health_report.health_score,'status':health_report.health_status,'d_count':health_report.severity_drift_count,'i_count':health_report.critical_issues_count,'prev_score':prev_score})
    db.commit()

def operation(db,action):
    query=text("""insert into operational (id,dataset_name,health_score,status,trend,issues,recommend_action) values(:id,:name,:score,:status,:trend,:issues,:recommend_action)""")

    db.execute(query,{'id':uuid.uuid4(),'name':action.dataset_name,'score':action.health_score,'status':action.health_status,'trend':action.trend,'issues':action.critical_issues,'recommend_action':action.recommended_action})
    db.commit()

