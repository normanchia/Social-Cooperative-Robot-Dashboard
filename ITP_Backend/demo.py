import pymssql
import pandas as pd
from credential import username,password

server = 'se-team10-server.database.windows.net'
database = 'SE_Team10_DB'
port = '1433'
conn = pymssql.connect(server=server, user=username, password=password, database=database, port=port)

sql = '''
SELECT *
FROM dbo.[Location]
'''

cursor = conn.cursor()
cursor.execute(sql)

dataset = cursor.fetchall()
columns = [column[0] for column in cursor.description]

df = pd.DataFrame(dataset, columns=columns)
print(df)