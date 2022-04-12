const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const ValorantAPI = require("unofficial-valorant-api")
const queryString = require('query-string');
const { trimResultTransformer } = require('common-tags/lib');

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
            await interaction.editReply({content: 'Recieved error - status' + ' ' + accountData.status + ' - ' + accountData.message, ephemeral: true})
        } else {
            const match = await fetch(`https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/${accountData.data.region}/${accountData.data.puuid}`);
            const matchData = await match.json();

            var arrayLength = matchData.data[0].players.all_players.length
            for (var t = 0; t < arrayLength; t++) {
                if (matchData.data[0].players.all_players[t].puuid === accountData.data.puuid) {
                    arraynum = t
                }
            }

            var acs = matchData.data[0].players.all_players[arraynum].stats.score / matchData.data[0].metadata.rounds_played
            acs = Math.round(acs);
            const teamsEmbed = {
                title: `${accountData.data.name}#${accountData.data.tag}'s most recent match - general`,
                thumbnail: {
                    url: matchData.data[0].players.all_players[arraynum].assets.card.small
                },
                fields: [
                    {
                        name: 'Red Team',
                        value: `${matchData.data[0].players.red[0].name}#${matchData.data[0].players.red[0].tag}, ${matchData.data[0].players.red[1].name}#${matchData.data[0].players.red[1].tag}, ${matchData.data[0].players.red[2].name}#${matchData.data[0].players.red[2].tag}, ${matchData.data[0].players.red[3].name}#${matchData.data[0].players.red[3].tag}, ${matchData.data[0].players.red[4].name}#${matchData.data[0].players.red[4].tag}`,
                        
                    },
                    {
                        name: 'Blue Team',
                        value: `${matchData.data[0].players.blue[0].name}#${matchData.data[0].players.blue[0].tag}, ${matchData.data[0].players.blue[1].name}#${matchData.data[0].players.blue[1].tag}, ${matchData.data[0].players.blue[2].name}#${matchData.data[0].players.blue[2].tag}, ${matchData.data[0].players.blue[3].name}#${matchData.data[0].players.blue[3].tag}, ${matchData.data[0].players.blue[4].name}#${matchData.data[0].players.blue[4].tag}`,
                        
                    },
                ],
                timestamp: new Date()
            }
            const rankEmbed = {
                title: `${accountData.data.name}#${accountData.data.tag}'s most recent match - general`,
                thumbnail: {
                    url: matchData.data[0].players.all_players[arraynum].assets.agent.small
                },
                description: `Game played on ${matchData.data[0].metadata.map} at ${matchData.data[0].metadata.game_start_patched}. ${matchData.data[0].metadata.rounds_played} rounds were played.`,
                fields: [
                    {
                        name: 'K/D/A',
                        value: `${matchData.data[0].players.all_players[arraynum].stats.kills}/${matchData.data[0].players.all_players[arraynum].stats.deaths}/${matchData.data[0].players.all_players[arraynum].stats.assists}`,
                        
                    },
                    {
                        name: 'Head/Body/Legshots',
                        value: `${matchData.data[0].players.all_players[arraynum].stats.headshots}/${matchData.data[0].players.all_players[arraynum].stats.bodyshots}/${matchData.data[0].players.all_players[arraynum].stats.legshots}`,
                        
                    },
                    {
                        name: 'Score',
                        value: `${matchData.data[0].players.all_players[arraynum].stats.score}`,
                        inline: true,
                    },
                    {
                        name: 'ACS',
                        value: `${acs}`,
                        inline: true,
                    },
                    {
                        name: 'AFK Rounds',
                        value: `${matchData.data[0].players.all_players[arraynum].behavior.afk_rounds}`,
                        inline: true,
                    },
                    {
                        name: 'Incoming/Outgoing Friendly Fire',
                        value: `${matchData.data[0].players.all_players[arraynum].behavior.friendly_fire.incoming}/${matchData.data[0].players.all_players[arraynum].behavior.friendly_fire.outgoing}`,
                        inline: true,
                    },
                ],
                image: {
                    url: matchData.data[0].players.all_players[arraynum].assets.card.wide
                },
                timestamp: new Date()
            }  
            await interaction.editReply({ embeds: [rankEmbed, teamsEmbed] })
        }
        

    }
}