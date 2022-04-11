const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
var LEAGUE_API_KEY = process.env.LEAGUE_API_KEY
module.exports = {
    data: new SlashCommandBuilder()
        .setName('recentleaguematch')
        .setDescription('Finds the most recent match from a given League of Legends account.')
        .addStringOption(option => option.setName('username').setDescription('your league of legends username (oce)').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()
        const puuid = await fetch(`https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${interaction.options.getString('username')}?api_key=${LEAGUE_API_KEY}`);
        const puuidData = await puuid.json();

        const matchid = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuidData.puuid}/ids?start=0&count=10&api_key=${LEAGUE_API_KEY}`)
        const matchIdData = await matchid.json();
        
        const match = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchIdData[0]}?api_key=${LEAGUE_API_KEY}`)
        const matchData = await match.json()
        var arrayLength = matchData.metadata.participants.length
        for (var i = 0; i < arrayLength; i++) {
            if (matchData.metadata.participants[i] === puuidData.puuid) {
                userId = i
            }
        }
        const queue = await fetch(`https://static.developer.riotgames.com/docs/lol/queues.json`)
        const queueData = await queue.json()
        var arrayLength = queueData.length
        for (var t = 0; t < arrayLength; t++) {
            if (queueData[t].queueId === matchData.info.queueId) {
                gameMode = queueData[t].description
                map = queueData[t].map
            }
        }

        const participant = matchData.info.participants[userId]
        if (participant.win === false) {
            var win = 'Game was lost.'
        } else {
            var win = 'Game was won.'
        }
        const matchEmbed = {
            title: `${interaction.options.getString('username')}'s Most Recent Match`,
            thumbnail: {
                url: `http://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/${participant.championName}.png`
            },
            description: `${win} Played on ${map} - ${gameMode.replace(' games', ".")} ${interaction.options.getString('username')} had ${participant.challenges.hadAfkTeammate} AFK teammates.`,
            fields: [
                {
                    name: 'Champion',
                    value: participant.championName,
                    inline: true,
                },
                {
                    name: 'K/D/A',
                    value: `${participant.kills}/${participant.deaths}/${participant.assists}`,
                    inline: true,
                },
                {
                    name: 'Lane',
                    value: participant.lane,
                    inline: true,
                },
                {
                    name: 'Gold Earnt',
                    value: `${participant.goldEarned}`,
                    inline: true,
                },
                {
                    name: 'Game Surrendered?',
                    value: `${participant.gameEndedInSurrender}`,
                    inline: true,
                },
                {
                    name: 'Control Wards Placed/Wards Placed/Wards Killed',
                    value: `${participant.challenges.controlWardsPlaced}/${participant.wardsPlaced}/${participant.wardsKilled}`,
                    inline: true,
                },
                {
                    name: 'Skillshots Dodged/Skillshots Hit',
                    value: `${participant.challenges.skillshotsDodged}/${participant.challenges.skillshotsHit}`,
                    inline: true,
                },
            ]
        }
        await interaction.editReply({ embeds: [matchEmbed]})
        console.log(userId)

    }
}