site : table
	cp datasets/result.csv docs/_data
	cp datasets/raw.csv docs/static

table : clear
	node index.js --main && node index.js --social
	
clear : 
	rm -f docs/_data/result.csv
	rm -f datasets/result.csv
	rm -f docs/static/raw.csv
	touch datasets/result.csv



	