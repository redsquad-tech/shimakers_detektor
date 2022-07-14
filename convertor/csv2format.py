import csv
import datetime
import sys
import uuid

if len(sys.argv) < 4:
    print('Unable to parse arguments')
    print('Right format: ')
    print('python3 csv2format.py [pysec/cve] [path_outfile] [...csv files]')
    sys.exit(1)
     
format = sys.argv[1]
out = sys.argv[2]
csvs = sys.argv[3:]

CLMN_PRODUCT_NAME = 'Название продукта'
CLMN_PROBLEM_TYPE = 'Тип проблемы'
CLMN_COMMIT_REFERENCE = 'Ссылка на commit в репозиторий'
CLMN_TIMESTAMP = 'Отметка времени'
CLMN_DESCRIPTION = 'Комментарий'

def dateFormat(dateString):
    while True:
        dtFormat = (u'%m.%d.%Y %H:%M:%S', u'%d.%m.%Y %H:%M:%S', u'%d.%m.%Y %H:%M', u'%d.%m.%Y')
        for i in dtFormat:
            try:
                return datetime.datetime.strptime(dateString, i).isoformat('T')
            except ValueError:
                continue

        raise Exception('wrong date format')

def writePYSEC(line):
    title = line[CLMN_PRODUCT_NAME]
    if(len(line[CLMN_PRODUCT_NAME].split('/')) > 1):
        print('Couldn`t parse line', file=sys.stderr)
        return
    fileName = f'{out}/{title}.yaml'
    with open(fileName, 'w') as f:
        result=f'''id: {title} \t
summary: {line[CLMN_PROBLEM_TYPE]} \t
details: {line[CLMN_DESCRIPTION]} \t
affected: \t
- package: \t
    name: {title} \t
    ecosystem: PyPI \t
    purl: pkg:pypi/{title} \t
  ranges: \t
  - type: GIT \t
    repo: {line[CLMN_COMMIT_REFERENCE].strip() if CLMN_COMMIT_REFERENCE in line and line[CLMN_COMMIT_REFERENCE].find('git') != -1 else ''} \t
references: \t
- type: WEB \t
  url: {line[CLMN_COMMIT_REFERENCE].strip() if CLMN_COMMIT_REFERENCE in line else ''} \t
modified: "{dateFormat(line[CLMN_TIMESTAMP])}Z"\t
published: "{dateFormat(line[CLMN_TIMESTAMP])}Z"\t
'''

        f.write(result)

def writeCVE(line):
    title = line[CLMN_PRODUCT_NAME]
    if(len(line[CLMN_PRODUCT_NAME].split('/')) > 1):
        print('Couldn`t parse line', file=sys.stderr)
        return
    fileName = f'{out}/{title}.yaml'
    date = dateFormat(line[CLMN_TIMESTAMP]) + 'Z'

    with open(fileName, 'w') as f:
        refs = (f'''  reference:\t
    - {line[CLMN_COMMIT_REFERENCE].strip()}\t
''') if CLMN_COMMIT_REFERENCE in line else ''

        result=f'''id: {title}\t
info: \t
  name: {line[CLMN_PROBLEM_TYPE]}\t
  author: \t
  severity: critical\t
  description: {line[CLMN_DESCRIPTION]}\t
  date: "{date}"\t
  pubdate: "{date}"\t
  package_slug: pypi/{title}\t
{refs}
'''

        f.write(result)

for csvItem in (csvs):
    with open(csvItem, encoding="utf8", newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for line in reader:
            if(len(line[CLMN_PRODUCT_NAME].strip()) == 0):
                print('Couldn`t parse line', file=sys.stderr)
                continue
            if(format == 'pysec'):
                writePYSEC(line)
            elif(format == 'cve'):
                writeCVE(line)
            else: 
                raise Exception('Must be pysec or cve format')      
