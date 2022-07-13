site : table
	cp datasets/result.csv site/public
	cp datasets/raw.csv site/public

table : clear
	node scripts/suspicious_table_creator.js && node scripts/dependencies_table_creator.js
	
clear : 
	rm -f site/public/result.csv
	rm -f site/public/raw.csv
	rm -f datasets/result.csv
	rm -f datasets/result_dependencies.csv


	