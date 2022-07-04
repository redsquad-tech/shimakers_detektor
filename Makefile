site : table
	cp datasets/result.csv docs/_data
	cp datasets/raw.csv docs/static

table : clear
	node scripts/suspicious_table_creator.js && node scripts/dependancies_table_creator.js
	
clear : 
	rm -f docs/_data/result.csv
	rm -f datasets/result.csv
	rm -f docs/static/raw.csv
	touch datasets/result.csv



	