import React from "react";
import { useFetch } from "./hooks/useFetch";
import Plot from 'react-plotly.js';
// https://observablehq.com/@jermspeaks/async-await

const About = () => {
  return (
    <div>
      <h2>About the Dataset</h2>
      <p>
        This dataset contains information about Internet use across different countries. 
        In addition to Internet usage numbers, it provides statistics about the size of countries' 
        urban populations and average incomes. These unique values for each country can help with 
        understanding the reasons for widespread Internet access (or lack thereof).
      </p>
    </div>
  )
}

const Questions = () => {
  return (
    <div>
      <h2>Questions</h2>
      <p>Q1: What is the ranking of continents' average Internet Use rate?</p>
      <p>My prediction: North America, Europe, Asia, Australia, South America, Africa</p>
      <p>Q2: What is the correlation (if any) between income per person and Internet Use rate?</p>
      <p>My prediction: a strong positive correlation -- high incomes per person will be closely associated with Internet use rate.</p>
      <p>Q3: What is the correlation (if any) between Internet Use rate and urban rate?</p>
      <p>My prediction: a moderate positive correlation -- high Internet use rates will be connected with high urban rates.</p>
      <p>Q4: What is the correlation (if any) between income per person and urban rate?</p>
      <p>My prediction: a strong positive correlation -- high incomes per person will be closely linked with high urban rates.</p>
    </div>
  )
}

const VariablesExplained = () => {
  return (
    <div>
      <h2>Variables in Original Data Source</h2>
      <p>Each of the variables described below are columns in the CSV data file.</p>
      <p>Country: the country for which data is measured (also serves as the unique id for each row).</p>
      <p>Income Per Person: the GDP per capita (standardized across currencies).</p>
      <p>Internet Use Rate: number of individuals per 100 people with access to the Internet.</p>
      <p>Urban Rate: percent of population living in urban areas.</p>
    </div>
  )
}

const DataQualityIssues = () => {
  return (
    <div>
      <h2>Data Quality Issues</h2>
      <p>1: Some country names have quotes around them, and others do not. Some country names have words like "Democratic" and "Republic" abbreviated.
      This became an obstacle when running a Python script to get the continent for each country as part of the data transformation.
      </p>
      <p>2: Some rows have a missing income per person, internet use rate, or urban rate value. Some have all three values missing.
        This makes it hard for a country to be involved in answering all four questions of interest.
      </p>
    </div>
  )
}

const PostAnalysisWriteup = () => {
  return (
    <div>
      <h2>Post Analysis Writeup</h2>
      <h3>Questions</h3>
      <p>Please see the top of the webpage.</p>
      <h3>Analysis Process</h3>
      <p>
        For my first four visualizations, I chose to look closely at distributions of the three main numeric variables.
        This is because I wanted to identify whether each variable is evenly spread out or skewed in any direction, so I could be more prepared for when I answer my four questions.
        I also wanted to see whether there are any outliers for each variable that may affect the answers to my questions.
        For my second four visualizations, I focused on three correlations (between the three main numeric variables). 
        This is because I was looking to see whether one of the variables depend on the other, and whether striving to increase one in the real world would help increase the other. 
        For example, I was curious about the correlation between Internet use rates and income per person because I was wondering if income per person could go up if we make Internet more accessible in a country. 
        I chose my fourth question and visualization to be about continents because I was wondering how Internet access varies across the major regions of the world.
      </p>
      <h3>Data Transformations</h3>
      <p>
        The first data transformation I did was adding continents as a new column to the dataset. 
        I did this with a Python script via library that, given a country name, returns the continent it is in.
        I read each row from the original CSV into its own JSON, added a new key-value pair to store the continent, and then wrote these JSONs back to a new CSV.
        The second data transformation was removing rows where all three numeric variables (income per person, Internet use rate, urban rate) are missing.
        The code I used can be found in the transformation.py file in the root of this project's Github repository.
      </p>
      <h3>Lessons Learned</h3>
      <p>
        The main lesson I learned is that datasets like this can disprove many assumptions that may seem correct.
        I recognized this when my hypotheses for all four questions were proven wrong.
        Another lesson I learned is to explore the project-critical variables more deeply. 
        In the case of this assignment, Internet use rate is the most important variable since it is the main subject of the dataset.
        This is why I explored this variable with both a histogram and a box and whisker plot.
        A final lesson I learned is to think critically about using the right visualization for a particular kind of visualization.
        For example, in order to look at correlations, I used a scatterplot to be able to see what happens to variable y as variable x increases.
      </p>
    </div>
  )
}

