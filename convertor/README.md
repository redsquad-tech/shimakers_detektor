# csv2format.py 

parser csv files to pysec or cve-format 

## USAGE

##### 1. Download csv files from https://docs.google.com/spreadsheets/d/1H3xPB4PgWeFcHjZ7NOPtrcya_Ua4jUolWm-7z9-jSpQ/htmlview# 
##### 2. Put them into folder and build path`s string (e.g. './csv/1.csv' './csv/2.csv' './csv/3.csv')
##### 2.1 Prepare csv-files columns like this ['Название продукта', 'Тип проблемы', 'Ссылка на commit в репозиторий', 'Отметка времени', 'Комментарий' ]
##### 2.2 Delete strings under tables in csv-files
##### 3. Prepare folder for new CVE-files OR PYSEC-files (e.g. './PYSEC/')

##### 4. Run in terminal
### e.g. PYSEC files 
```python
python3 csv2format.py pysec './PYSEC/' './csv/1.csv' './csv/2.csv' './csv/3.csv' './csv/4.csv' './csv/5.csv' './csv/6.csv' './csv/7.csv'
```

### e.g. CVE files 
```python
python3 csv2format.py cve './CVE/' './csv/1.csv' './csv/2.csv' './csv/3.csv' './csv/4.csv' './csv/5.csv' './csv/6.csv' './csv/7.csv'
```
