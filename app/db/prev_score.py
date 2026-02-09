from sqlalchemy import text

def prev_score(db,dataset_name):
    query=text("select health_score from health_report where dataset_name=:name order by created_at desc limit 1")

    result=db.execute(query,{'name':dataset_name})

    return None if result is None else result.scalar()