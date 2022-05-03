site : table
	cp datasets/result.csv docs/_data

table : clear
	node index.js
	
clear : 
	rm -f docs/_data/result.csv
	rm -f datasets/result.csv
	touch datasets/result.csv



	