const getVariable = (data, variable) => {
  values = [];
  for(let i = 0; i < data.length; i++) { 
    values.push(data[i][variable]);
  }
  return values;
}

const getContinentAverages = (data) => {
  let continents = {
    'North America': [0, 0], 'South America': [0, 0], 'Asia': [0, 0],
    'Australia': [0, 0], 'Africa': [0, 0], 'Europe': [0, 0]
  };
  for(let i = 0; i < data.length; i++) {
    if(data[i]['internetuserate'] != "") {
      let values = continents[data[i]['continent']];
      values[0] += parseFloat(data[i]['internetuserate']);
      values[1] += 1;
      continents[data[i]['continent']] = values;
    }
  }
  for(let continent in continents) {
    continents[continent] = continents[continent][0] / continents[continent][1];
  }
  return [Object.keys(continents), Object.values(continents)];
}

const App = () => {
  internet_url = "https://gist.githubusercontent.com/rishikavikondala/5e3d9dc3134dc7670198437a475ed647/raw/f066507655a95757501e1b0aa2e06bdc8f396934/internet.csv"
  const [data, loading] = useFetch(internet_url);
  let incomePerPerson = getVariable(data, "incomeperperson");
  console.log(incomePerPerson);
  let internetUseRate = getVariable(data, "internetuserate");
  console.log(internetUseRate);
  let urbanRate = getVariable(data, "urbanrate");
  let continentsAndAverages = getContinentAverages(data);
  return (
    <div>
      <h1>INFO 474 Sp21 Assignment 2: Exploratory Data Analysis</h1>
      <About />
      <Questions />
      <VariablesExplained />
      <DataQualityIssues />
      <p>{loading && "Loading data!"}</p>
      <h2>8 Data Visualizations</h2>
      <h3>First Four: understanding the distributions of the three numeric variables</h3>
      <p>Visualization 1 -- Distribution of Income Per Person</p>
      <Plot
        data={[{
          x: incomePerPerson, type: 'histogram', marker: {color: 'grey'},
        },]}
        layout={{
          width: 750, height: 750, title: 'Distribution of Income Per Person',
          xaxis: { title: 'Income Per Person (Ranges)' },
          yaxis: { title: 'Frequency' },
        }}
      />
      <p>
        The distribution of income per person is heavily skewed right. 
        It shows that the majority of countries (114 total) are in the lowest income bracket.
        On the other extreme, only four countries total have incomes per person greater than 40K.
        These countries are: Monaco, Liechtenstein, Bermuda, and Luxemborg. 
        It is interesting to note that three of these four countries are in Europe.
      </p>
      <p>Visualization 2 -- Distribution of Internet Use Rate</p>
      <Plot
        data={[{
          x: internetUseRate, type: 'histogram', marker: {color: 'grey'},
        },]}
        layout={{
          width: 750, height: 750, title: 'Distribution of Internet Use Rate',
          xaxis: { title: 'Internet Use Rate (Ranges)' },
          yaxis: { title: 'Frequency' },
        }}
      />
      <p>
        The distribution of Internet use rate is skewed right, but not as heavily as income per person.
        The four rightmost brackets have fewer countries than the entire leftmost bracket.
        This shows that Internet is still not an equally accessible resource across the world.
      </p>
      <p>Visualization 3 -- Distribution of Urban Rate</p>
      <Plot
        data={[{
          x: urbanRate, type: 'histogram', marker: {color: 'grey'},
        },]}
        layout={{
          width: 750, height: 750, title: 'Distribution of Urban Rate',
          xaxis: { title: 'Urban Rate (Ranges)' },
          yaxis: { title: 'Frequency' },
        }}
      />
      <p>
        The distribution of urban rate has the high-level shape of a normal distribution. 
        The bracket with the highest number of countries is 65 - 74.99. 
        In other words, 33 countries have 65% - 74.99% of their population living in urban areas.
        This is interesting because even though many people seem to be living in urban areas across countries, Internet access is still very inaccessible across the globe.
      </p>
      <p>Visualization 4 -- Further Examination of Distribution of Internet Use Rate</p>
      <Plot
        data={[{
          y: internetUseRate, type: 'box', marker: {color: 'grey'},
        },]}
        layout={{
          width: 750, height: 750, title: 'Distribution of Internet Use Rate',
          yaxis: { title: 'Internet Use Rate' },
        }}
      />
      <p>
        The purpose of a second visualization to look at Internet Use Rate's distribution is to look at outliers and the range of the data at hand.
        It looks like the country with the lowest Internet use rate (Democratic Republic of the Congo) is much closer to the median rate than the country with the highest rate (Iceland).
        This further demonstrates that many countries are more skewed towards having lower Internet access.
        In addition, the whole dataset is intended to provide insights into Internet use rate, so it made sense to examine this variable more closely.
      </p>
      <h3>Second Four: answering the questions of interest</h3>
      <p>Visualization 5 -- Q1: What is the ranking of continents' average Internet Use rate?</p>
      <p>
        Answer: Based on this visualization, the ranking is: Europe, North America, South America, Asia, Australia, Africa. 
        The most eye-catching takeaway from this visualization is the glaring gap between Europe's and Africa's averages. 
        This shows how much work needs to be done to build the right infrastructure for global Internet access.
      </p>
      <Plot
        data={[{
          x: continentsAndAverages[0], y: continentsAndAverages[1], type: 'bar', marker: {color: 'grey'},
        },]}
        layout={{
          width: 750, height: 750, title: 'Internet Use Rate Per Continent',
          xaxis: { title: 'Continent' },
          yaxis: { title: 'Internet Use Rate' },
        }}
      />
      <p>Visualization 6 -- Q2: What is the correlation (if any) between income per person and Internet use rate?</p>
      <p>
        Answer: there is a weak positive correlation between income per person and Internet use rate.
        I investigated the data further and found that correlation coefficient for these variables is 0.11427617253919847.
        A coefficient of 0 would mean no correlation at all, so this indicates that the correlation is weak.
        This comes as a surprise to me because I thought that countries where people make more would have higher Internet use rates, 
        since the population is more financially capable of getting network access.
      </p>
      <Plot
        data={[{
          x: internetUseRate, y: incomePerPerson, type: 'scatter', mode: 'markers', marker: {color: 'grey'},
        },]}
        layout={{
          width: 750, height: 750, title: 'Income Per Person vs. Internet Use Rate',
          xaxis: { title: 'Internet Use Rate' },
          yaxis: { title: 'Income Per Person' },
        }}
      />
      <p>Visualization 7 -- Q3: What is the correlation (if any) between Internet use rate and urban rate?</p>
      <p>
        Answer: Based on this visualization, there is postive correlation that is weak but somewhat moderate between Internet use rate and urban rate.
        Upon further investigation I found that the correlation coefficient for these variables is 0.2743278610760442.
        This is a much weaker correlation than I expected. 
        I initially thought that urban areas are more developed and therefore will have better Internet infrastructure; 
        however, there isn't a strong connection between the two variables.
      </p>
      <Plot
        data={[{
          x: internetUseRate, y: urbanRate, type: 'scatter', mode: 'markers', marker: {color: 'grey'},
        },]}
        layout={{
          width: 750, height: 750, title: 'Urban Rate vs. Internet Use Rate',
          xaxis: { title: 'Internet Use Rate' },
          yaxis: { title: 'Urban Rate' },
        }}
      />
      <p>Visualization 8 -- Q4: What is the correlation (if any) between income per person and urban rate?</p>
      <p>Answer: Based on this visualization, there is an incredibly weak negative correlation between income per person and urban rate.
        After investigating the data further, I calculated the correlation coefficient to be -0.05746834566071625.
        A coefficient of 0 means there is no correlation whatsoever, so these two variables are very close to having no relation at all.
        A negative correlation means that as one variable increases, the other decreases. 
        In the context of this visualization, a negative correlation (albeit a very weak one) means that as income per person increases, urban rate decreases.
        This makes some sense after giving it some thought, since many urban areas are also home to low-income populations.
      </p>
      <Plot
        data={[{
          x: urbanRate, y: incomePerPerson, type: 'scatter', mode: 'markers', marker: {color: 'grey'},
        },]}
        layout={{
          width: 750, height: 750, title: 'Income Per Person vs. Urban Rate',
          xaxis: { title: 'Urban Rate' },
          yaxis: { title: 'Income Per Person' },
        }}
      />
      <PostAnalysisWriteup />
    </div>
  );
};

export default App;