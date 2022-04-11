const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const ValorantAPI = require("unofficial-valorant-api")
const queryString = require('query-string');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recentvalorantmatch')
        .setDescription('Finds the most recent match from a given Valorant account.')
        .addStringOption(option => option.setName('user').setDescription('First part of your valorant user').setRequired(true))
        .addStringOption(option => option.setName('tag').setDescription('Valorant account tag').setRequired(true)),
    async execute(interaction) {
        await interaction.reply('check console')
        
        const queryName = encodeURIComponent(interaction.options.getString('user'))
        const queryTag = encodeURIComponent(interaction.options.getString('tag'))
        const account = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${queryName}/${queryTag}`);
        const accountData = await account.json();


        if (accountData.status !== 200) {
            console.log(accountData.status)
            console.log(queryName + '#' + queryTag)
            await interaction.editReply('Recieved error - status' + ' ' + accountData.status + ' - ' + accountData.message)
        } else {
            const match = await fetch(`https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/${accountData.data.region}/${accountData.data.puuid}`);
            const matchData = await match.json();

            var arrayLength = matchData.data.players.all_players.length
            for (var t = 0; t < arrayLength; t++) {
                if (matchData.data.players.all_players === accountData.data.puuid) {
                    arraynum = t
                }
            }

            const rankEmbed = {
                title: `${accountData.data.name}#${accountData.data.tag}'s most recent match`,
                thumbnail: {
                    url: matchData.data[0].players.all_players[arraynum].assets.agent.small
                },
                description: `Game played on ${matchData.data[0].map} at ${matchData.data[0].metadata.game_start_patched}. ${matchData[0].data.metadata.rounds_played} rounds were played.`,
                fields: [
                    {
                        title: 'Score',
                        value: matchData.data[0].players.all_players[arraynum].stats.score
                    },
                    {
                        title: 'Kills',
                        value: matchData.data[0].players.all_players[arraynum].stats.kills
                    },
                    {
                        title: 'Deaths',
                        value: matchData.data[0].players.all_players[arraynum].stats.deaths
                    },
                    {
                        title: 'Assists',
                        value: matchData.data[0].players.all_players[arraynum].stats.assists
                    },
                ],
                timestamp: new Date()
            }  
            await interaction.editReply({ embeds: [rankEmbed] })
        }
        

    }
}