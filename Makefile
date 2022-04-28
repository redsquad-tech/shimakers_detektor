docs/_data/result.csv : datasets/result.csv
	cp datasets/result.csv docs/_data

datasets/result.csv : index.js
	node index.js
