const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

async function getNFLData(week, year) {
  const { data } = await axios(
    `https://www.pro-football-reference.com/years/${year}/week_${week}.htm`
  );

  const nflWeekData = [];

  const $ = cheerio.load(data);

  $('div.section_heading', data).each(function () {
    const week = $(this).find('h2:nth-child(1)').text();
    if (week != '' && week != null) {
      nflWeekData.push({ week: week });
    }
  });

  $('table.teams', data).each(function () {
    const date = $(this).find('tr.date').text();
    const winningTeam = $(this).find('tr.winner > td:nth-child(1)').text();
    const winningTeamScore = $(this).find('tr.winner > td:nth-child(2)').text();
    const winningTeamStatPage = `https://www.pro-football-reference.com${$(this)
      .find('a')
      .attr('href')}`;
    const losingTeam = $(this).find('tr.loser > td:nth-child(1)').text();
    const losingTeamScore = $(this).find('tr.loser > td:nth-child(2)').text();
    const losingTeamStatPage = `https://www.pro-football-reference.com${$(this)
      .find('tr.loser > td > a')
      .attr('href')}`;
    const gameLink = `https://www.pro-football-reference.com${$(this)
      .find('td.gamelink > a')
      .attr('href')}`;

    nflWeekData.push({
      date,
      winningTeam,
      winningTeamScore,
      losingTeam,
      losingTeamScore,
      winningTeamStatPage,
      losingTeamStatPage,
      gameLink,
    });
  });

  writeFile(nflWeekData);

  console.log(nflWeekData);
}

function writeFile(data) {
  fs.writeFile(`./stats/stats.json`, JSON.stringify(data), (err) => {
    // change ./stats/stats.json to whatever you want :)!
    if (err) {
      return console.error(err);
    } else console.log(`written correctly`);
  });
}

getNFLData(5, 2021);
