import csv
import pycountry_convert as pc
import pandas as pd

def read_file(path):
  data = []
  with open(path) as file:
    reader = csv.reader(file, delimiter=',')
    next(reader)
    for row in reader:
      data.append({
        "country": row[0],
        "incomeperperson": row[1],
        "internetuserate": row[2],
        "urbanrate": row[3]
      })
  return data

def write_file(data):
  with open('internet_transformed.csv', mode='w') as file:
    writer = csv.writer(file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    writer.writerow(['country', 'incomeperperson', 'internetuserate', 'urbanrate', 'continent'])
    for point in data:
      if point["country"] != "" and point["incomeperperson"] != "" and point["internetuserate"] != "" and point["urbanrate"] != "":
        writer.writerow([
          point['country'], 
          point['incomeperperson'], 
          point['internetuserate'], 
          point['urbanrate'],
          point['continent']
        ])

def get_variable(data, variable):
  points = []
  for point in data:
    if point[variable] != "":
      points.append(float(point[variable]));
  return points;

def main():
  data = read_file('internet.csv')
  incomeperperson = pd.Series(get_variable(data, "incomeperperson"))
  internetuserate = pd.Series(get_variable(data, "internetuserate"))
  urbanrate = pd.Series(get_variable(data, "urbanrate"))

  incomeperperson_vs_internetuserate = internetuserate.corr(incomeperperson)
  urbanrate_vs_internetuserate = internetuserate.corr(urbanrate)
  urbanrate_vs_incomeperperson = incomeperperson.corr(urbanrate)

  print(incomeperperson_vs_internetuserate)
  print(urbanrate_vs_internetuserate)
  print(urbanrate_vs_incomeperperson)

  continents = {
    'NA': 'North America',
    'SA': 'South America', 
    'AS': 'Asia',
    'OC': 'Australia',
    'AF': 'Africa',
    'EU': 'Europe'
  }
  for point in data:
    country_code = pc.country_name_to_country_alpha2(point['country'], cn_name_format="default")
    continent_code = pc.country_alpha2_to_continent_code(country_code)
    point['continent'] = continents[continent_code]
  write_file(data)

if __name__ == "__main__":
    main()
    